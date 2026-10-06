import csv
import json
import re
from datetime import date
from pathlib import Path

import pandas as pd

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data" / "processed"

RAW_FILE = DATA_DIR / "raw_tables.csv"
CLEAN_FILE = DATA_DIR / "stations_cleaned.csv"

COLUMNS = [
    "serial_no", "state_serial_no", "station_name", "district",
    "commenced_on", "closed_on", "financial_year_commenced",
    "financial_year_closed", "mast_height_m",
    "latitude_deg", "latitude_min", "latitude_sec",
    "longitude_deg", "longitude_min", "longitude_sec",
    "elevation_m", "maws", "mawpd",
]

# Source state names that need standardising
STATE_FIX = {"PONDICHERRY": "PUDUCHERRY"}
LADAKH_DISTRICTS = {"LEH", "KARGIL"}  # PDF lists these under "KASHMIR"
MARKERS = {"@": "SNA project", "#": "Other project"}  # PDF legend


def clean_text(value):
    if value is None:
        return ""
    value = re.sub(r"\s+", " ", str(value)).strip()
    return "" if value.upper() in {"-", "--", "—", "–", "−", "NA", "N/A", "NULL"} else value


def is_state_heading(row):
    """['1', '', 'TAMIL NADU', '', ...] or ['4.', '', 'MAHARASHTRA', ...]"""
    return (
        len(row) >= 3
        and row[0].rstrip(".").isdigit()
        and not row[1]
        and bool(row[2])
        and not any(row[3:])
    )


def is_station_row(row):
    """Normal rows have both serial numbers. Second readings of the same
    station (e.g. 'KETHANUR 2') have both blank, but still have dates."""
    if len(row) != len(COLUMNS) or not row[2]:
        return False
    numbered = row[0].isdigit() and row[1].isdigit()
    revision = not row[0] and not row[1] and bool(row[4])
    return numbered or revision


def split_marker(name):
    marks = "".join(re.findall(r"[@#*]", name))
    return clean_text(re.sub(r"[@#*]", " ", name)), marks


def parse_date(value, field, notes):
    """PDF dates are M-D-YYYY. Day-first is used only when the first part
    is > 12 or a part has a leading zero (e.g. 08-06-2018, 24-04-2024).
    validate.py cross-checks every date against the financial-year columns."""
    value = clean_text(value)
    if not value:
        return ""
    m = re.match(r"^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})", value)
    if not m:
        notes.append(f"Unrecognized {field}: {value}")
        return ""
    a, b, year = m.groups()
    day_first = int(a) > 12 or a.startswith("0") or b.startswith("0")
    day, month = (int(a), int(b)) if day_first else (int(b), int(a))
    if "RECONFIGURED" in value.upper():
        notes.append(f"{field} has a 'Reconfigured' note: {value}")
    try:
        return date(int(year), month, day).isoformat()
    except ValueError:
        notes.append(f"Invalid {field}: {value}")
        return ""


def dms_to_decimal(deg, minute, sec, label, notes):
    if not deg or not minute:
        if deg or minute or sec:
            notes.append(f"Incomplete {label} (deg/min missing)")
        return None
    if not sec:
        sec = "0"
        notes.append(f"{label} seconds missing in PDF; taken as 0")
    try:
        d, m, s = float(deg), float(minute), float(sec)
    except ValueError:
        notes.append(f"Invalid {label}: {deg} {minute} {sec}")
        return None
    if not (0 <= m < 60 and 0 <= s < 60):
        notes.append(f"{label} minutes/seconds out of range: {deg} {minute} {sec}")
        return None
    return round(d + m / 60 + s / 3600, 6)


def to_number(value, field, notes):
    value = clean_text(value)
    if not value:
        return None
    try:
        return float(value)
    except ValueError:
        notes.append(f"Invalid {field}: {value}")
        return None


def clean_data():
    if not RAW_FILE.exists():
        raise FileNotFoundError(f"{RAW_FILE} not found. Run extract.py first.")

    records, state, source = [], "", "Mast"

    with RAW_FILE.open("r", encoding="utf-8-sig", newline="") as f:
        for raw in csv.DictReader(f):
            try:
                row = [clean_text(v) for v in json.loads(raw["row_data"])]
            except (json.JSONDecodeError, TypeError):
                continue
            if not any(row):
                continue

            if "TELECOM TOWERS" in row[0].upper():
                source = "Telecom tower"      # second table in the PDF
                continue
            if is_state_heading(row):
                state = re.sub(r"\s*&\s*", " & ", row[2].upper())
                state = STATE_FIX.get(state, state)
                continue
            if not is_station_row(row):
                continue

            rec = dict(zip(COLUMNS, row))
            notes = []
            rec["pdf_page"] = int(raw["page_number"])
            rec["source_table"] = source
            rec["station_name"], marks = split_marker(rec["station_name"])
            rec["project_type"] = ", ".join(MARKERS.get(c, f"'{c}' (legend not given)") for c in marks)
            rec["district"] = rec["district"].upper()
            rec["is_revision"] = not rec["serial_no"]

            # KASHMIR in the PDF contains Ladakh districts
            rec["state"] = "LADAKH" if rec["district"] in LADAKH_DISTRICTS else (
                "JAMMU & KASHMIR" if state in {"JAMMU", "KASHMIR"} else state)

            closed = rec["closed_on"].upper()
            if closed in {"CLOSED", "IN OPERATION"}:
                rec["status"] = "Operational" if closed == "IN OPERATION" else "Closed"
                rec["closed_on"] = ""
            else:
                rec["status"] = "Closed" if rec["closed_on"] else "Unknown"
            if rec["financial_year_closed"].upper() in {"CLOSED", "IN OPERATION"}:
                rec["financial_year_closed"] = ""

            for field in ("commenced_on", "closed_on"):
                rec[field] = parse_date(rec[field], field, notes)

            rec["latitude"] = dms_to_decimal(rec["latitude_deg"], rec["latitude_min"], rec["latitude_sec"], "latitude", notes)
            rec["longitude"] = dms_to_decimal(rec["longitude_deg"], rec["longitude_min"], rec["longitude_sec"], "longitude", notes)

            for field in ("mast_height_m", "elevation_m", "maws", "mawpd"):
                rec[field] = to_number(rec[field], field, notes)

            rec["clean_notes"] = "; ".join(notes)
            records.append(rec)

    if not records:
        raise ValueError("No station records recognised. Check raw_tables.csv.")

    df = pd.DataFrame(records)
    df.insert(0, "id", [f"S{i:04d}" for i in range(1, len(df) + 1)])
    df = df.drop(columns=[c for c in df.columns if c.endswith(("_deg", "_min", "_sec"))])
    df.to_csv(CLEAN_FILE, index=False, encoding="utf-8-sig")

    print(f"Station rows recognised: {len(df)}")
    print(df.groupby(["source_table", "state"]).size().to_string())


if __name__ == "__main__":
    clean_data()