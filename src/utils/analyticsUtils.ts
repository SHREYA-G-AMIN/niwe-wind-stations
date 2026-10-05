import type {
  StationFeature,
  StationFeatureCollection,
} from "../types/station";

export interface NumericStats {
  average: number | null;
  minimum: number | null;
  maximum: number | null;
}

export interface StateStationCount {
  state: string;
  count: number;
}

export interface StateAverage {
  state: string;
  average: number;
}

export interface TimelineCount {
  year: number;
  count: number;
}

function getValidValues(
  stations: StationFeatureCollection,
  getValue: (station: StationFeature) => number | null | undefined,
): number[] {
  return stations.features
    .map(getValue)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
}

function calculateStats(values: number[]): NumericStats {
  if (values.length === 0) {
    return { average: null, minimum: null, maximum: null };
  }

  const sum = values.reduce((total, value) => total + value, 0);

  return {
    average: sum / values.length,
    minimum: Math.min(...values),
    maximum: Math.max(...values),
  };
}

function getAverageByState(
  stations: StationFeatureCollection,
  getValue: (station: StationFeature) => number | null | undefined,
): StateAverage[] {
  const valuesByState = new Map<string, number[]>();

  for (const station of stations.features) {
    const state = station.properties.state;
    const value = getValue(station);

    if (
      typeof state !== "string" ||
      state.trim().length === 0 ||
      typeof value !== "number" ||
      !Number.isFinite(value)
    ) {
      continue;
    }

    const stateValues = valuesByState.get(state) ?? [];
    stateValues.push(value);
    valuesByState.set(state, stateValues);
  }

  return Array.from(valuesByState, ([state, values]) => ({
    state,
    average: values.reduce((total, value) => total + value, 0) / values.length,
  }));
}

export function getTotalStations(stations: StationFeatureCollection): number {
  return stations.features.length;
}

export function getOperationalStations(
  stations: StationFeatureCollection,
): number {
  return stations.features.filter(
    (station) =>
      typeof station.properties.status === "string" &&
      station.properties.status.trim().toLowerCase() === "in operation",
  ).length;
}

export function getClosedStations(stations: StationFeatureCollection): number {
  return stations.features.filter(
    (station) =>
      typeof station.properties.status === "string" &&
      station.properties.status.trim().toLowerCase() === "closed",
  ).length;
}

export function getStateCount(stations: StationFeatureCollection): number {
  return new Set(
    stations.features
      .map((station) => station.properties.state)
      .filter(
        (state): state is string =>
          typeof state === "string" && state.trim().length > 0,
      ),
  ).size;
}

export function getStationsByState(
  stations: StationFeatureCollection,
): StateStationCount[] {
  const countsByState = new Map<string, number>();

  for (const station of stations.features) {
    const state = station.properties.state;
    if (typeof state !== "string" || state.trim().length === 0) continue;

    countsByState.set(state, (countsByState.get(state) ?? 0) + 1);
  }

  return Array.from(countsByState, ([state, count]) => ({ state, count }));
}

export function getMastHeightStats(
  stations: StationFeatureCollection,
): NumericStats {
  return calculateStats(
    getValidValues(stations, (station) => station.properties.mast_height_m),
  );
}

export function getElevationStats(
  stations: StationFeatureCollection,
): NumericStats {
  return calculateStats(
    getValidValues(stations, (station) => station.properties.elevation_m),
  );
}

export function getWindSpeedStats(
  stations: StationFeatureCollection,
): NumericStats {
  return calculateStats(
    getValidValues(stations, (station) => station.properties.maws),
  );
}

export function getAverageWindSpeedByState(
  stations: StationFeatureCollection,
): StateAverage[] {
  return getAverageByState(stations, (station) => station.properties.maws);
}

export function getPowerDensityStats(
  stations: StationFeatureCollection,
): NumericStats {
  return calculateStats(
    getValidValues(stations, (station) => station.properties.mawpd),
  );
}

export function getAveragePowerDensityByState(
  stations: StationFeatureCollection,
): StateAverage[] {
  return getAverageByState(stations, (station) => station.properties.mawpd);
}

export function getInstallationTimeline(
  stations: StationFeatureCollection,
): TimelineCount[] {
  const countsByYear = new Map<number, number>();

  for (const station of stations.features) {
    const date = station.properties.commenced_on;
    if (typeof date !== "string") continue;

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!match) continue;

    const [, yearText, monthText, dayText] = match;
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    if (
      parsedDate.getUTCFullYear() !== year ||
      parsedDate.getUTCMonth() !== month - 1 ||
      parsedDate.getUTCDate() !== day
    ) {
      continue;
    }

    countsByYear.set(year, (countsByYear.get(year) ?? 0) + 1);
  }

  return Array.from(countsByYear, ([year, count]) => ({ year, count })).sort(
    (a, b) => a.year - b.year,
  );
}
