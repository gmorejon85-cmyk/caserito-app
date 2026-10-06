import React, { useEffect, useState } from "react";
import { Coins, ShoppingBag, Package, Leaf, ArrowRight } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { C } from "../../theme";
import { StatCard } from "../../components/ui";

export default function Perfil() {
  const { profile, signOut } = useAuth();
  const [stats, setStats] = useState({ ahorro: 0, compras: 0 });

  useEffect(() => {
    (async () => {
      if (!profile) return;
      const { data } = await supabase
        .from("orders")
        .select("monto, surplus_items(precio_original)")
        .eq("usuario_id", profile.id)
        .in("estado", ["confirmado", "retirado"]);
      const compras = data?.length || 0;
      const ahorro = (data || []).reduce((acc, o) => acc + ((o.surplus_items?.precio_original || 0) - o.monto), 0);
      setStats({ ahorro, compras });
    })();
  }, [profile]);

  const iniciales = (profile?.nombre || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="flex flex-col gap-5 px-4 pt-4 pb-3">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full flex items-center justify-center font-display text-lg" style={{ background: C.gold, color: "#4A3410" }}>{iniciales}</div>
        <div>
          <h1 className="font-display text-lg" style={{ color: C.ink }}>{profile?.nombre}</h1>
          <p className="font-body text-xs" style={{ color: C.inkSoft }}>{profile?.ciudad}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Coins} label="Dinero ahorrado" value={`Bs ${stats.ahorro.toFixed(0)}`} accent={C.orange} />
        <StatCard icon={ShoppingBag} label="Productos comprados" value={stats.compras} accent={C.sky} />
        <StatCard icon={Package} label="Kg recuperados (aprox.)" value={(stats.compras * 0.8).toFixed(1)} accent={C.green} />
        <StatCard icon={Leaf} label="CO₂ evitado (aprox.)" value={`${(stats.compras * 0.4).toFixed(1)} kg`} accent={C.greenDeep} />
      </div>
      <button
        onClick={signOut}
        className="flex items-center justify-between rounded-xl px-4 py-3 font-body text-sm"
        style={{ background: C.paper, border: `1px solid ${C.line}`, color: C.ink }}
      >
        Cerrar sesión <ArrowRight size={14} style={{ color: C.inkSoft }} />
      </button>
    </div>
  );
}
