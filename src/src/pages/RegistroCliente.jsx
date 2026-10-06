import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { C } from "../theme";
import { Input, PrimaryButton } from "../components/ui";

export default function RegistroCliente() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", celular: "", ciudad: "La Paz", email: "", password: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nombre: form.nombre,
          celular: form.celular,
          ciudad: form.ciudad,
          tipo_usuario: "cliente",
        },
      },
    });
    setSending(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    navigate("/app");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10" style={{ background: C.cream }}>
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl p-7 flex flex-col gap-4" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
        <h1 className="font-display text-xl" style={{ color: C.ink }}>Crear cuenta de cliente</h1>
        <Input label="Nombre completo" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <Input label="Celular" required value={form.celular} onChange={(e) => setForm({ ...form, celular: e.target.value })} />
        <Input label="Ciudad" required value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
        <Input label="Correo electrónico" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Contraseña" type="password" minLength={6} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="font-body text-xs" style={{ color: C.pink }}>{error}</p>}
        <PrimaryButton type="submit" full disabled={sending}>{sending ? "Creando cuenta…" : "Crear cuenta"}</PrimaryButton>
        <p className="font-body text-xs text-center" style={{ color: C.inkSoft }}>
          ¿Ya tienes cuenta? <Link to="/ingresar" style={{ color: C.orangeDeep, fontWeight: 600 }}>Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
