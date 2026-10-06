import React, { useEffect, useState } from "react";
import { Coins, Recycle, Users, Package } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { C } from "../../theme";
import { StatCard } from "../../components/ui";
import { TopBar } from "../../components/TopBar";

export default function Estadisticas() {
  const { business } = useAuth();
  const [datos, setDatos] = useState({ ingresos: 0, pedidos: 0, clientes: 0, recuperados: 0 });

  useEffect(() => {
    (async () => {
      const { data: pedidos } = await supabase
        .from("orders").select("monto, usuario_id")
        .eq("business_id", business.id).in("estado", ["confirmado", "retirado"]);
      const ingresos = (pedidos || []).reduce((a, o) => a + Number(o.monto), 0);
      const clientes = new Set((pedidos || []).map((o) => o.usuario_id)).size;
      setDatos({ ingresos, pedidos: (pedidos || []).length, clientes, recuperados: (pedidos || []).length * 0.8 });
    })();
  }, [business]);

  return (
    <>
      <TopBar title="Estadísticas" />
      <div className="p-8 flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard icon={Coins} label="Ingresos totales" value={`Bs ${datos.ingresos.toFixed(0)}`} accent={C.orange} />
          <StatCard icon={Recycle} label="Desperdicio evitado (aprox.)" value={`${datos.recuperados.toFixed(1)} kg`} accent={C.green} />
          <StatCard icon={Users} label="Clientes atendidos" value={datos.clientes} accent={C.sky} />
          <StatCard icon={Package} label="Productos vendidos" value={datos.pedidos} accent={C.pink} />
        </div>
      </div>
    </>
  );
}
