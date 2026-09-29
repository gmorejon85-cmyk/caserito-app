import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Store, Users, FileText, UserPlus } from "lucide-react";
import { C } from "../../theme";

const nav = [
  { to: "/admin", label: "Dashboard", icon: BarChart3, end: true },
  { to: "/admin/comercios", label: "Comercios", icon: Store },
  { to: "/admin/usuarios", label: "Usuarios", icon: Users },
  { to: "/admin/crear-usuario", label: "Crear usuario", icon: UserPlus },
  { to: "/admin/publicaciones", label: "Publicaciones", icon: FileText },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen w-full flex" style={{ background: C.cream }}>
      <div className="w-56 shrink-0 flex flex-col py-6" style={{ background: C.ink }}>
        <div className="px-5 pb-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display" style={{ background: C.gold, color: C.ink }}>C</div>
          <span className="font-display text-lg" style={{ color: "#FFF8EE" }}>Caserito Admin</span>
        </div>
        <div className="flex flex-col gap-1 px-3">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg font-body text-sm text-left"
              style={({ isActive }) => ({ background: isActive ? "rgba(255,255,255,0.12)" : "transparent", color: isActive ? "#FFF8EE" : "#B7AF9D" })}
            >
              <n.icon size={16} /> {n.label}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
