import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { C, CATEGORIAS, getCategoryMeta } from "../../theme";
import { Input, Select, Pill, PrimaryButton, GhostButton, FullScreenLoader } from "../../components/ui";
import { TopBar } from "../../components/TopBar";

export default function EditarPublicacion() {
  const { id } = useParams();
  const { business } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("surplus_items").select("*").eq("id", id).maybeSingle();
      if (data) {
        setForm({
          nombre_producto: data.nombre_producto || "",
          categoria: data.categoria || CATEGORIAS[0],
          descripcion: data.descripcion || "",
          cantidad: data.cantidad ?? "",
          precio_original: data.precio_original ?? "",
          precio_oferta: data.precio_oferta ?? "",
          condiciones: data.condiciones || "",
          horario_retiro: data.horario_retiro || "",
          fecha_limite: data.fecha_limite || "",
          imagen_url: data.imagen_url || null,
        });
      }
    })();
  }, [id]);

  if (!form) return <FullScreenLoader label="Cargando publicación…" />;

  const descuento = form.precio_original && form.precio_oferta
    ? Math.round((1 - Number(form.precio_oferta) / Number(form.precio_original)) * 100)
    : null;

  const handleArchivo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArchivo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");

    let imagen_url = form.imagen_url;
    if (archivo) {
      const nombreArchivo = `${business.id}/${Date.now()}-${archivo.name}`;
      const { error: uploadError } = await supabase.storage.from("productos").upload(nombreArchivo, archivo);
      if (uploadError) {
        setError("No se pudo subir la imagen: " + uploadError.message);
        setSending(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from("productos").getPublicUrl(nombreArchivo);
      imagen_url = publicUrlData.publicUrl;
    }

    const { error: updateError } = await supabase.from("surplus_items").update({
      nombre_producto: form.nombre_producto,
      categoria: form.categoria,
      descripcion: form.descripcion,
      imagen_url,
      cantidad: Number(form.cantidad) || 0,
      precio_original: Number(form.precio_original) || 0,
      precio_oferta: Number(form.precio_oferta) || 0,
      condiciones: form.condiciones,
      horario_retiro: form.horario_retiro,
      fecha_limite: form.fecha_limite || null,
      es_perecedero: getCategoryMeta(form.categoria).perecedero,
    }).eq("id", id);

    setSending(false);
    if (updateError) { setError(updateError.message); return; }
    navigate("/comercio/publicaciones");
  };

  return (
    <>
      <TopBar title="Editar publicación" />
      <form onSubmit={handleSubmit} className="p-8 max-w-2xl flex flex-col gap-5">
        <label className="w-full h-36 rounded-xl flex flex-col items-center justify-center gap-2 font-body text-sm cursor-pointer overflow-hidden"
          style={{ background: C.cream, border: `1.5px dashed ${C.line}`, color: C.inkSoft }}>
          {preview || form.imagen_url ? (
            <img src={preview || form.imagen_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <>
              <Camera size={22} /> Subir foto del producto
            </>
          )}
          <input type="file" accept="image/*" onChange={handleArchivo} className="hidden" />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre del producto" required value={form.nombre_producto} onChange={(e) => setForm({ ...form, nombre_producto: e.target.value })} />
          <Select label="Categoría" options={CATEGORIAS} value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
          <div className="col-span-2">
            <Input label="Condiciones de consumo / uso" value={form.condiciones} onChange={(e) => setForm({ ...form, condiciones: e.target.value })} />
          </div>
          <Input label="Cantidad disponible" type="number" required value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
          <Input label="Horario de retiro" required value={form.horario_retiro} onChange={(e) => setForm({ ...form, horario_retiro: e.target.value })} />
          <Input label="Precio original (Bs)" type="number" required value={form.precio_original} onChange={(e) => setForm({ ...form, precio_original: e.target.value })} />
          <Input label="Precio Caserito (Bs)" type="number" required value={form.precio_oferta} onChange={(e) => setForm({ ...form, precio_oferta: e.target.value })} />
          <Input label="Fecha límite" type="date" value={form.fecha_limite || ""} onChange={(e) => setForm({ ...form, fecha_limite: e.target.value })} />
          <div className="col-span-2">
            <Input label="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          </div>
        </div>

        {descuento !== null && !isNaN(descuento) && <Pill tone="green">Descuento calculado: {descuento}%</Pill>}
        {error && <p className="font-body text-xs" style={{ color: C.pink }}>{error}</p>}

        <div className="flex gap-3 pt-2">
          <PrimaryButton type="submit" disabled={sending}>{sending ? "Guardando…" : "Guardar cambios"}</PrimaryButton>
          <GhostButton onClick={() => navigate("/comercio/publicaciones")}>Cancelar</GhostButton>
        </div>
      </form>
    </>
  );
}
