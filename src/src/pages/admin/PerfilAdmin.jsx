import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { C } from "../../theme";
import { Input, PrimaryButton } from "../../components/ui";
import { TopBar } from "../../components/TopBar";

export default function PerfilAdmin() {
  const { profile, user, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    nombre: profile?.nombre || "",
    celular: profile?.celular || "",
    ciudad: profile?.ciudad || "",
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    setMensaje("");
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ nombre: form.nombre, celular: form.celular, ciudad: form.ciudad })
      .eq("id", profile.id);
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
      <TopBar title="Mi perfil" />
      <form onSubmit={handleSubmit} className="p-8 max-w-md flex flex-col gap-4">
        <div className="rounded-xl px-4 py-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          <p className="font-body text-xs" style={{ color: C.inkSoft }}>Correo de la cuenta</p>
          <p className="font-body text-sm font-medium" style={{ color: C.ink }}>{user?.email}</p>
        </div>
        <Input label="Nombre completo" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <Input label="Celular" value={form.celular} onChange={(e) => setForm({ ...form, celular: e.target.value })} />
        <Input label="Ciudad" value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
        {error && <p className="font-body text-xs" style={{ color: C.pink }}>{error}</p>}
        {mensaje && <p className="font-body text-xs" style={{ color: C.greenDeep }}>{mensaje}</p>}
        <PrimaryButton type="submit" disabled={sending}>{sending ? "Guardando…" : "Guardar cambios"}</PrimaryButton>
      </form>
    </>
  );
}
