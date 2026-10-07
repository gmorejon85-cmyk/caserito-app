import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, MapPin } from "lucide-react";
import { C } from "../../theme";

const tabs = [
  { to: "/app", label: "Explorar", icon: Search, end: true },
  { to: "/app/mapa", label: "Mapa", icon: MapPin },
  { to: "/app/favoritos", label: "Favoritos", icon: Heart },
  { to: "/app/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/app/perfil", label: "Perfil", icon: User },
];

export default function ClienteLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: C.cream }}>
      <div className="flex-1 max-w-lg mx-auto w-full pb-20">
        <Outlet />
      </div>
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-3 px-2 max-w-lg mx-auto"
        style={{ background: C.paper, borderTop: `1px solid ${C.line}` }}
      >
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className="flex flex-col items-center gap-1 font-body text-[11px]"
            style={({ isActive }) => ({ color: isActive ? C.orange : C.inkSoft })}
          >
            <t.icon size={20} />
            {t.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
