import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FullScreenLoader } from "./ui";

/**
 * Envuelve una pantalla y solo la muestra si:
 * - hay una sesión activa
 * - el rol del usuario está dentro de "roles" (si se especifica)
 */
export function ProtectedRoute({ roles, children }) {
  const { session, role, loading } = useAuth();

  if (loading) return <FullScreenLoader label="Cargando tu cuenta…" />;
  if (!session) return <Navigate to="/ingresar" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />;

  return children;
}
