import React from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import './LiveMap.css';

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LiveMap = ({ path }) => {
  if (!path || path.length === 0) return null;

  const start = path[0];
  const end = path[path.length - 1];

  // Convert UTC to IST (India Standard Time)
  const formatISTTime = (utcString) => {
    const date = new Date(utcString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  return (
    <div className="map-container">
      <MapContainer
        center={[start.lat, start.lng]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <Marker position={[start.lat, start.lng]}>
          <Popup>Start Time: {formatISTTime(start.time)}</Popup>
        </Marker>
        <Marker position={[end.lat, end.lng]}>
          <Popup>End Time: {formatISTTime(end.time)}</Popup>
        </Marker>
        <Polyline
          positions={path.map((point) => [point.lat, point.lng])}
          color="blue"
        />
      </MapContainer>
    </div>
  );
};

export default LiveMap;
