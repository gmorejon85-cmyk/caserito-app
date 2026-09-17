import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { C } from "../theme";
import { Input, PrimaryButton } from "../components/ui";

export default function Login() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!loading && session && role) {
      if (role === "admin") navigate("/admin");
      else if (role === "comercio") navigate("/comercio");
      else navigate("/app");
    }
  }, [session, role, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSending(false);
    if (signInError) setError("Correo o contraseña incorrectos.");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4" style={{ background: C.cream }}>
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl p-7 flex flex-col gap-4" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display" style={{ background: C.gold, color: C.ink }}>C</div>
          <span className="font-display text-lg" style={{ color: C.ink }}>Caserito</span>
        </div>
        <h1 className="font-display text-xl" style={{ color: C.ink }}>Iniciar sesión</h1>
        <Input label="Correo electrónico" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Contraseña" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="font-body text-xs" style={{ color: C.pink }}>{error}</p>}
        <PrimaryButton type="submit" full disabled={sending}>{sending ? "Ingresando…" : "Ingresar"}</PrimaryButton>
        <p className="font-body text-xs text-center" style={{ color: C.inkSoft }}>
          ¿No tienes cuenta?{" "}
          <Link to="/registro-cliente" style={{ color: C.orangeDeep, fontWeight: 600 }}>Regístrate como cliente</Link>
          {" "}o{" "}
          <Link to="/registro-comercio" style={{ color: C.orangeDeep, fontWeight: 600 }}>registra tu comercio</Link>
        </p>
      </form>
    </div>
  );
}
