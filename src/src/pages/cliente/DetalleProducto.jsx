import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Store, Package, Clock, MapPin, Check, QrCode, ArrowRight } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { C, getCategoryMeta } from "../../theme";
import { Pill, PrimaryButton } from "../../components/ui";

function generarCodigo() {
  return "CS-" + Math.floor(1000 + Math.random() * 9000);
}

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [producto, setProducto] = useState(null);
  const [paso, setPaso] = useState("detalle"); // detalle | pago | confirmacion
  const [pedido, setPedido] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("surplus_items")
        .select("*, businesses(nombre_comercio, direccion, ciudad)")
        .eq("id", id)
        .maybeSingle();
      setProducto(data);
    })();
  }, [id]);

  if (!producto) {
    return <p className="font-body text-sm text-center py-10" style={{ color: C.inkSoft }}>Cargando producto…</p>;
  }

  const meta = getCategoryMeta(producto.categoria);

  const reservarYPagar = async () => {
    setEnviando(true);
    setError("");
    const codigo = generarCodigo();
    const { data, error: orderError } = await supabase
      .from("orders")
      .insert({
        usuario_id: profile.id,
        producto_id: producto.id,
        business_id: producto.business_id,
        monto: producto.precio_oferta,
        codigo_retiro: codigo,
        estado: "pendiente",
      })
      .select()
      .single();

    if (orderError) {
      setError(orderError.message);
      setEnviando(false);
      return;
    }
    setPedido(data);
    setEnviando(false);
    setPaso("pago");
  };

  const confirmarPago = async () => {
    setEnviando(true);
    await supabase.from("payments").insert({ order_id: pedido.id, metodo_pago: "QR", estado: "pagado" });
    await supabase.from("orders").update({ estado: "confirmado" }).eq("id", pedido.id);
    const nuevaCantidad = Math.max(0, producto.cantidad - 1);
    await supabase
      .from("surplus_items")
      .update({ cantidad: nuevaCantidad, estado: nuevaCantidad === 0 ? "agotado" : "activo" })
      .eq("id", producto.id);
    setEnviando(false);
    setPaso("confirmacion");
  };

  if (paso === "pago") {
    return (
      <div className="flex flex-col h-[80vh] px-4">
        <div className="pt-4 pb-3 flex items-center gap-3">
          <button onClick={() => setPaso("detalle")}><ChevronLeft size={22} style={{ color: C.ink }} /></button>
          <span className="font-body text-sm font-semibold" style={{ color: C.ink }}>Pago con QR</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="rounded-2xl p-5" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
            <div className="w-44 h-44 rounded-lg grid grid-cols-5 grid-rows-5 gap-1 p-2" style={{ background: "#fff" }}>
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} style={{ background: [3, 4, 5, 8, 10, 12, 14, 17, 19, 21, 22].includes(i) ? C.ink : "transparent" }} />
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="font-body text-xs" style={{ color: C.inkSoft }}>Total a pagar</p>
            <p className="font-display text-3xl" style={{ color: C.ink }}>Bs {producto.precio_oferta}</p>
          </div>
        </div>
        <div className="pb-6">
          <PrimaryButton full onClick={confirmarPago} disabled={enviando}>
            <QrCode size={16} /> {enviando ? "Confirmando…" : "Simular pago escaneado"}
          </PrimaryButton>
        </div>
      </div>
    );
  }

  if (paso === "confirmacion") {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center px-6 text-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#E6EFE7" }}>
          <Check size={30} style={{ color: C.greenDeep }} />
        </div>
        <h2 className="font-display text-xl" style={{ color: C.ink }}>¡Pago confirmado!</h2>
        <p className="font-body text-sm" style={{ color: C.inkSoft }}>
          Muestra este código en {producto.businesses?.nombre_comercio} para retirar tu pedido.
        </p>
        <div className="font-display text-2xl tracking-wide px-6 py-3 rounded-xl" style={{ background: C.cream, color: C.orangeDeep }}>
          {pedido?.codigo_retiro}
        </div>
        <PrimaryButton onClick={() => navigate("/app/pedidos")}>Ver mis pedidos</PrimaryButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)}><ChevronLeft size={22} style={{ color: C.ink }} /></button>
        <span className="font-body text-sm font-semibold" style={{ color: C.ink }}>Detalle del producto</span>
      </div>
      <div className="px-4 flex flex-col gap-4 pb-4">
        <div className="relative w-full h-40 rounded-2xl overflow-hidden" style={{ background: meta.color + "22" }}>
          {producto.imagen_url && <img src={producto.imagen_url} alt="" className="w-full h-full object-cover" />}
          <div className="absolute top-3 right-3">
            <Pill tone={meta.perecedero ? "orange" : "sky"}>{meta.perecedero ? "Perecedero" : "No perecedero"}</Pill>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-body text-xs" style={{ color: C.inkSoft }}>
            <Store size={12} /> {producto.businesses?.nombre_comercio}
          </div>
          <h2 className="font-display text-xl mt-1" style={{ color: C.ink }}>{producto.nombre_producto}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-display text-2xl" style={{ color: C.orangeDeep }}>Bs {producto.precio_oferta}</span>
            <span className="font-body text-sm line-through" style={{ color: C.inkSoft }}>Bs {producto.precio_original}</span>
            <Pill tone="green">-{Math.round((1 - producto.precio_oferta / producto.precio_original) * 100)}%</Pill>
          </div>
        </div>
        <p className="font-body text-sm leading-relaxed" style={{ color: C.inkSoft }}>{producto.descripcion}</p>
        <div className="rounded-xl p-3.5 flex flex-col gap-2.5" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          <div className="flex items-center gap-2 font-body text-sm" style={{ color: C.ink }}><Package size={15} style={{ color: meta.color }} /> {producto.cantidad} unidades disponibles</div>
          <div className="flex items-center gap-2 font-body text-sm" style={{ color: C.ink }}><Clock size={15} style={{ color: meta.color }} /> Retiro entre {producto.horario_retiro}</div>
          <div className="flex items-center gap-2 font-body text-sm" style={{ color: C.ink }}><MapPin size={15} style={{ color: meta.color }} /> {producto.businesses?.direccion}, {producto.businesses?.ciudad}</div>
        </div>
        {error && <p className="font-body text-xs" style={{ color: C.pink }}>{error}</p>}
        <PrimaryButton full onClick={reservarYPagar} disabled={enviando || producto.cantidad === 0}>
          {producto.cantidad === 0 ? "Agotado" : `Reservar y pagar Bs ${producto.precio_oferta}`} <ArrowRight size={16} />
        </PrimaryButton>
      </div>
    </div>
  );
}
