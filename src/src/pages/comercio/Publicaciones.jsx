import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pause, Play, Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { C } from "../../theme";
import { Pill, PrimaryButton, ProductThumb, EstadoPill } from "../../components/ui";
import { TopBar } from "../../components/TopBar";

export default function Publicaciones() {
  const { business } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("surplus_items").select("*")
      .eq("business_id", business.id).order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { cargar(); }, [business]);

  const togglePausa = async (item) => {
    const nuevoEstado = item.estado === "activo" ? "pausado" : "activo";
    await supabase.from("surplus_items").update({ estado: nuevoEstado }).eq("id", item.id);
    cargar();
  };

  const eliminar = async (item) => {
    if (!confirm("¿Eliminar esta publicación?")) return;
    await supabase.from("surplus_items").delete().eq("id", item.id);
    cargar();
  };

  return (
    <>
      <TopBar title="Publicaciones" action={<Link to="/comercio/publicaciones/nueva"><PrimaryButton><Plus size={16} /> Nueva publicación</PrimaryButton></Link>} />
      <div className="p-8 flex flex-col gap-3">
        {loading && <p className="font-body text-sm" style={{ color: C.inkSoft }}>Cargando…</p>}
        {!loading && items.length === 0 && <p className="font-body text-sm" style={{ color: C.inkSoft }}>Todavía no tienes publicaciones.</p>}
        {items.map((p) => (
          <div key={p.id} className="rounded-xl p-4 flex items-center gap-4" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
            <ProductThumb producto={p} size={56} radius="rounded-lg" />
            <div className="flex-1">
              <p className="font-body font-semibold text-sm" style={{ color: C.ink }}>{p.nombre_producto}</p>
              <p className="font-body text-xs mt-0.5" style={{ color: C.inkSoft }}>{p.cantidad} disponibles · retiro {p.horario_retiro}</p>
            </div>
            <span className="font-display text-sm" style={{ color: C.orangeDeep }}>Bs {p.precio_oferta}</span>
            <EstadoPill estado={p.estado} />
            <button onClick={() => togglePausa(p)} className="p-2 rounded-lg" style={{ background: C.cream }}>
              {p.estado === "activo" ? <Pause size={14} style={{ color: C.ink }} /> : <Play size={14} style={{ color: C.ink }} />}
            </button>
            <button onClick={() => eliminar(p)} className="p-2 rounded-lg" style={{ background: C.cream }}>
              <Trash2 size={14} style={{ color: C.pink }} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
