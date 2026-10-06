import { useEffect, useRef, useState } from "react";
<<<<<<< HEAD
=======

>>>>>>> 00e5b37 (Add NIWE portal updates)
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Popup,
  GeoJSON,
  LayersControl,
  useMap,
} from "react-leaflet";
<<<<<<< HEAD
import MarkerClusterGroup from "react-leaflet-cluster";
=======

import MarkerClusterGroup from "react-leaflet-cluster";

>>>>>>> 00e5b37 (Add NIWE portal updates)
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --------------------
// Marker Icons
// --------------------

<<<<<<< HEAD
const operationIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
=======
const markerShadow =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png";

const markerIconUrl = (color) =>
  `https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-${color}.png`;

const blueIcon = new L.Icon({
  iconUrl: markerIconUrl("blue"),
  shadowUrl: markerShadow,
>>>>>>> 00e5b37 (Add NIWE portal updates)
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

<<<<<<< HEAD
const closedIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
=======
const greenIcon = new L.Icon({
  iconUrl: markerIconUrl("green"),
  shadowUrl: markerShadow,
>>>>>>> 00e5b37 (Add NIWE portal updates)
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

<<<<<<< HEAD
=======
const yellowIcon = new L.Icon({
  iconUrl: markerIconUrl("yellow"),
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const orangeIcon = new L.Icon({
  iconUrl: markerIconUrl("orange"),
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const redIcon = new L.Icon({
  iconUrl: markerIconUrl("red"),
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const violetIcon = new L.Icon({
  iconUrl: markerIconUrl("violet"),
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// --------------------
// Get Marker Based on Mast Height
// --------------------

function getHeightBasedIcon(station) {
  const height = Number(station?.properties?.mast_height_m);

  if (!Number.isFinite(height)) {
    return violetIcon;
  }

  if (height <= 50) {
    return blueIcon;
  }

  if (height <= 80) {
    return greenIcon;
  }

  if (height <= 100) {
    return yellowIcon;
  }

  if (height <= 120) {
    return orangeIcon;
  }

  return redIcon;
}

>>>>>>> 00e5b37 (Add NIWE portal updates)
// --------------------
// Map Legend
// --------------------

function MapLegend() {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({
      position: "bottomright",
    });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div");

      div.innerHTML = `
        <div style="
          background: white;
          padding: 10px;
          border-radius: 6px;
          box-shadow: 0 1px 5px rgba(0,0,0,0.3);
          font-size: 14px;
          line-height: 1.6;
<<<<<<< HEAD
        ">
          <strong>Station Status</strong><br/>
          <span style="color: green; font-size: 18px;">●</span>
          In Operation<br/>
          <span style="color: red; font-size: 18px;">●</span>
          Closed
=======
          min-width: 150px;
        ">
          <strong>Mast Height</strong><br/>

          <span style="color: blue; font-size: 18px;">●</span>
          ≤ 50 m<br/>

          <span style="color: green; font-size: 18px;">●</span>
          51–80 m<br/>

          <span style="color: #d4b000; font-size: 18px;">●</span>
          81–100 m<br/>

          <span style="color: orange; font-size: 18px;">●</span>
          101–120 m<br/>

          <span style="color: red; font-size: 18px;">●</span>
          &gt; 120 m<br/>

          <span style="color: violet; font-size: 18px;">●</span>
          Unknown
>>>>>>> 00e5b37 (Add NIWE portal updates)
        </div>
      `;

      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}

// --------------------
// Fit Map To Stations
// --------------------

function getValidStationPosition(station) {
<<<<<<< HEAD
  const coordinates = station.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;

  const [longitude, latitude] = coordinates;
=======
  const coordinates = station?.geometry?.coordinates;

  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return null;
  }

  const [longitude, latitude] = coordinates;

>>>>>>> 00e5b37 (Add NIWE portal updates)
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return [latitude, longitude];
}

function FitMapToStations({ stations, fitTrigger }) {
  const map = useMap();

  useEffect(() => {
    const features = stations?.features;
<<<<<<< HEAD
    if (!features?.length) return;
=======

    if (!features?.length) {
      return;
    }
>>>>>>> 00e5b37 (Add NIWE portal updates)

    const coordinates = features.flatMap((station) => {
      const position = getValidStationPosition(station);
      return position ? [position] : [];
    });

<<<<<<< HEAD
    if (coordinates.length === 0) return;
=======
    if (coordinates.length === 0) {
      return;
    }
>>>>>>> 00e5b37 (Add NIWE portal updates)

    if (coordinates.length === 1) {
      map.setView(coordinates[0], 10);
      return;
    }

    const bounds = L.latLngBounds(coordinates);

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 12,
    });
  }, [stations, fitTrigger, map]);

  return null;
}

<<<<<<< HEAD
=======
// --------------------
// Focus Selected Station
// --------------------

>>>>>>> 00e5b37 (Add NIWE portal updates)
function FocusSelectedStation({
  stations,
  selectedStationId,
  markerRefs,
  clusterRef,
}) {
  const map = useMap();

  useEffect(() => {
<<<<<<< HEAD
    if (!selectedStationId || !stations?.features?.length) return;

    const station = stations.features.find(
      (feature) => feature.properties.id === selectedStationId,
    );
    const marker = markerRefs.current.get(selectedStationId);

    if (!station || !marker) return;

    const [longitude, latitude] = station.geometry.coordinates;
    const openPopup = () => marker.openPopup();
=======
    if (!selectedStationId || !stations?.features?.length) {
      return;
    }

    const station = stations.features.find(
      (feature) => feature.properties.id === selectedStationId
    );

    const marker = markerRefs.current.get(selectedStationId);

    if (!station || !marker) {
      return;
    }

    const coordinates = station.geometry?.coordinates;

    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return;
    }

    const [longitude, latitude] = coordinates;

    const openPopup = () => {
      marker.openPopup();
    };

>>>>>>> 00e5b37 (Add NIWE portal updates)
    const cluster = clusterRef.current;

    if (cluster?.zoomToShowLayer) {
      cluster.zoomToShowLayer(marker, openPopup);
    } else {
      map.setView([latitude, longitude], 12);
      openPopup();
    }
<<<<<<< HEAD
  }, [stations, selectedStationId, markerRefs, clusterRef, map]);
=======
  }, [
    stations,
    selectedStationId,
    markerRefs,
    clusterRef,
    map,
  ]);
>>>>>>> 00e5b37 (Add NIWE portal updates)

  return null;
}

// --------------------
// Scale Control
// --------------------

function ScaleControl() {
  const map = useMap();

  useEffect(() => {
    const scale = L.control.scale({
      position: "bottomleft",
      imperial: false,
    });

    scale.addTo(map);

    return () => {
      map.removeControl(scale);
    };
  }, [map]);

  return null;
}

// --------------------
// Reset Map Control
// --------------------

function ResetMapControl() {
  const map = useMap();

  const resetMap = () => {
    map.setView([20.5937, 78.9629], 5);
  };

  return (
    <button
      onClick={resetMap}
      className="reset-map-button"
      style={{
        position: "absolute",
        top: "120px",
        left: "10px",
        zIndex: 1000,
        background: "white",
        color: "black",
        border: "2px solid rgba(0,0,0,0.2)",
        borderRadius: "4px",
        padding: "6px 10px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
      }}
    >
      🇮🇳 Reset India
    </button>
  );
}

// --------------------
// Wind Map
// --------------------

function WindMap({
  stations: stationsProp,
  states: statesProp,
  disableClustering = false,
  selectedStationId = null,
  onStationSelect = () => {},
  fitTrigger = 0,
}) {
  const [stations, setStations] = useState(stationsProp || null);
  const [states, setStates] = useState(statesProp || null);
<<<<<<< HEAD
  const markerRefs = useRef(new Map());
  const clusterRef = useRef(null);

  // Load station data
=======

  const markerRefs = useRef(new Map());
  const clusterRef = useRef(null);

  // --------------------
  // Load Station Data
  // --------------------

>>>>>>> 00e5b37 (Add NIWE portal updates)
  useEffect(() => {
    if (stationsProp) {
      setStations(stationsProp);
      return;
    }

    fetch("/data/stations.geojson")
<<<<<<< HEAD
      .then((response) => response.json())
=======
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load station data");
        }

        return response.json();
      })
>>>>>>> 00e5b37 (Add NIWE portal updates)
      .then((data) => {
        setStations(data);
      })
      .catch((error) => {
        console.error("Failed to load station data:", error);
      });
  }, [stationsProp]);

<<<<<<< HEAD
  // Load state boundaries
=======
  // --------------------
  // Load State Boundaries
  // --------------------

>>>>>>> 00e5b37 (Add NIWE portal updates)
  useEffect(() => {
    if (statesProp) {
      setStates(statesProp);
      return;
    }

    fetch("/data/india-states.json")
<<<<<<< HEAD
      .then((response) => response.json())
=======
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load state boundaries");
        }

        return response.json();
      })
>>>>>>> 00e5b37 (Add NIWE portal updates)
      .then((data) => {
        setStates(data);
      })
      .catch((error) => {
        console.error("Failed to load state boundaries:", error);
      });
  }, [statesProp]);

<<<<<<< HEAD
  const stationMarkers = stations?.features?.flatMap((station) => {
    const position = getValidStationPosition(station);
    if (!position) return [];
=======
  // --------------------
  // Station Markers
  // --------------------

  const stationMarkers = stations?.features?.flatMap((station) => {
    const position = getValidStationPosition(station);

    if (!position) {
      return [];
    }

>>>>>>> 00e5b37 (Add NIWE portal updates)
    const [latitude, longitude] = position;

    return [
      <Marker
        key={station.properties.id}
        eventHandlers={{
          click: () => onStationSelect(station.properties.id),
        }}
        ref={(marker) => {
          if (marker) {
<<<<<<< HEAD
            markerRefs.current.set(station.properties.id, marker);
          } else {
            markerRefs.current.delete(station.properties.id);
          }
        }}
        position={[latitude, longitude]}
        icon={
          station.properties.status === "In Operation"
            ? operationIcon
            : closedIcon
        }
      >
        <Tooltip>
          <strong>{station.properties.station_name}</strong>
          <br />
          Status: {station.properties.status}
=======
            markerRefs.current.set(
              station.properties.id,
              marker
            );
          } else {
            markerRefs.current.delete(
              station.properties.id
            );
          }
        }}
        position={[latitude, longitude]}
        icon={getHeightBasedIcon(station)}
      >
        <Tooltip>
          <strong>
            {station.properties.station_name}
          </strong>
          <br />
          Status: {station.properties.status}
          <br />
          Mast Height:{" "}
          {Number.isFinite(
            Number(station.properties.mast_height_m)
          )
            ? `${station.properties.mast_height_m} m`
            : "N/A"}
>>>>>>> 00e5b37 (Add NIWE portal updates)
        </Tooltip>

        <Popup>
          <div className="station-popup">
<<<<<<< HEAD
            <h3>{station.properties.station_name}</h3>

            <div className="popup-status">
              <strong>Status:</strong> {station.properties.status}
            </div>

            <p>
              <strong>State:</strong> {station.properties.state}
=======
            <h3>
              {station.properties.station_name}
            </h3>

            <div className="popup-status">
              <strong>Status:</strong>{" "}
              {station.properties.status}
            </div>

            <p>
              <strong>State:</strong>{" "}
              {station.properties.state}
>>>>>>> 00e5b37 (Add NIWE portal updates)
            </p>

            <p>
              <strong>District:</strong>{" "}
              {station.properties.district || "N/A"}
            </p>

            <p>
              <strong>Mast Height:</strong>{" "}
<<<<<<< HEAD
              {typeof station.properties.mast_height_m === "number" &&
              Number.isFinite(station.properties.mast_height_m)
=======
              {Number.isFinite(
                Number(station.properties.mast_height_m)
              )
>>>>>>> 00e5b37 (Add NIWE portal updates)
                ? `${station.properties.mast_height_m} m`
                : "N/A"}
            </p>

            <p>
              <strong>Coordinates:</strong>
              <br />
              {latitude}, {longitude}
            </p>
          </div>
        </Popup>
<<<<<<< HEAD
      </Marker>
    ];
  });

=======
      </Marker>,
    ];
  });

  // --------------------
  // Map
  // --------------------

