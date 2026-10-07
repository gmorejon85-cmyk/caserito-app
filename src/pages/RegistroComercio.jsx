import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { C, CATEGORIAS } from "../theme";
import { Input, Select, PrimaryButton } from "../components/ui";
import LocationPicker from "../components/LocationPicker";

export default function RegistroComercio() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "", celular: "", email: "", password: "",
    nombre_comercio: "", tipo_establecimiento: CATEGORIAS[0], direccion: "", ciudad: "La Paz",
    latitud: null, longitud: null,
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nombre: form.nombre,
          celular: form.celular,
          ciudad: form.ciudad,
          tipo_usuario: "comercio",
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setSending(false);
      return;
    }

    if (data.session) {
      // La confirmación de correo está desactivada: ya hay sesión, registramos el negocio de una vez.
      const { error: bizError } = await supabase.from("businesses").insert({
        owner_id: data.user.id,
        nombre_comercio: form.nombre_comercio,
        tipo_establecimiento: form.tipo_establecimiento,
        celular: form.celular,
        direccion: form.direccion,
        ciudad: form.ciudad,
        latitud: form.latitud,
        longitud: form.longitud,
      });
      setSending(false);
      if (bizError) {
        setError(bizError.message);
        return;
      }
      navigate("/comercio");
    } else {
      // La confirmación de correo está activada: debe confirmar y luego terminar el registro del negocio.
      setSending(false);
      setNeedsConfirm(true);
    }
  };

  if (needsConfirm) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4" style={{ background: C.cream }}>
        <div className="w-full max-w-sm rounded-2xl p-7 flex flex-col gap-3 text-center" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          <h1 className="font-display text-xl" style={{ color: C.ink }}>Revisa tu correo</h1>
          <p className="font-body text-sm" style={{ color: C.inkSoft }}>
            Te enviamos un enlace de confirmación a {form.email}. Después de confirmar, inicia sesión y completa los
            datos de tu comercio.
          </p>
          <Link to="/ingresar"><PrimaryButton full>Ir a iniciar sesión</PrimaryButton></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10" style={{ background: C.cream }}>
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl p-7 flex flex-col gap-4" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
        <h1 className="font-display text-xl" style={{ color: C.ink }}>Registra tu comercio</h1>
        <p className="font-body text-xs" style={{ color: C.inkSoft }}>
          Un administrador revisará tu comercio antes de que puedas publicar excedentes.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Tu nombre" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <Input label="Celular" required value={form.celular} onChange={(e) => setForm({ ...form, celular: e.target.value })} />
          <div className="col-span-2"><Input label="Nombre del comercio" required value={form.nombre_comercio} onChange={(e) => setForm({ ...form, nombre_comercio: e.target.value })} /></div>
          <Select label="Tipo de comercio" options={CATEGORIAS} value={form.tipo_establecimiento} onChange={(e) => setForm({ ...form, tipo_establecimiento: e.target.value })} />
          <Input label="Ciudad" required value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
          <div className="col-span-2"><Input label="Dirección" required value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} /></div>
          <div className="col-span-2"><LocationPicker lat={form.latitud} lng={form.longitud} onChange={(lat, lng) => setForm({ ...form, latitud: lat, longitud: lng })} /></div>
          <div className="col-span-2"><Input label="Correo electrónico" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="col-span-2"><Input label="Contraseña" type="password" minLength={6} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        </div>
        {error && <p className="font-body text-xs" style={{ color: C.pink }}>{error}</p>}
        <PrimaryButton type="submit" full disabled={sending}>{sending ? "Enviando…" : "Registrar comercio"}</PrimaryButton>
        <p className="font-body text-xs text-center" style={{ color: C.inkSoft }}>
          ¿Ya tienes cuenta? <Link to="/ingresar" style={{ color: C.orangeDeep, fontWeight: 600 }}>Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
