import json
from datetime import date, datetime
from math import asin, cos, radians, sin, sqrt
from pathlib import Path

import pandas as pd

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data" / "processed"

CLEAN_FILE = DATA_DIR / "stations_cleaned.csv"
VALIDATED_FILE = DATA_DIR / "stations_validated.csv"
REVIEW_FILE = DATA_DIR / "review_required.csv"
QUALITY_FILE = DATA_DIR / "data_quality.json"

VALID_STATUS = {"Operational", "Closed"}
STATE_OUTLIER_KM = 700


def fy_of(iso):
    d = date.fromisoformat(iso)
    start = d.year if d.month >= 4 else d.year - 1
    return f"{start}-{start + 1}"


def km(lat1, lon1, lat2, lon2):
    a = sin(radians(lat2 - lat1) / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(radians(lon2 - lon1) / 2) ** 2
    return 12742 * asin(sqrt(a))


def validate():
    df = pd.read_csv(CLEAN_FILE, encoding="utf-8-sig")
    issues = {i: [] for i in df.index}
    if df["clean_notes"].notna().any():
        for i, note in df["clean_notes"].dropna().items():
            issues[i].append(note)

    for i, r in df.iterrows():
        # Coordinates
        if pd.isna(r.latitude) or pd.isna(r.longitude):
            issues[i].append("Missing coordinates")
        else:
            if not 6 <= r.latitude <= 38:
                issues[i].append(f"Latitude outside India: {r.latitude}")
            if not 68 <= r.longitude <= 98:
                issues[i].append(f"Longitude outside India: {r.longitude}")

        # Mast height
        if pd.isna(r.mast_height_m):
            issues[i].append("Mast height missing or not numeric")
        elif not 10 <= r.mast_height_m <= 150:
            issues[i].append(f"Unusual mast height: {r.mast_height_m}")

        # Dates
        if pd.isna(r.commenced_on):
            issues[i].append("Commencement date missing/invalid")
        else:
            if pd.notna(r.financial_year_commenced) and fy_of(r.commenced_on) != r.financial_year_commenced:
                issues[i].append(f"Commenced date {r.commenced_on} does not match FY {r.financial_year_commenced}")
            if pd.notna(r.closed_on):
                if r.closed_on < r.commenced_on:
                    issues[i].append("Closed before commenced")
                if pd.notna(r.financial_year_closed) and fy_of(r.closed_on) != r.financial_year_closed:
                    issues[i].append(f"Closed date {r.closed_on} does not match FY {r.financial_year_closed}")
        if r.status == "Closed" and pd.isna(r.closed_on) and pd.notna(r.financial_year_closed):
            issues[i].append("Closed but no closure date")

        # Other fields
        if r.status not in VALID_STATUS:
            issues[i].append(f"Invalid status: {r.status}")
        if pd.isna(r.district):
            issues[i].append("District missing in PDF")

    # Duplicates
    key = ["station_name", "district", "commenced_on", "latitude", "longitude"]
    for i in df[df.duplicated(key, keep=False)].index:
        issues[i].append("Possible duplicate record")

    # Coordinates far from the rest of their state (catches mis-read digits)
    for state, g in df.dropna(subset=["latitude", "longitude"]).groupby("state"):
        mlat, mlon = g.latitude.median(), g.longitude.median()
        for i, r in g.iterrows():
            d = km(mlat, mlon, r.latitude, r.longitude)
            if d > STATE_OUTLIER_KM:
                issues[i].append(f"Coordinates {d:.0f} km from state median")

    df["review_required"] = [bool(v) for v in issues.values()]
    df["review_reason"] = ["; ".join(v) for v in issues.values()]
    df.to_csv(VALIDATED_FILE, index=False, encoding="utf-8-sig")
    df[df.review_required][["id", "pdf_page", "serial_no", "station_name", "state", "review_reason"]] \
        .to_csv(REVIEW_FILE, index=False, encoding="utf-8-sig")

    serials = set(df.serial_no.dropna().astype(int))
    missing_serials = [n for n in range(1, max(serials) + 1) if n not in serials]

    quality = {
        "data_source": "NIWE / Government of India (MNRE list as on 31.07.2026)",
        "total_records": len(df),
        "records_by_source_table": df.source_table.value_counts().to_dict(),
        "records_by_status": df.status.value_counts().to_dict(),
        "records_missing_coordinates": int(df[["latitude", "longitude"]].isna().any(axis=1).sum()),
        "records_requiring_review": int(df.review_required.sum()),
        "missing_pdf_serial_numbers": missing_serials,
        "last_processed": datetime.now().isoformat(timespec="seconds"),
    }
    QUALITY_FILE.write_text(json.dumps(quality, indent=2), encoding="utf-8")

    print(json.dumps(quality, indent=2))
    print(df[df.review_required].review_reason.str.replace(r"[\d.\-]+", "#", regex=True).str[:40].value_counts().head(12))


if __name__ == "__main__":
    validate()