import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Package, ShoppingBag, TrendingUp, Store } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { C, CATEGORIAS } from "../../theme";
import { Input, Select, PrimaryButton, FullScreenLoader } from "../../components/ui";

const nav = [
  { to: "/comercio", label: "Dashboard", icon: BarChart3, end: true },
  { to: "/comercio/publicaciones", label: "Publicaciones", icon: Package },
  { to: "/comercio/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/comercio/estadisticas", label: "Estadísticas", icon: TrendingUp },
  { to: "/comercio/perfil", label: "Perfil del negocio", icon: Store },
];

function OnboardingNegocio({ onCreated }) {
  const { profile } = useAuth();
  const [form, setForm] = useState({ nombre_comercio: "", tipo_establecimiento: CATEGORIAS[0], celular: "", direccion: "", ciudad: profile?.ciudad || "La Paz" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    const { error: err } = await supabase.from("businesses").insert({ owner_id: profile.id, ...form });
    setSending(false);
    if (err) { setError(err.message); return; }
    onCreated();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4" style={{ background: C.cream }}>
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl p-7 flex flex-col gap-4" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
        <h1 className="font-display text-xl" style={{ color: C.ink }}>Completa el registro de tu comercio</h1>
        <Input label="Nombre del comercio" required value={form.nombre_comercio} onChange={(e) => setForm({ ...form, nombre_comercio: e.target.value })} />
        <Select label="Tipo de comercio" options={CATEGORIAS} value={form.tipo_establecimiento} onChange={(e) => setForm({ ...form, tipo_establecimiento: e.target.value })} />
        <Input label="Celular" required value={form.celular} onChange={(e) => setForm({ ...form, celular: e.target.value })} />
        <Input label="Dirección" required value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
        <Input label="Ciudad" required value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
        {error && <p className="font-body text-xs" style={{ color: C.pink }}>{error}</p>}
        <PrimaryButton type="submit" full disabled={sending}>{sending ? "Guardando…" : "Registrar mi comercio"}</PrimaryButton>
      </form>
    </div>
  );
}

export default function ComercioLayout() {
  const { business, loading, refreshProfile } = useAuth();
  const [checking, setChecking] = useState(false);

  if (loading || checking) return <FullScreenLoader />;

  if (!business) {
    return <OnboardingNegocio onCreated={async () => { setChecking(true); await refreshProfile(); setChecking(false); }} />;
  }

  if (business.estado_aprobacion !== "aprobado") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4" style={{ background: C.cream }}>
        <div className="max-w-sm text-center rounded-2xl p-8" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          <h1 className="font-display text-xl" style={{ color: C.ink }}>
            {business.estado_aprobacion === "rechazado" ? "Tu comercio fue rechazado" : "Tu comercio está en revisión"}
          </h1>
          <p className="font-body text-sm mt-2" style={{ color: C.inkSoft }}>
            {business.estado_aprobacion === "rechazado"
              ? "Contáctanos si crees que esto es un error."
              : "Un administrador de Caserito revisará tu comercio pronto. Te avisaremos cuando puedas empezar a publicar."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex" style={{ background: C.cream }}>
      <div className="w-56 shrink-0 flex flex-col justify-between py-6" style={{ background: C.greenDeep }}>
        <div>
          <div className="px-5 pb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display" style={{ background: C.gold, color: C.greenDeep }}>C</div>
            <span className="font-display text-lg" style={{ color: "#FFF8EE" }}>Caserito</span>
          </div>
          <div className="flex flex-col gap-1 px-3">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg font-body text-sm text-left"
                style={({ isActive }) => ({ background: isActive ? "rgba(255,255,255,0.12)" : "transparent", color: isActive ? "#FFF8EE" : "#B9CDBB" })}
              >
                <n.icon size={16} /> {n.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="px-5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-body text-xs font-bold" style={{ background: "#B9CDBB", color: C.greenDeep }}>
            {business.nombre_comercio?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-body text-xs font-semibold" style={{ color: "#FFF8EE" }}>{business.nombre_comercio}</p>
            <p className="font-body text-[11px]" style={{ color: "#9CB49E" }}>{business.tipo_establecimiento} · {business.ciudad}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
