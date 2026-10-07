import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Clock } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { C } from "../../theme";
import { Pill, ProductThumb } from "../../components/ui";

export default function Favoritos() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!profile) return;
      setLoading(true);
      const { data } = await supabase
        .from("favorites")
        .select("producto_id, surplus_items(*, businesses(nombre_comercio))")
        .eq("usuario_id", profile.id);
      setItems((data || []).map((f) => f.surplus_items).filter(Boolean));
      setLoading(false);
    })();
  }, [profile]);

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-3">
      <h1 className="font-display text-xl" style={{ color: C.ink }}>Tus favoritos</h1>
      {loading && <p className="font-body text-sm" style={{ color: C.inkSoft }}>Cargando…</p>}
      <div className="flex flex-col gap-2.5">
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10">
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: C.cream }}>
              <Heart size={18} style={{ color: C.inkSoft }} />
            </div>
            <p className="font-body text-sm text-center" style={{ color: C.inkSoft }}>Aún no marcaste productos favoritos.</p>
          </div>
        )}
        {items.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(`/app/producto/${p.id}`)}
            className="w-full text-left rounded-2xl overflow-hidden flex gap-3 p-2.5"
            style={{ background: C.paper, border: `1px solid ${C.line}` }}
          >
            <ProductThumb producto={p} size={72} />
            <div className="flex-1 min-w-0 py-0.5">
              <p className="font-body font-semibold text-[13.5px]" style={{ color: C.ink }}>{p.nombre_producto}</p>
              <p className="font-body text-xs mt-0.5" style={{ color: C.inkSoft }}>{p.businesses?.nombre_comercio}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-display text-[15px]" style={{ color: C.orangeDeep }}>Bs {p.precio_oferta}</span>
                <Pill tone="green">-{Math.round((1 - p.precio_oferta / p.precio_original) * 100)}%</Pill>
              </div>
              <div className="flex items-center gap-1 mt-1.5 font-body text-[11px]" style={{ color: C.inkSoft }}>
                <Clock size={11} /> Retiro {p.horario_retiro}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
