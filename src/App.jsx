import React from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import RegistroCliente from "./pages/RegistroCliente";
import RegistroComercio from "./pages/RegistroComercio";

import ClienteLayout from "./pages/cliente/ClienteLayout";
import Explorar from "./pages/cliente/Explorar";
import DetalleProducto from "./pages/cliente/DetalleProducto";
import Favoritos from "./pages/cliente/Favoritos";
import Pedidos from "./pages/cliente/Pedidos";
import Perfil from "./pages/cliente/Perfil";

import ComercioLayout from "./pages/comercio/ComercioLayout";
import ComercioDashboard from "./pages/comercio/Dashboard";
import Publicaciones from "./pages/comercio/Publicaciones";
import NuevaPublicacion from "./pages/comercio/NuevaPublicacion";
import PedidosComercio from "./pages/comercio/PedidosComercio";
import Estadisticas from "./pages/comercio/Estadisticas";
import PerfilComercio from "./pages/comercio/PerfilComercio";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import PerfilAdmin from "./pages/admin/PerfilAdmin";
import Comercios from "./pages/admin/Comercios";
import Usuarios from "./pages/admin/Usuarios";
import CrearUsuario from "./pages/admin/CrearUsuario";
import PublicacionesAdmin from "./pages/admin/PublicacionesAdmin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/ingresar" element={<Login />} />
      <Route path="/registro-cliente" element={<RegistroCliente />} />
      <Route path="/registro-comercio" element={<RegistroComercio />} />

      <Route path="/app" element={<ProtectedRoute roles={["cliente"]}><ClienteLayout /></ProtectedRoute>}>
        <Route index element={<Explorar />} />
        <Route path="producto/:id" element={<DetalleProducto />} />
        <Route path="favoritos" element={<Favoritos />} />
        <Route path="pedidos" element={<Pedidos />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>

      <Route path="/comercio" element={<ProtectedRoute roles={["comercio"]}><ComercioLayout /></ProtectedRoute>}>
        <Route index element={<ComercioDashboard />} />
        <Route path="publicaciones" element={<Publicaciones />} />
        <Route path="publicaciones/nueva" element={<NuevaPublicacion />} />
        <Route path="pedidos" element={<PedidosComercio />} />
        <Route path="estadisticas" element={<Estadisticas />} />
        <Route path="perfil" element={<PerfilComercio />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="perfil" element={<PerfilAdmin />} />
        <Route path="comercios" element={<Comercios />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="crear-usuario" element={<CrearUsuario />} />
        <Route path="publicaciones" element={<PublicacionesAdmin />} />
      </Route>

      <Route path="*" element={<Landing />} />
    </Routes>
  );
}
