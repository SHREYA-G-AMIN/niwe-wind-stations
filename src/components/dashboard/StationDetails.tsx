import type { CSSProperties } from "react";
import type { StationFeature } from "../../types/station";

interface StationDetailsProps {
  station: StationFeature | null;
  onClose: () => void;
}

const cardStyle: CSSProperties = {
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  boxShadow: "var(--shadow)",
  minWidth: 0,
  padding: "1.25rem",
  textAlign: "left",
};

const numberFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 2,
});

function formatText(value: string | null | undefined): string {
  return value && value.trim().length > 0 ? value : "N/A";
}

function formatNumber(value: number | null | undefined): string {
  return typeof value === "number" && Number.isFinite(value)
    ? numberFormatter.format(value)
    : "N/A";
}

function StationDetails({ station, onClose }: StationDetailsProps) {
  if (!station) return null;

  const { properties } = station;
  const details = [
    { label: "Status", value: formatText(properties.status) },
    { label: "State", value: formatText(properties.state) },
    { label: "District", value: formatText(properties.district) },
    {
      label: "Mast Height",
      value: `${formatNumber(properties.mast_height_m)}${typeof properties.mast_height_m === "number" && Number.isFinite(properties.mast_height_m) ? " m" : ""}`,
    },
    {
      label: "Elevation",
      value: `${formatNumber(properties.elevation_m)}${typeof properties.elevation_m === "number" && Number.isFinite(properties.elevation_m) ? " m" : ""}`,
    },
    {
      label: "Wind Speed (MAWS)",
      value: `${formatNumber(properties.maws)}${typeof properties.maws === "number" && Number.isFinite(properties.maws) ? " m/s" : ""}`,
    },
    {
      label: "Power Density (MAWPD)",
      value: `${formatNumber(properties.mawpd)}${typeof properties.mawpd === "number" && Number.isFinite(properties.mawpd) ? " W/m²" : ""}`,
    },
    { label: "Commenced On", value: formatText(properties.commenced_on) },
    { label: "Latitude", value: formatNumber(properties.latitude) },
    { label: "Longitude", value: formatNumber(properties.longitude) },
  ];

  return (
    <section style={cardStyle} aria-labelledby="station-details-title">
      <div
        style={{
          alignItems: "flex-start",
          display: "flex",
          gap: "1rem",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h2 id="station-details-title" style={{ margin: 0 }}>
            {formatText(properties.station_name)}
          </h2>
          <p style={{ color: "var(--text)", marginTop: "0.25rem" }}>
            Station Details
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            color: "var(--text-h)",
            cursor: "pointer",
            font: "inherit",
            padding: "0.45rem 0.75rem",
          }}
        >
          Close
        </button>
      </div>

      <dl
        style={{
          display: "grid",
          gap: "0.75rem 1.25rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 12rem), 1fr))",
          margin: 0,
        }}
      >
        {details.map(({ label, value }) => (
          <div
            key={label}
            style={{
              borderBottom: "1px solid var(--border)",
              minWidth: 0,
              paddingBottom: "0.5rem",
            }}
          >
            <dt style={{ color: "var(--text)", fontSize: "0.8rem" }}>
              {label}
            </dt>
            <dd
              style={{
                color: "var(--text-h)",
                fontVariantNumeric: "tabular-nums",
                margin: "0.2rem 0 0",
                overflowWrap: "anywhere",
              }}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default StationDetails;
