import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  LayersControl,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";

function WindMap() {
  const [states, setStates] = useState(null);

  const stations = [
    { name: "Test Station 1", position: [12.9716, 77.5946] },
    { name: "Test Station 2", position: [19.076, 72.8777] },
    { name: "Test Station 3", position: [28.6139, 77.209] },
  ];

  useEffect(() => {
    fetch("/data/india-states.json")
      .then((response) => response.json())
      .then((data) => setStates(data));
  }, []);

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "500px", width: "100%" }}
    >
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

      {states && <GeoJSON data={states} />}

      <MarkerClusterGroup>
        {stations.map((station, index) => (
          <Marker key={index} position={station.position}>
            <Popup>
              <strong>{station.name}</strong>
              <br />
              Latitude: {station.position[0]}
              <br />
              Longitude: {station.position[1]}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export default WindMap;