import json
from pathlib import Path

import pandas as pd

P = Path(__file__).resolve().parents[1] / "data" / "processed"
df = pd.read_csv(P / "stations.csv")


def test_row_count_matches_pdf():
    assert len(df) == 1004


def test_coordinates_valid():
    ok = df.dropna(subset=["latitude", "longitude"])
    assert ok.latitude.between(6, 38).all() and ok.longitude.between(68, 98).all()


def test_no_duplicates():
    assert not df.duplicated(["station_name", "district", "commenced_on", "latitude", "longitude"]).any()


def test_status_valid():
    assert set(df.status) <= {"Operational", "Closed"}


def test_geojson_matches_csv():
    gj = json.loads((P / "stations.geojson").read_text(encoding="utf-8"))
    assert len(gj["features"]) == df[["latitude", "longitude"]].notna().all(axis=1).sum()
