import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { C } from "../../theme";
import { Pill, PrimaryButton, GhostButton } from "../../components/ui";
import { TopBar } from "../../components/TopBar";

export default function Comercios() {
  const [pendientes, setPendientes] = useState([]);
  const [activos, setActivos] = useState([]);

  const cargar = async () => {
    const { data: pend } = await supabase.from("businesses").select("*").eq("estado_aprobacion", "pendiente");
    const { data: act } = await supabase.from("businesses").select("*, surplus_items(id)").eq("estado_aprobacion", "aprobado");
    setPendientes(pend || []);
    setActivos(act || []);
  };

  useEffect(() => { cargar(); }, []);

  const aprobar = async (id) => { await supabase.from("businesses").update({ estado_aprobacion: "aprobado" }).eq("id", id); cargar(); };
  const rechazar = async (id) => { await supabase.from("businesses").update({ estado_aprobacion: "rechazado" }).eq("id", id); cargar(); };

  return (
    <>
      <TopBar title="Gestión de comercios" />
      <div className="p-8 flex flex-col gap-6">
        <div>
          <p className="font-body text-sm font-semibold mb-3" style={{ color: C.ink }}>Pendientes de validación</p>
          <div className="flex flex-col gap-2.5">
            {pendientes.length === 0 && <p className="font-body text-sm" style={{ color: C.inkSoft }}>Sin solicitudes pendientes.</p>}
            {pendientes.map((c) => (
              <div key={c.id} className="rounded-xl p-4 flex items-center justify-between" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
                <div>
                  <p className="font-body font-semibold text-sm" style={{ color: C.ink }}>{c.nombre_comercio}</p>
                  <p className="font-body text-xs mt-0.5" style={{ color: C.inkSoft }}>{c.tipo_establecimiento} · {c.ciudad} · {c.celular}</p>
                </div>
                <div className="flex gap-2">
                  <GhostButton onClick={() => rechazar(c.id)}>Rechazar</GhostButton>
                  <PrimaryButton onClick={() => aprobar(c.id)}>Aprobar</PrimaryButton>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="font-body text-sm font-semibold mb-3" style={{ color: C.ink }}>Comercios activos</p>
          <div className="flex flex-col gap-2.5">
            {activos.map((c) => (
              <div key={c.id} className="rounded-xl p-4 flex items-center justify-between" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
                <div>
                  <p className="font-body font-semibold text-sm" style={{ color: C.ink }}>{c.nombre_comercio}</p>
                  <p className="font-body text-xs mt-0.5" style={{ color: C.inkSoft }}>{c.tipo_establecimiento} · {c.ciudad} · {c.surplus_items?.length || 0} publicaciones</p>
                </div>
                <Pill tone="green">Aprobado</Pill>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
