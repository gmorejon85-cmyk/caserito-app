import React from "react";
import { useAuth } from "../../context/AuthContext";
import { C } from "../../theme";
import { Pill } from "../../components/ui";
import { TopBar } from "../../components/TopBar";

export default function PerfilComercio() {
  const { business } = useAuth();

  return (
    <>
      <TopBar title="Perfil del negocio" />
      <div className="p-8 max-w-xl flex flex-col gap-4">
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
        {[
          ["Dirección", business.direccion],
          ["Celular", business.celular],
          ["Ciudad", business.ciudad],
          ["Estado de aprobación", business.estado_aprobacion],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
            <span className="font-body text-sm" style={{ color: C.inkSoft }}>{k}</span>
            <span className="font-body text-sm font-medium" style={{ color: C.ink }}>{v}</span>
          </div>
        ))}
      </div>
    </>
  );
}
