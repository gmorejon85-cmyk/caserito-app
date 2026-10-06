import React from "react";
import { C, getCategoryMeta } from "../theme";

export function Pill({ children, tone = "cream" }) {
  const tones = {
    cream: { bg: C.cream, fg: C.inkSoft },
    green: { bg: "#E6EFE7", fg: C.greenDeep },
    orange: { bg: "#F6E4D8", fg: C.orangeDeep },
    gold: { bg: "#FAEACB", fg: "#7A5714" },
    pink: { bg: "#F3DEE6", fg: C.pink },
    sky: { bg: "#DCEAEE", fg: C.sky },
  };
  const t = tones[tone] || tones.cream;
  return (
    <span
      className="font-body text-xs font-semibold px-2.5 py-1 rounded-full inline-block"
      style={{ background: t.bg, color: t.fg }}
    >
      {children}
    </span>
  );
}

export function EstadoPill({ estado }) {
  const map = {
    pendiente: "gold",
    confirmado: "green",
    retirado: "cream",
    cancelado: "pink",
    aprobado: "green",
    rechazado: "pink",
    activo: "green",
    pausado: "gold",
    agotado: "pink",
  };
  return <Pill tone={map[estado] || "cream"}>{estado}</Pill>;
}

export function PrimaryButton({ children, onClick, full, type = "button", disabled, style: extra }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-body font-semibold rounded-xl py-3 px-5 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-60 ${full ? "w-full" : ""}`}
      style={{ background: C.orange, color: "#FFF8EE", ...extra }}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, type = "button", style: extra }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="font-body font-semibold rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
      style={{ background: "transparent", color: C.ink, border: `1.5px solid ${C.line}`, ...extra }}
    >
      {children}
    </button>
  );
}

export function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: accent + "1A" }}>
        <Icon size={19} style={{ color: accent }} strokeWidth={2.2} />
      </div>
      <div>
        <div className="font-display text-2xl" style={{ color: C.ink }}>{value}</div>
        <div className="font-body text-sm" style={{ color: C.inkSoft }}>{label}</div>
        {sub && <div className="font-body text-xs mt-1" style={{ color: accent }}>{sub}</div>}
      </div>
    </div>
  );
}

export function Input({ label, wrapperClassName = "", ...props }) {
  return (
    <label className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && <span className="font-body text-xs font-semibold" style={{ color: C.inkSoft }}>{label}</span>}
      <input
        {...props}
        className="font-body text-sm rounded-lg px-3 py-2.5 outline-none"
        style={{ border: `1px solid ${C.line}` }}
      />
    </label>
  );
}

export function Select({ label, options, wrapperClassName = "", ...props }) {
  return (
    <label className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && <span className="font-body text-xs font-semibold" style={{ color: C.inkSoft }}>{label}</span>}
      <select
        {...props}
        className="font-body text-sm rounded-lg px-3 py-2.5 outline-none"
        style={{ border: `1px solid ${C.line}` }}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

/**
 * Miniatura de producto. Usa la foto subida a Supabase Storage (imagen_url)
 * si existe; si no, muestra un color de respaldo con el ícono de la categoría.
 */
export function ProductThumb({ producto, size = 56, radius = "rounded-xl" }) {
  const meta = getCategoryMeta(producto.categoria);
  const Icon = meta.icon;
  return (
    <div className={`relative overflow-hidden shrink-0 ${radius}`} style={{ width: size, height: size, background: meta.color + "22" }}>
      {producto.imagen_url ? (
        <img src={producto.imagen_url} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Icon size={size * 0.32} style={{ color: meta.color }} />
        </div>
      )}
      <div
        className="absolute flex items-center justify-center rounded-md"
        style={{ width: Math.max(18, size * 0.32), height: Math.max(18, size * 0.32), left: 5, bottom: 5, background: "rgba(255,255,255,0.92)" }}
      >
        <Icon size={Math.max(10, size * 0.16)} style={{ color: meta.color }} strokeWidth={2.4} />
      </div>
    </div>
  );
}

export function FullScreenLoader({ label = "Cargando…" }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center font-body text-sm" style={{ background: C.cream, color: C.inkSoft }}>
      {label}
    </div>
  );
}
