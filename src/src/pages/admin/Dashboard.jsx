import React, { useEffect, useState } from "react";
import { Store, Users, Recycle, Wallet, CircleCheck, CircleX } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { C } from "../../theme";
import { StatCard } from "../../components/ui";
import { TopBar } from "../../components/TopBar";

export default function Dashboard() {
  const [stats, setStats] = useState({ comercios: 0, usuarios: 0, ingresos: 0, pedidos: 0 });
  const [pendientes, setPendientes] = useState([]);

  const cargar = async () => {
    const { count: comerciosCount } = await supabase.from("businesses").select("id", { count: "exact", head: true }).eq("estado_aprobacion", "aprobado");
    const { count: usuariosCount } = await supabase.from("profiles").select("id", { count: "exact", head: true });
    const { data: pedidosData } = await supabase.from("orders").select("monto").in("estado", ["confirmado", "retirado"]);
    const { data: pend } = await supabase.from("businesses").select("*").eq("estado_aprobacion", "pendiente");
    setStats({
      comercios: comerciosCount || 0,
      usuarios: usuariosCount || 0,
      ingresos: (pedidosData || []).reduce((a, o) => a + Number(o.monto), 0),
      pedidos: (pedidosData || []).length,
    });
    setPendientes(pend || []);
  };

  useEffect(() => { cargar(); }, []);

  const aprobar = async (id) => { await supabase.from("businesses").update({ estado_aprobacion: "aprobado" }).eq("id", id); cargar(); };
  const rechazar = async (id) => { await supabase.from("businesses").update({ estado_aprobacion: "rechazado" }).eq("id", id); cargar(); };

  return (
    <>
      <TopBar title="Dashboard general" />
      <div className="p-8 flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard icon={Store} label="Comercios activos" value={stats.comercios} accent={C.orange} />
          <StatCard icon={Users} label="Usuarios registrados" value={stats.usuarios} accent={C.sky} />
          <StatCard icon={Recycle} label="Pedidos completados" value={stats.pedidos} accent={C.green} />
          <StatCard icon={Wallet} label="Ingresos en plataforma" value={`Bs ${stats.ingresos.toFixed(0)}`} accent={C.pink} />
        </div>
        <div className="rounded-2xl p-5" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          <p className="font-body text-sm font-semibold mb-4" style={{ color: C.ink }}>Comercios pendientes de aprobación</p>
          {pendientes.length === 0 && <p className="font-body text-sm" style={{ color: C.inkSoft }}>No hay solicitudes pendientes.</p>}
          <div className="flex flex-col gap-2.5">
            {pendientes.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${C.line}` }}>
                <div>
                  <p className="font-body text-sm font-medium" style={{ color: C.ink }}>{c.nombre_comercio}</p>
                  <p className="font-body text-xs" style={{ color: C.inkSoft }}>{c.tipo_establecimiento} · {c.ciudad}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => aprobar(c.id)} className="p-2 rounded-lg" style={{ background: "#E6EFE7" }}><CircleCheck size={16} style={{ color: C.greenDeep }} /></button>
                  <button onClick={() => rechazar(c.id)} className="p-2 rounded-lg" style={{ background: "#F3DEE6" }}><CircleX size={16} style={{ color: C.pink }} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
