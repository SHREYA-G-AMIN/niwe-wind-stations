import { useState } from "react";
import type { CSSProperties } from "react";
import type { StationFeatureCollection } from "../../types/station";

interface StationTableProps {
  stations: StationFeatureCollection;
  selectedStationId: string | null;
  onStationSelect: (stationId: string) => void;
}

const PAGE_SIZE = 20;

const cardStyle: CSSProperties = {
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  boxShadow: "var(--shadow)",
  minWidth: 0,
  padding: "1.25rem",
  textAlign: "left",
};

const headers = [
  "Station Name",
  "State",
  "District",
  "Status",
  "Mast Height (m)",
  "Elevation (m)",
  "Wind Speed (m/s)",
  "Power Density (W/m²)",
  "Coordinates",
];

const columnWidths = [
  "210px",
  "155px",
  "175px",
  "135px",
  "145px",
  "135px",
  "145px",
  "175px",
  "220px",
];

const numberFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 2,
});

function formatMeasurement(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value)
    ? numberFormatter.format(value)
    : "N/A";
}

function StationTable({
  stations,
  selectedStationId,
  onStationSelect,
}: StationTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalStations = stations.features.length;
  const totalPages = Math.max(1, Math.ceil(totalStations / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageStations = stations.features.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  return (
    <section style={cardStyle} aria-labelledby="station-explorer-title">
      <style>
        {`
          .station-explorer-row {
            transition: background-color 120ms ease;
          }

          .station-explorer-row:hover {
            background-color: var(--social-bg);
          }

          .station-explorer-row[aria-selected="true"] {
            background-color: var(--accent-bg);
          }

          .station-explorer-row:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: -2px;
          }
        `}
      </style>
      <div
        style={{
          alignItems: "baseline",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem 1rem",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h2 id="station-explorer-title" style={{ margin: 0 }}>
            Station Explorer
          </h2>
          <p
            style={{
              color: "var(--text)",
              fontSize: "0.85rem",
              marginTop: "0.25rem",
            }}
          >
            Select a row to locate that station on the map.
          </p>
        </div>
        <p style={{ color: "var(--text)", fontSize: "0.9rem" }}>
          Showing {totalStations} stations
        </p>
      </div>

      <div style={{ overflowX: "auto", width: "100%" }}>
        <table
          style={{
            borderCollapse: "collapse",
            color: "var(--text-h)",
            minWidth: "1495px",
            textAlign: "left",
            width: "100%",
          }}
        >
          <colgroup>
            {columnWidths.map((width, index) => (
              <col key={headers[index]} style={{ width }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  style={{
                    background: "var(--social-bg)",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--text)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    padding: "0.85rem 1rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageStations.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  style={{
                    color: "var(--text)",
                    padding: "1.5rem 0.75rem",
                    textAlign: "center",
                  }}
                >
                  No stations match the current filters.
                </td>
              </tr>
            ) : (
              pageStations.map((station) => {
                const [longitude, latitude] = station.geometry.coordinates;
                const hasCoordinates =
                  Number.isFinite(latitude) && Number.isFinite(longitude);

                return (
                  <tr
                    key={station.properties.id}
                    className="station-explorer-row"
                    aria-selected={selectedStationId === station.properties.id}
                    tabIndex={0}
                    onClick={() => onStationSelect(station.properties.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onStationSelect(station.properties.id);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td style={cellStyle}>{station.properties.station_name || "N/A"}</td>
                    <td style={cellStyle}>{station.properties.state || "N/A"}</td>
                    <td style={cellStyle}>{station.properties.district || "N/A"}</td>
                    <td style={cellStyle}>{station.properties.status || "N/A"}</td>
                    <td style={cellStyle}>{formatMeasurement(station.properties.mast_height_m)}</td>
                    <td style={cellStyle}>{formatMeasurement(station.properties.elevation_m)}</td>
                    <td style={cellStyle}>{formatMeasurement(station.properties.maws)}</td>
                    <td style={cellStyle}>{formatMeasurement(station.properties.mawpd)}</td>
                    <td style={cellStyle}>
                      {hasCoordinates
                        ? `${latitude}, ${longitude}`
                        : "N/A"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          alignItems: "center",
          color: "var(--text)",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          style={paginationButtonStyle}
        >
          Previous
        </button>
        <span aria-live="polite">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((page) => Math.min(totalPages, page + 1))
          }
          style={paginationButtonStyle}
        >
          Next
        </button>
      </div>
    </section>
  );
}

const cellStyle: CSSProperties = {
  borderBottom: "1px solid var(--border)",
  fontSize: "0.9rem",
  padding: "0.85rem 1rem",
  whiteSpace: "nowrap",
};

const paginationButtonStyle: CSSProperties = {
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  color: "var(--text-h)",
  cursor: "pointer",
  font: "inherit",
  padding: "0.45rem 0.75rem",
};

export default StationTable;
