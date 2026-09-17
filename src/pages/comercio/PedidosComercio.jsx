import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { C } from "../../theme";
import { EstadoPill, PrimaryButton } from "../../components/ui";
import { TopBar } from "../../components/TopBar";

export default function PedidosComercio() {
  const { business } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*, profiles(nombre), surplus_items(nombre_producto)")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false });
    setPedidos(data || []);
    setLoading(false);
  };

  useEffect(() => { cargar(); }, [business]);

  const confirmarEntrega = async (id) => {
    await supabase.from("orders").update({ estado: "retirado" }).eq("id", id);
    cargar();
  };

  return (
    <>
      <TopBar title="Pedidos" />
      <div className="p-8 flex flex-col gap-3">
        {loading && <p className="font-body text-sm" style={{ color: C.inkSoft }}>Cargando…</p>}
        {!loading && pedidos.length === 0 && <p className="font-body text-sm" style={{ color: C.inkSoft }}>Todavía no tienes pedidos.</p>}
        {pedidos.map((o) => (
          <div key={o.id} className="rounded-xl p-4 flex items-center justify-between" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
            <div>
              <p className="font-body font-semibold text-sm" style={{ color: C.ink }}>{o.surplus_items?.nombre_producto}</p>
              <p className="font-body text-xs mt-0.5" style={{ color: C.inkSoft }}>{o.profiles?.nombre} · {o.codigo_retiro}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-display text-sm" style={{ color: C.orangeDeep }}>Bs {o.monto}</span>
              <EstadoPill estado={o.estado} />
              {o.estado === "confirmado" && (
                <PrimaryButton style={{ padding: "8px 14px" }} onClick={() => confirmarEntrega(o.id)}>Confirmar entrega</PrimaryButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