>>>>>>> 00e5b37 (Add NIWE portal updates)
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      className="map-container"
      scrollWheelZoom={false}
    >
      <ScaleControl />

      <ResetMapControl />

      {/* Map Layers */}
<<<<<<< HEAD
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Street Map">
=======

      <LayersControl position="topright">
        <LayersControl.BaseLayer
          checked
          name="Street Map"
        >
>>>>>>> 00e5b37 (Add NIWE portal updates)
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            attribution="Tiles &copy; Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {/* Automatically fit map to stations */}
<<<<<<< HEAD
      <FitMapToStations stations={stations} fitTrigger={fitTrigger} />
=======

      <FitMapToStations
        stations={stations}
        fitTrigger={fitTrigger}
      />

>>>>>>> 00e5b37 (Add NIWE portal updates)
      <FocusSelectedStation
        stations={stations}
        selectedStationId={selectedStationId}
        markerRefs={markerRefs}
        clusterRef={clusterRef}
      />

      {/* State Boundaries */}
<<<<<<< HEAD
=======

>>>>>>> 00e5b37 (Add NIWE portal updates)
      {states && (
        <GeoJSON
          data={states}
          style={{
            color: "#555",
            weight: 1,
            fillOpacity: 0.05,
          }}
          onEachFeature={(feature, layer) => {
            layer.on({
              mouseover: (event) => {
                event.target.setStyle({
                  weight: 2,
                  fillOpacity: 0.2,
                });
              },

              mouseout: (event) => {
                event.target.setStyle({
                  weight: 1,
                  fillOpacity: 0.05,
                });
              },
            });
          }}
        />
      )}

      {/* Station Markers */}
<<<<<<< HEAD
=======

>>>>>>> 00e5b37 (Add NIWE portal updates)
      {stationMarkers &&
        (disableClustering ? (
          stationMarkers
        ) : (
          <MarkerClusterGroup ref={clusterRef}>
            {stationMarkers}
          </MarkerClusterGroup>
        ))}

      {/* Legend */}
<<<<<<< HEAD
=======

>>>>>>> 00e5b37 (Add NIWE portal updates)
      <MapLegend />
    </MapContainer>
  );
}

<<<<<<< HEAD
export default WindMap;
=======
export default WindMap;
>>>>>>> 00e5b37 (Add NIWE portal updates)
