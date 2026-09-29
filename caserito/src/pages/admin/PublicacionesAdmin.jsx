import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { C } from "../../theme";
import { Pill, ProductThumb, EstadoPill } from "../../components/ui";
import { TopBar } from "../../components/TopBar";

export default function PublicacionesAdmin() {
  const [items, setItems] = useState([]);

  const cargar = async () => {
    const { data } = await supabase
      .from("surplus_items")
      .select("*, businesses(nombre_comercio)")
      .order("created_at", { ascending: false });
    setItems(data || []);
  };

  useEffect(() => { cargar(); }, []);

  const pausar = async (id, estadoActual) => {
    const nuevo = estadoActual === "activo" ? "pausado" : "activo";
    await supabase.from("surplus_items").update({ estado: nuevo }).eq("id", id);
    cargar();
  };

  return (
    <>
      <TopBar title="Validación de publicaciones" />
      <div className="p-8 flex flex-col gap-2.5">
        {items.map((p) => (
          <div key={p.id} className="rounded-xl p-4 flex items-center gap-4" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
            <ProductThumb producto={p} size={48} radius="rounded-lg" />
            <div className="flex-1">
              <p className="font-body font-semibold text-sm" style={{ color: C.ink }}>{p.nombre_producto}</p>
              <p className="font-body text-xs mt-0.5" style={{ color: C.inkSoft }}>{p.businesses?.nombre_comercio}</p>
            </div>
            <EstadoPill estado={p.estado} />
            <button
              onClick={() => pausar(p.id, p.estado)}
              className="font-body text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: C.cream, color: C.ink }}
            >
              {p.estado === "activo" ? "Pausar" : "Reactivar"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
