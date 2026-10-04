import type { CSSProperties } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { StationFeatureCollection } from "../../types/station";
import {
  getClosedStations,
  getOperationalStations,
} from "../../utils/analyticsUtils";

interface StatusChartProps {
  stations: StationFeatureCollection;
}

interface StatusDatum {
  name: string;
  value: number;
  percentage: number;
}

const cardStyle: CSSProperties = {
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  boxShadow: "var(--shadow)",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  minHeight: 600,
  minWidth: 0,
  padding: "1.25rem",
  textAlign: "left",
};

const statusColors: Record<StatusDatum["name"], string> = {
  Operational: "#16a34a",
  Closed: "#dc2626",
};

function StatusChart({ stations }: StatusChartProps) {
  const operational = getOperationalStations(stations);
  const closed = getClosedStations(stations);
  const total = operational + closed;
  const data: StatusDatum[] = [
    { name: "Operational", value: operational, percentage: 0 },
    { name: "Closed", value: closed, percentage: 0 },
  ].map((status) => ({
    ...status,
    percentage: total > 0 ? (status.value / total) * 100 : 0,
  }));

  return (
    <section
      className="station-status-card"
      style={cardStyle}
      aria-label="Station Status"
    >
      <style>
        {`
          @media (max-width: 900px) {
            .station-status-card {
              min-height: 450px;
            }
          }
        `}
      </style>
      <h2 style={{ margin: "0 0 1rem" }}>Station Status</h2>
      {total === 0 ? (
        <p
          style={{
            alignItems: "center",
            display: "flex",
            flex: 1,
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          No station status data is available.
        </p>
      ) : (
        <div style={{ flex: 1, minHeight: 0, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="46%"
                innerRadius="52%"
                outerRadius="76%"
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={statusColors[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(_value, _name, item) => {
                  const status = item.payload as StatusDatum;
                  return [
                    `${status.value} stations (${status.percentage.toFixed(1)}%)`,
                    status.name,
                  ];
                }}
                contentStyle={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  color: "var(--text-h)",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default StatusChart;
