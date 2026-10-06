import React, { useEffect, useState } from "react";
import { Coins, ShoppingBag, Package, Clock } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { C } from "../../theme";
import { StatCard, EstadoPill } from "../../components/ui";
import { TopBar } from "../../components/TopBar";

export default function Dashboard() {
  const { business } = useAuth();
  const [activos, setActivos] = useState(0);
  const [pendientes, setPendientes] = useState(0);
  const [ingresosHoy, setIngresosHoy] = useState(0);
  const [pedidosHoy, setPedidosHoy] = useState(0);
  const [ultimos, setUltimos] = useState([]);

  useEffect(() => {
    (async () => {
      const { count: activosCount } = await supabase
        .from("surplus_items").select("id", { count: "exact", head: true })
        .eq("business_id", business.id).eq("estado", "activo");
      setActivos(activosCount || 0);

      const { count: pendCount } = await supabase
        .from("orders").select("id", { count: "exact", head: true })
        .eq("business_id", business.id).eq("estado", "pendiente");
      setPendientes(pendCount || 0);

      const inicioHoy = new Date(); inicioHoy.setHours(0, 0, 0, 0);
      const { data: hoy } = await supabase
        .from("orders").select("monto")
        .eq("business_id", business.id).gte("created_at", inicioHoy.toISOString());
      setIngresosHoy((hoy || []).reduce((a, o) => a + Number(o.monto), 0));
      setPedidosHoy((hoy || []).length);

      const { data: ult } = await supabase
        .from("orders").select("*, profiles(nombre), surplus_items(nombre_producto)")
        .eq("business_id", business.id).order("created_at", { ascending: false }).limit(5);
      setUltimos(ult || []);
    })();
  }, [business]);

  return (
    <>
      <TopBar title="Dashboard" />
      <div className="p-8 flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard icon={Coins} label="Ingresos hoy" value={`Bs ${ingresosHoy.toFixed(0)}`} accent={C.orange} />
          <StatCard icon={ShoppingBag} label="Pedidos hoy" value={pedidosHoy} accent={C.sky} />
          <StatCard icon={Package} label="Publicaciones activas" value={activos} accent={C.green} />
          <StatCard icon={Clock} label="Pedidos pendientes" value={pendientes} accent={C.pink} />
        </div>
        <div className="rounded-2xl p-5" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          <p className="font-body text-sm font-semibold mb-4" style={{ color: C.ink }}>Últimos pedidos</p>
          <div className="flex flex-col gap-2.5">
            {ultimos.length === 0 && <p className="font-body text-sm" style={{ color: C.inkSoft }}>Todavía no tienes pedidos.</p>}
            {ultimos.map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${C.line}` }}>
                <div>
                  <p className="font-body text-sm font-medium" style={{ color: C.ink }}>{o.surplus_items?.nombre_producto}</p>
                  <p className="font-body text-xs" style={{ color: C.inkSoft }}>{o.profiles?.nombre} · {o.codigo_retiro}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm" style={{ color: C.orangeDeep }}>Bs {o.monto}</span>
                  <EstadoPill estado={o.estado} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
