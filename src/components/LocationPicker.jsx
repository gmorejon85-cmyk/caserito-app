import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { C } from "../theme";

// Arregla un problema conocido de Leaflet + empaquetadores (Vite): sin esto,
// el ícono del marcador no se ve.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LA_PAZ = [-16.5, -68.15];

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * Mapa donde el comercio toca para marcar dónde está ubicado.
 * lat/lng: coordenadas actuales (o null si todavía no se marcó ninguna).
 * onChange(lat, lng): se llama cada vez que se toca el mapa.
 */
export default function LocationPicker({ lat, lng, onChange }) {
  const tieneUbicacion = lat != null && lng != null;
  const center = tieneUbicacion ? [lat, lng] : LA_PAZ;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-body text-xs font-semibold" style={{ color: C.inkSoft }}>
        Ubicación del comercio (toca el mapa para marcarla)
      </span>
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.line}`, height: 220 }}>
        <MapContainer center={center} zoom={tieneUbicacion ? 16 : 12} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <ClickHandler onPick={onChange} />
          {tieneUbicacion && <Marker position={[lat, lng]} />}
        </MapContainer>
      </div>
      <span className="font-body text-xs" style={{ color: tieneUbicacion ? C.greenDeep : C.pink }}>
        {tieneUbicacion ? "Ubicación marcada ✓" : "Todavía no marcaste la ubicación"}
      </span>
    </div>
  );
}
