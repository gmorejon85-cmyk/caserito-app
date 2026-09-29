import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, Heart, SearchX } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { C, CATEGORIAS, getCategoryMeta } from "../../theme";
import { Pill, ProductThumb } from "../../components/ui";

export default function Explorar() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [categoria, setCategoria] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("surplus_items")
        .select("*, businesses!inner(nombre_comercio, ciudad, estado_aprobacion)")
        .eq("estado", "activo")
        .eq("businesses.estado_aprobacion", "aprobado")
        .order("created_at", { ascending: false });
      setProductos(data || []);
      setLoading(false);

      if (profile) {
        const { data: favData } = await supabase.from("favorites").select("producto_id").eq("usuario_id", profile.id);
        setFavoritos((favData || []).map((f) => f.producto_id));
      }
    })();
  }, [profile]);

  const toggleFav = async (id) => {
    if (!profile) return;
    if (favoritos.includes(id)) {
      await supabase.from("favorites").delete().eq("usuario_id", profile.id).eq("producto_id", id);
      setFavoritos((f) => f.filter((x) => x !== id));
    } else {
      await supabase.from("favorites").insert({ usuario_id: profile.id, producto_id: id });
      setFavoritos((f) => [...f, id]);
    }
  };

  const filtrados = productos.filter((p) => {
    const okCat = categoria === "Todos" || p.categoria === categoria;
    const okBusqueda = p.nombre_producto?.toLowerCase().includes(busqueda.toLowerCase());
    return okCat && okBusqueda;
  });

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-3">
      <div>
        <p className="font-body text-xs" style={{ color: C.inkSoft }}>{profile?.ciudad || "Bolivia"}</p>
        <h1 className="font-display text-[22px] mt-0.5" style={{ color: C.ink }}>
          Buenas, {profile?.nombre?.split(" ")[0] || "caserito"}
        </h1>
      </div>
      <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
        <Search size={16} style={{ color: C.inkSoft }} />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar excedentes cerca de ti"
          className="font-body text-sm outline-none bg-transparent w-full"
          style={{ color: C.ink }}
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {["Todos", ...CATEGORIAS].map((c) => (
          <button
            key={c}
            onClick={() => setCategoria(c)}
            className="font-body text-xs font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap"
            style={{
              background: categoria === c ? C.ink : C.paper,
              color: categoria === c ? "#FFF8EE" : C.ink,
              border: `1px solid ${categoria === c ? C.ink : C.line}`,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && <p className="font-body text-sm text-center py-8" style={{ color: C.inkSoft }}>Cargando ofertas…</p>}

      <div className="flex flex-col gap-2.5">
        {!loading && filtrados.map((p) => {
          const meta = getCategoryMeta(p.categoria);
          return (
            <button
              key={p.id}
              onClick={() => navigate(`/app/producto/${p.id}`)}
              className="w-full text-left rounded-2xl overflow-hidden flex gap-3 p-2.5"
              style={{ background: C.paper, border: `1px solid ${C.line}` }}
            >
              <ProductThumb producto={p} size={80} />
              <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-body font-semibold text-[13.5px] leading-snug" style={{ color: C.ink }}>{p.nombre_producto}</p>
                  <Heart
                    size={16}
                    onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }}
                    fill={favoritos.includes(p.id) ? C.pink : "none"}
                    style={{ color: C.pink, flexShrink: 0 }}
                  />
                </div>
                <p className="font-body text-xs mt-0.5" style={{ color: C.inkSoft }}>{p.businesses?.nombre_comercio}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="font-display text-[15px]" style={{ color: C.orangeDeep }}>Bs {p.precio_oferta}</span>
                  <span className="font-body text-xs line-through" style={{ color: C.inkSoft }}>Bs {p.precio_original}</span>
                  <Pill tone="green">-{Math.round((1 - p.precio_oferta / p.precio_original) * 100)}%</Pill>
                  <Pill tone={meta.perecedero ? "orange" : "sky"}>{meta.perecedero ? "Perecedero" : "No perecedero"}</Pill>
                </div>
                <div className="flex items-center gap-1 mt-1.5 font-body text-[11px]" style={{ color: C.inkSoft }}>
                  <Clock size={11} /> Retiro {p.horario_retiro} · {p.cantidad} disp.
                </div>
              </div>
            </button>
          );
        })}
        {!loading && filtrados.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10">
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: C.cream }}>
              <SearchX size={18} style={{ color: C.inkSoft }} />
            </div>
            <p className="font-body text-sm text-center" style={{ color: C.inkSoft }}>No hay excedentes en esta categoría por ahora.</p>
          </div>
        )}
      </div>
    </div>
  );
}
