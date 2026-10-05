import { useState } from "react";
import type { CSSProperties } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StationFeatureCollection } from "../../types/station";
import { getStationsByState } from "../../utils/analyticsUtils";

interface StateStatisticsProps {
  stations: StationFeatureCollection;
}

const COLLAPSED_STATE_LIMIT = 8;
const ROW_HEIGHT = 34;
const CHART_CHROME_HEIGHT = 56;
const COLLAPSED_CHART_HEIGHT = 264;
const COLLAPSED_CONTROL_HEIGHT = 36;
const MAX_EXPANDED_CHART_HEIGHT = 680;

const cardStyle: CSSProperties = {
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  boxShadow: "var(--shadow)",
  minWidth: 0,
  padding: "1.25rem",
  textAlign: "left",
};

function StateStatistics({ stations }: StateStatisticsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sortedData = getStationsByState(stations).sort(
    (a, b) => b.count - a.count || a.state.localeCompare(b.state),
  );
  const data = isExpanded
    ? sortedData
    : sortedData.slice(0, COLLAPSED_STATE_LIMIT);
  const hasMoreStates = sortedData.length > COLLAPSED_STATE_LIMIT;
  const chartHeight = isExpanded
    ? Math.min(
        Math.max(300, data.length * ROW_HEIGHT + CHART_CHROME_HEIGHT),
        MAX_EXPANDED_CHART_HEIGHT,
      )
    : hasMoreStates
      ? COLLAPSED_CHART_HEIGHT
      : 300;

  return (
    <section style={cardStyle} aria-label="Stations by State">
      <h2 style={{ margin: "0 0 0.25rem" }}>Stations by State</h2>
      <p style={{ color: "var(--text)", fontSize: "0.85rem", marginBottom: "1rem" }}>
        Hover over a bar to see the state name.
      </p>
      {data.length === 0 ? (
        <p>No state data is available.</p>
      ) : (
        <>
          <div
            id="state-statistics-chart"
            style={{ height: chartHeight, width: "100%" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 4, right: 20, bottom: 4, left: 8 }}
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fill: "var(--text)", fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="state"
                  width={8}
                  tick={false}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value) => [value, "Stations"]}
                  labelFormatter={(label) => `State: ${label}`}
                  contentStyle={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    color: "var(--text-h)",
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Stations"
                  fill="#2563eb"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {hasMoreStates && (
            <button
              type="button"
              aria-expanded={isExpanded}
              aria-controls="state-statistics-chart"
              onClick={() => setIsExpanded((expanded) => !expanded)}
              style={{
                background: "transparent",
                border: 0,
                color: "var(--text)",
                cursor: "pointer",
                font: "inherit",
                fontSize: "0.9rem",
                height: COLLAPSED_CONTROL_HEIGHT,
                marginTop: 0,
                padding: 0,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              {isExpanded ? "Show less ↑" : "View all ↓"}
            </button>
          )}
        </>
      )}
    </section>
  );
}

export default StateStatistics;
