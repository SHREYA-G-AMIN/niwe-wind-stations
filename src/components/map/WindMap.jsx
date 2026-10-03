import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
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

function MapLegend() {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

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

function WindMap({ stations, states }) {
  return (
    <MapContainer
  center={[20.5937, 78.9629]}
  zoom={5}
className="map-container"  
>
  <FullscreenControl />
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

      <FitMapToStations stations={stations} />

      {states && <GeoJSON data={states} />}

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
              <Popup>
                <strong>{station.properties.name}</strong>
                <hr />

                <strong>State:</strong> {station.properties.state}
                <br />

                <strong>District:</strong> {station.properties.district}
                <br />

                <strong>Status:</strong> {station.properties.status}
                <br />

                <strong>Mast Height:</strong> {station.properties.mast_height} m
                <br />

                <strong>Latitude:</strong> {latitude}
                <br />

                <strong>Longitude:</strong> {longitude}
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>

      <MapLegend />
    </MapContainer>
  );
}

export default WindMap;