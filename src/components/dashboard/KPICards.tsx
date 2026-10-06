import type { CSSProperties } from "react";
import type { StationFeatureCollection } from "../../types/station";
import {
  getClosedStations,
  getOperationalStations,
  getStateCount,
  getTotalStations,
} from "../../utils/analyticsUtils";

interface KPICardsProps {
  stations: StationFeatureCollection;
}

interface KPI {
  label: string;
  value: number;
  accent: string;
}

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 13rem), 1fr))",
  gap: "1rem",
  width: "100%",
  textAlign: "left",
};

const numberFormatter = new Intl.NumberFormat("en-IN");

function KPICards({ stations }: KPICardsProps) {
  const kpis: KPI[] = [
    {
      label: "Total Stations",
      value: getTotalStations(stations),
      accent: "#2563eb",
    },
    {
      label: "Operational",
      value: getOperationalStations(stations),
      accent: "#16a34a",
    },
    {
      label: "Closed",
      value: getClosedStations(stations),
      accent: "#dc2626",
    },
    {
      label: "States/Areas",
      value: getStateCount(stations),
      accent: "#7c3aed",
    },
  ];

  return (
    <section aria-label="Station key performance indicators" style={gridStyle}>
      {kpis.map(({ label, value, accent }) => (
        <article
          key={label}
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderLeft: `4px solid ${accent}`,
            borderRadius: "10px",
            boxShadow: "var(--shadow)",
            minWidth: 0,
            padding: "1.25rem 1.5rem",
          }}
        >
          <h2
            style={{
              color: "var(--text)",
              fontSize: "0.95rem",
              fontWeight: 500,
              letterSpacing: 0,
              lineHeight: 1.4,
              margin: "0 0 0.5rem",
            }}
          >
            {label}
          </h2>
          <p
            style={{
              color: "var(--text-h)",
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              fontVariantNumeric: "tabular-nums",
              fontWeight: 700,
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            {numberFormatter.format(value)}
          </p>
        </article>
      ))}
    </section>
  );
}

export default KPICards;
