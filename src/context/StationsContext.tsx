import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { StationFeatureCollection } from "../types/station";

interface StationsContextValue {
  stations: StationFeatureCollection | null;
  loading: boolean;
  error: Error | null;
}

interface StationsProviderProps {
  children: ReactNode;
}

const StationsContext = createContext<StationsContextValue | undefined>(
  undefined,
);

let stationsRequest: Promise<StationFeatureCollection> | null = null;

function loadStations(): Promise<StationFeatureCollection> {
  if (!stationsRequest) {
    stationsRequest = fetch("/data/stations.geojson")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to load station data: ${response.status} ${response.statusText}`,
          );
        }
        return response.json() as Promise<StationFeatureCollection>;
      })
      .catch((requestError: unknown) => {
        stationsRequest = null;
        throw requestError;
      });
  }

  return stationsRequest;
}

export function StationsProvider({ children }: StationsProviderProps) {
  const [stations, setStations] = useState<StationFeatureCollection | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCurrent = true;

    loadStations()
      .then((data) => {
        if (isCurrent) {
          setStations(data);
          setLoading(false);
        }
      })
      .catch((requestError: unknown) => {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError
              : new Error(String(requestError)),
          );
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <StationsContext.Provider value={{ stations, loading, error }}>
      {children}
    </StationsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStations(): StationsContextValue {
  const context = useContext(StationsContext);

  if (context === undefined) {
    throw new Error("useStations must be used within a StationsProvider");
  }

  return context;
}
