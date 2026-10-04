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
import { getWindSpeedStats } from "../../utils/analyticsUtils";

interface WindSpeedChartProps {
  stations: StationFeatureCollection;
}

interface WindSpeedBin {
  range: string;
  count: number;
}

interface WindSpeedStatistic {
  label: string;
  value: number | null;
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
  maximumFractionDigits: 1,
});

function createDistribution(values: number[]): WindSpeedBin[] {
  if (values.length === 0) return [];

  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const binCount =
    minimum === maximum ? 1 : Math.min(6, Math.ceil(Math.sqrt(values.length)));
  const binWidth = (maximum - minimum) / binCount;
  const bins = Array.from({ length: binCount }, (_, index) => {
    const binMinimum = minimum + index * binWidth;
    const binMaximum =
      index === binCount - 1 ? maximum : minimum + (index + 1) * binWidth;

    return {
      range: `${numberFormatter.format(binMinimum)}–${numberFormatter.format(binMaximum)}`,
      count: 0,
    };
  });

  for (const value of values) {
    const index =
      minimum === maximum
        ? 0
        : Math.min(Math.floor((value - minimum) / binWidth), binCount - 1);
    bins[index].count += 1;
  }

  return bins;
}

function WindSpeedChart({ stations }: WindSpeedChartProps) {
  const stats = getWindSpeedStats(stations);
  const values = stations.features
    .map((station) => station.properties.maws)
    .filter(
      (value): value is number =>
        typeof value === "number" && Number.isFinite(value),
    );
  const distribution = createDistribution(values);
  const statistics: WindSpeedStatistic[] = [
    { label: "Average", value: stats.average },
    { label: "Minimum", value: stats.minimum },
    { label: "Maximum", value: stats.maximum },
  ];

  return (
    <section style={cardStyle} aria-label="Wind Speed Analysis">
      <h2 style={{ margin: "0 0 1rem" }}>Wind Speed Analysis</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "0.75rem",
          marginBottom: "1.25rem",
        }}
      >
        {statistics.map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "var(--social-bg)",
              borderRadius: "8px",
              padding: "0.75rem",
              minWidth: 0,
            }}
          >
            <p
              style={{
                color: "var(--text)",
                fontSize: "0.8rem",
                margin: "0 0 0.25rem",
              }}
            >
              {label}
            </p>
            <p
              style={{
                color: "var(--text-h)",
                fontSize: "clamp(1rem, 3vw, 1.4rem)",
                fontVariantNumeric: "tabular-nums",
                fontWeight: 700,
                lineHeight: 1.2,
                margin: 0,
                overflowWrap: "anywhere",
              }}
            >
              {value === null ? "—" : `${numberFormatter.format(value)} m/s`}
            </p>
          </div>
        ))}
      </div>

      {distribution.length === 0 ? (
        <p>No valid wind-speed measurements are available.</p>
      ) : (
        <div style={{ height: 300, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={distribution}
              margin={{ top: 8, right: 16, bottom: 12, left: 0 }}
            >
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="range"
                angle={0}
                textAnchor="middle"
                interval="preserveStartEnd"
                height={48}
                tick={{ fill: "var(--text)", fontSize: 10 }}
                label={{
                  value: "Wind speed (m/s)",
                  position: "insideBottom",
                  offset: -4,
                  fill: "var(--text)",
                  fontSize: 11,
                }}
              />
              <YAxis
                allowDecimals={false}
                width={40}
                tick={{ fill: "var(--text)", fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [value, "Stations"]}
                labelFormatter={(label) => `Wind speed: ${label} m/s`}
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
                fill="#0ea5e9"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default WindSpeedChart;
