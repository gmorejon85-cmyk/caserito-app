import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { supabaseForNewUsers } from "../../lib/supabaseAdminClient";
import { C } from "../../theme";
import { Input, Select, PrimaryButton } from "../../components/ui";
import { TopBar } from "../../components/TopBar";

const ROLES = ["cliente", "comercio", "admin"];

export default function CrearUsuario() {
  const [form, setForm] = useState({ nombre: "", ciudad: "La Paz", celular: "", email: "", password: "", tipo_usuario: "cliente" });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setSending(true);

    // 1. Creamos la cuenta con un cliente de Supabase aislado, para no cerrar
    //    la sesión del administrador que está usando esta pantalla ahora mismo.
    const { data, error: signUpError } = await supabaseForNewUsers.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { nombre: form.nombre, ciudad: form.ciudad, celular: form.celular } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setSending(false);
      return;
    }

    const nuevoId = data.user?.id;

    // 2. El nuevo usuario siempre nace como "cliente" (por seguridad). Si el
    //    administrador eligió otro rol, lo actualizamos aquí usando la sesión
    //    del administrador, que sí tiene permiso para cambiar roles.
    if (nuevoId && form.tipo_usuario !== "cliente") {
      const { error: roleError } = await supabase.from("profiles").update({ tipo_usuario: form.tipo_usuario }).eq("id", nuevoId);
      if (roleError) {
        setError("El usuario se creó, pero no se pudo asignar el rol: " + roleError.message);
        setSending(false);
        return;
      }
    }

    setSending(false);
    setMensaje(
      data.session
        ? `Usuario ${form.email} creado y listo para iniciar sesión.`
        : `Usuario ${form.email} creado. Debe confirmar su correo antes de poder iniciar sesión (revisa la configuración de Auth en Supabase si quieres desactivar esto).`
    );
    setForm({ nombre: "", ciudad: "La Paz", celular: "", email: "", password: "", tipo_usuario: "cliente" });
  };

  return (
    <>
      <TopBar title="Crear usuario" />
      <form onSubmit={handleSubmit} className="p-8 max-w-md flex flex-col gap-4">
        <p className="font-body text-xs" style={{ color: C.inkSoft }}>
          Usa esto para dar de alta empleados, vendedores u otros administradores sin volver a Supabase.
        </p>
        <Input label="Nombre completo" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <Input label="Ciudad" required value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
        <Input label="Celular" value={form.celular} onChange={(e) => setForm({ ...form, celular: e.target.value })} />
        <Input label="Correo electrónico" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Contraseña" type="password" minLength={6} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Select label="Rol" options={ROLES} value={form.tipo_usuario} onChange={(e) => setForm({ ...form, tipo_usuario: e.target.value })} />
        {error && <p className="font-body text-xs" style={{ color: C.pink }}>{error}</p>}
        {mensaje && <p className="font-body text-xs" style={{ color: C.greenDeep }}>{mensaje}</p>}
        <PrimaryButton type="submit" disabled={sending}><UserPlus size={16} /> {sending ? "Creando…" : "Crear usuario"}</PrimaryButton>
      </form>
    </>
  );
}
