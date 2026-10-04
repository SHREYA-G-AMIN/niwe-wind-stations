import json
import shutil
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

import pandas as pd

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data" / "processed"
PUBLIC_DATA = BASE_DIR.parent / "public" / "data"   # frontend static folder

VALIDATED_FILE = DATA_DIR / "stations_validated.csv"
QUALITY_FILE = DATA_DIR / "data_quality.json"

COLORS = {"Operational": "ff00aa00", "Closed": "ff0000ff", "Unknown": "ff888888"}  # KML = aabbggrr
FIELDS = [
    ("Station", "station_name"), ("District", "district"), ("Status", "status"),
    ("Source", "source_table"), ("Commenced", "commenced_on"), ("Closed", "closed_on"),
    ("Mast height (m)", "mast_height_m"), ("Elevation (m)", "elevation_m"),
    ("Mean wind speed (m/s)", "maws"), ("Wind power density (W/m2)", "mawpd"),
    ("Project type", "project_type"), ("PDF page", "pdf_page"),
]


def value(v):
    return None if pd.isna(v) else (int(v) if isinstance(v, float) and v.is_integer() else v)


def to_geojson(df):
    features = []
    for _, r in df.dropna(subset=["latitude", "longitude"]).iterrows():
        props = {k: value(v) for k, v in r.drop(["latitude", "longitude"]).items()}
        features.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [r.longitude, r.latitude]},  # lon, lat
            "properties": {**props, "latitude": r.latitude, "longitude": r.longitude},
        })
    return {"type": "FeatureCollection", "features": features}


def to_kml(df):
    styles = "".join(
        f'<Style id="{s}"><IconStyle><color>{c}</color><scale>0.9</scale><Icon><href>'
        f'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href></Icon></IconStyle></Style>'
        for s, c in COLORS.items()
    )
    folders = []
    for state, g in df.dropna(subset=["latitude", "longitude"]).groupby("state"):
        marks = []
        for _, r in g.iterrows():
            rows = "".join(f"<tr><td><b>{l}</b></td><td>{escape(str(value(r[c])))}</td></tr>"
                           for l, c in FIELDS if value(r[c]) is not None)
            span = ""
            if pd.notna(r.commenced_on):
                end = f"<end>{r.closed_on}</end>" if pd.notna(r.closed_on) else ""
                span = f"<TimeSpan><begin>{r.commenced_on}</begin>{end}</TimeSpan>"
            marks.append(
                f"<Placemark><name>{escape(r.station_name)}</name>"
                f"<description><![CDATA[<table>{rows}</table>]]></description>{span}"
                f"<styleUrl>#{r.status}</styleUrl>"
                f"<Point><coordinates>{r.longitude},{r.latitude},0</coordinates></Point></Placemark>"
            )
        folders.append(f"<Folder><name>{escape(state)} ({len(g)})</name>{''.join(marks)}</Folder>")
    return ('<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document>'
            f"<name>NIWE Wind Measurement Stations</name>{styles}{''.join(folders)}</Document></kml>")


def export():
    df = pd.read_csv(VALIDATED_FILE, encoding="utf-8-sig")

    df.to_csv(DATA_DIR / "stations.csv", index=False, encoding="utf-8-sig")
    (DATA_DIR / "stations.geojson").write_text(json.dumps(to_geojson(df), ensure_ascii=False), encoding="utf-8")
    kml = to_kml(df)
    (DATA_DIR / "stations.kml").write_text(kml, encoding="utf-8")
    with zipfile.ZipFile(DATA_DIR / "stations.kmz", "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("doc.kml", kml)

    if PUBLIC_DATA.parent.exists():
        PUBLIC_DATA.mkdir(exist_ok=True)
        for name in ("stations.geojson", "stations.csv", "data_quality.json"):
            shutil.copy(DATA_DIR / name, PUBLIC_DATA / name)
        print(f"Copied to {PUBLIC_DATA}")
    print(f"Exported {len(df)} rows; {df[['latitude','longitude']].notna().all(axis=1).sum()} have coordinates")


if __name__ == "__main__":
    export()