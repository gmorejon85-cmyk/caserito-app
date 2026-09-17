import React from "react";
import { Bell, LogOut } from "lucide-react";
import { C } from "../theme";
import { useAuth } from "../context/AuthContext";

export function TopBar({ title, action }) {
  const { signOut } = useAuth();
  return (
    <div className="flex items-center justify-between px-6 md:px-8 py-5" style={{ borderBottom: `1px solid ${C.line}` }}>
      <h1 className="font-display text-2xl" style={{ color: C.ink }}>{title}</h1>
      <div className="flex items-center gap-3">
        {action}
        <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.cream }}>
          <Bell size={16} style={{ color: C.ink }} />
        </button>
        <button
          onClick={signOut}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: C.cream }}
          title="Cerrar sesión"
        >
          <LogOut size={16} style={{ color: C.ink }} />
        </button>
      </div>
    </div>
  );
}
