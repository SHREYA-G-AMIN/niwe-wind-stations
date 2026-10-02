import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function WindMap() {
  const stations = [
    { name: "Test Station 1", position: [12.9716, 77.5946] },
    { name: "Test Station 2", position: [19.076, 72.8777] },
    { name: "Test Station 3", position: [28.6139, 77.209] },
  ];

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

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
    </MapContainer>
  );
}

export default WindMap;