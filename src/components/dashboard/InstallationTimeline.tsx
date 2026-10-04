import type { CSSProperties } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StationFeatureCollection } from "../../types/station";
import { getInstallationTimeline } from "../../utils/analyticsUtils";

interface InstallationTimelineProps {
  stations: StationFeatureCollection;
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

function InstallationTimeline({ stations }: InstallationTimelineProps) {
  const data = getInstallationTimeline(stations);
  const yearTickInterval = Math.max(0, Math.ceil(data.length / 12) - 1);

  return (
    <section style={cardStyle} aria-label="Installation Timeline">
      <h2 style={{ margin: "0 0 1rem" }}>Installation Timeline</h2>
      {data.length === 0 ? (
        <p>No valid installation dates are available.</p>
      ) : (
        <div style={{ height: 420, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 16, bottom: 12, left: 0 }}
            >
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                type="number"
                domain={["dataMin", "dataMax"]}
                allowDecimals={false}
                interval={yearTickInterval}
                tick={{ fill: "var(--text)", fontSize: 11 }}
                label={{
                  value: "Year",
                  position: "insideBottom",
                  offset: -4,
                  fill: "var(--text)",
                  fontSize: 11,
                }}
              />
              <YAxis
                allowDecimals={false}
                domain={[0, "dataMax"]}
                width={40}
                tick={{ fill: "var(--text)", fontSize: 12 }}
                label={{
                  value: "Stations",
                  angle: -90,
                  position: "insideLeft",
                  fill: "var(--text)",
                  fontSize: 11,
                }}
              />
              <Tooltip
                labelFormatter={(year) => `Year: ${year}`}
                formatter={(value) => [value, "Stations"]}
                contentStyle={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  color: "var(--text-h)",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Stations"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default InstallationTimeline;
