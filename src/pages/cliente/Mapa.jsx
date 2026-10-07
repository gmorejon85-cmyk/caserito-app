import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { supabase } from "../../lib/supabaseClient";
import { C } from "../../theme";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LA_PAZ = [-16.5, -68.15];

function distanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Mapa() {
  const [negocios, setNegocios] = useState([]);
  const [miUbicacion, setMiUbicacion] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setMiUbicacion(LA_PAZ);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setMiUbicacion([pos.coords.latitude, pos.coords.longitude]),
      () => setMiUbicacion(LA_PAZ)
    );
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("businesses")
        .select("id, nombre_comercio, tipo_establecimiento, direccion, latitud, longitud")
        .eq("estado_aprobacion", "aprobado")
        .not("latitud", "is", null)
        .not("longitud", "is", null);
      setNegocios(data || []);
      setCargando(false);
    })();
  }, []);

  const centro = miUbicacion || LA_PAZ;
  const conDistancia = negocios
    .map((n) => ({
      ...n,
      dist: miUbicacion ? distanciaKm(miUbicacion[0], miUbicacion[1], n.latitud, n.longitud) : null,
    }))
    .sort((a, b) => (a.dist ?? 0) - (b.dist ?? 0));

  return (
    <div className="flex flex-col gap-3 px-4 pt-4 pb-3">
      <h1 className="font-display text-xl" style={{ color: C.ink }}>Comercios cerca de ti</h1>

      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.line}`, height: 320 }}>
        <MapContainer center={centro} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {miUbicacion && (
            <Marker position={miUbicacion}>
              <Popup>Estás aquí</Popup>
            </Marker>
          )}
          {conDistancia.map((n) => (
            <Marker key={n.id} position={[n.latitud, n.longitud]}>
              <Popup>
                <b>{n.nombre_comercio}</b>
                <br />
                {n.tipo_establecimiento}
                <br />
                {n.direccion}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {cargando && <p className="font-body text-sm" style={{ color: C.inkSoft }}>Cargando comercios…</p>}

      <div className="flex flex-col gap-2">
        {conDistancia.map((n) => (
          <div key={n.id} className="rounded-xl p-3 flex items-center justify-between" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
            <div>
              <p className="font-body font-semibold text-sm" style={{ color: C.ink }}>{n.nombre_comercio}</p>
              <p className="font-body text-xs" style={{ color: C.inkSoft }}>{n.tipo_establecimiento} · {n.direccion}</p>
            </div>
            {n.dist !== null && (
              <span className="font-body text-xs font-semibold" style={{ color: C.orangeDeep }}>{n.dist.toFixed(1)} km</span>
            )}
          </div>
        ))}
        {!cargando && conDistancia.length === 0 && (
          <p className="font-body text-sm text-center py-6" style={{ color: C.inkSoft }}>
            Todavía no hay comercios con ubicación registrada.
          </p>
        )}
      </div>
    </div>
  );
}
