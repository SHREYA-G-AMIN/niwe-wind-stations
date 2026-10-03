import { useEffect } from "react";
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
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.fullscreen";
import "leaflet.fullscreen/dist/Control.FullScreen.css";

// --------------------
// Marker Icons
// --------------------

const operationIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const closedIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

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
        ">
          <strong>Station Status</strong><br/>
          <span style="color: green; font-size: 18px;">●</span>
          In Operation<br/>
          <span style="color: red; font-size: 18px;">●</span>
          Closed
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

function FitMapToStations({ stations }) {
  const map = useMap();

  useEffect(() => {
    if (!stations?.features?.length) return;

    const bounds = L.latLngBounds(
      stations.features.map((station) => {
        const [longitude, latitude] = station.geometry.coordinates;

        return [latitude, longitude];
      })
    );

    map.fitBounds(bounds, {
      padding: [30, 30],
    });
  }, [stations, map]);

  return null;
}

// --------------------
// Fullscreen Control
// --------------------

function FullscreenControl() {
  const map = useMap();

  useEffect(() => {
    const fullscreenControl = L.control.fullscreen({
      position: "topleft",
      title: "View Fullscreen",
      titleCancel: "Exit Fullscreen",
    });

    fullscreenControl.addTo(map);

    return () => {
      map.removeControl(fullscreenControl);
    };
  }, [map]);

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
      style={{
        position: "absolute",
        top: "120px",
        left: "10px",
        zIndex: 1000,
        background: "white",
        border: "2px solid rgba(0,0,0,0.2)",
        borderRadius: "4px",
        padding: "6px 10px",
        cursor: "pointer",
        fontSize: "14px",
      }}
    >
      🇮🇳 Reset India
    </button>
  );
}

// --------------------
// Wind Map
// --------------------

function WindMap({ stations, states }) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      className="map-container"
      scrollWheelZoom={false}
    >
      <FullscreenControl />

      <ScaleControl />

      <ResetMapControl />

      {/* Map Layers */}
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Street Map">
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
      <FitMapToStations stations={stations} />

      {/* State Boundaries */}
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
      <MarkerClusterGroup>
        {stations?.features.map((station, index) => {
          const [longitude, latitude] = station.geometry.coordinates;

          return (
            <Marker
  key={index}
  position={[latitude, longitude]}
  icon={
    station.properties.status === "In Operation"
      ? operationIcon
      : closedIcon
  }
>
  <Tooltip>
    <strong>{station.properties.name}</strong>
    <br />
    Status: {station.properties.status}
  </Tooltip>

  <Popup>
    <div className="station-popup">
      <h3>{station.properties.name}</h3>

      <div className="popup-status">
        <strong>Status:</strong>{" "}
        {station.properties.status}
      </div>

      <p>
        <strong>State:</strong>{" "}
        {station.properties.state}
      </p>

      <p>
        <strong>District:</strong>{" "}
        {station.properties.district || "N/A"}
      </p>

      <p>
        <strong>Mast Height:</strong>{" "}
        {station.properties.mast_height
          ? `${station.properties.mast_height} m`
          : "N/A"}
      </p>

      <p>
        <strong>Coordinates:</strong>
        <br />
        {latitude}, {longitude}
      </p>
    </div>
  </Popup>
</Marker>
          );
        })}
      </MarkerClusterGroup>

      {/* Legend */}
      <MapLegend />
    </MapContainer>
  );
}

export default WindMap;