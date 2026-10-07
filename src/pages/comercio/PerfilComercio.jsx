import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { C } from "../../theme";
import { Pill, Input, PrimaryButton } from "../../components/ui";
import { TopBar } from "../../components/TopBar";
import LocationPicker from "../../components/LocationPicker";

export default function PerfilComercio() {
  const { business, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    nombre_comercio: business.nombre_comercio || "",
    celular: business.celular || "",
    direccion: business.direccion || "",
    ciudad: business.ciudad || "",
    latitud: business.latitud ?? null,
    longitud: business.longitud ?? null,
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    setMensaje("");
    const { error: updateError } = await supabase.from("businesses").update(form).eq("id", business.id);
    setSending(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await refreshProfile();
    setMensaje("Datos guardados.");
  };

  return (
    <>
      <TopBar title="Perfil del negocio" />
      <form onSubmit={handleSubmit} className="p-8 max-w-xl flex flex-col gap-4">
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          <div className="w-16 h-16 rounded-xl flex items-center justify-center font-display text-xl" style={{ background: C.gold, color: "#4A3410" }}>
            {business.nombre_comercio?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-display text-lg" style={{ color: C.ink }}>{business.nombre_comercio}</p>
            <p className="font-body text-xs" style={{ color: C.inkSoft }}>{business.tipo_establecimiento} · {business.ciudad}</p>
            <Pill tone="green">Comercio aprobado</Pill>
          </div>
        </div>

        <Input label="Nombre del comercio" value={form.nombre_comercio} onChange={(e) => setForm({ ...form, nombre_comercio: e.target.value })} />
        <Input label="Celular" value={form.celular} onChange={(e) => setForm({ ...form, celular: e.target.value })} />
        <Input label="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
        <Input label="Ciudad" value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
        <LocationPicker lat={form.latitud} lng={form.longitud} onChange={(lat, lng) => setForm({ ...form, latitud: lat, longitud: lng })} />

        {error && <p className="font-body text-xs" style={{ color: C.pink }}>{error}</p>}
        {mensaje && <p className="font-body text-xs" style={{ color: C.greenDeep }}>{mensaje}</p>}
        <PrimaryButton type="submit" disabled={sending}>{sending ? "Guardando…" : "Guardar cambios"}</PrimaryButton>
      </form>
    </>
  );
}
