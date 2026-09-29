import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { C } from "../../theme";
import { Pill } from "../../components/ui";
import { TopBar } from "../../components/TopBar";

const roleTone = { admin: "pink", comercio: "sky", cliente: "green" };

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("*").order("fecha_registro", { ascending: false });
      setUsuarios(data || []);
    })();
  }, []);

  return (
    <>
      <TopBar title="Gestión de usuarios" />
      <div className="p-8">
        <div className="rounded-2xl overflow-hidden" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          {usuarios.map((u, i) => (
            <div key={u.id} className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: i < usuarios.length - 1 ? `1px solid ${C.line}` : "none" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-body text-xs font-bold" style={{ background: C.cream, color: C.ink }}>
                  {(u.nombre || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-body text-sm font-medium" style={{ color: C.ink }}>{u.nombre}</p>
                  <p className="font-body text-xs" style={{ color: C.inkSoft }}>{u.ciudad}</p>
                </div>
              </div>
              <Pill tone={roleTone[u.tipo_usuario] || "cream"}>{u.tipo_usuario}</Pill>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
