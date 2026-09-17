import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { C } from "../../theme";
import { EstadoPill } from "../../components/ui";

export default function Pedidos() {
  const { profile } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!profile) return;
      setLoading(true);
      const { data } = await supabase
        .from("orders")
        .select("*, surplus_items(nombre_producto), businesses(nombre_comercio)")
        .eq("usuario_id", profile.id)
        .order("created_at", { ascending: false });
      setPedidos(data || []);
      setLoading(false);
    })();
  }, [profile]);

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-3">
      <h1 className="font-display text-xl" style={{ color: C.ink }}>Mis pedidos</h1>
      {loading && <p className="font-body text-sm" style={{ color: C.inkSoft }}>Cargando…</p>}
      <div className="flex flex-col gap-2.5">
        {!loading && pedidos.length === 0 && (
          <p className="font-body text-sm text-center py-8" style={{ color: C.inkSoft }}>Todavía no tienes pedidos.</p>
        )}
        {pedidos.map((o) => (
          <div key={o.id} className="rounded-xl p-3.5" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
            <div className="flex items-center justify-between">
              <span className="font-body text-xs" style={{ color: C.inkSoft }}>{o.codigo_retiro}</span>
              <EstadoPill estado={o.estado} />
            </div>
            <p className="font-body font-semibold text-sm mt-1.5" style={{ color: C.ink }}>{o.surplus_items?.nombre_producto}</p>
            <p className="font-body text-xs mt-0.5" style={{ color: C.inkSoft }}>{o.businesses?.nombre_comercio}</p>
            <p className="font-display text-sm mt-1.5" style={{ color: C.orangeDeep }}>Bs {o.monto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
