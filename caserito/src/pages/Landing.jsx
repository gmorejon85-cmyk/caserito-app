import React from "react";
import { Link } from "react-router-dom";
import { Coins, MapPin, Leaf, Sparkles, Store, Package, Building2, Handshake } from "lucide-react";
import { C } from "../theme";
import { PrimaryButton, GhostButton } from "../components/ui";

export default function Landing() {
  return (
    <div className="min-h-screen w-full font-body" style={{ background: "#F1E8D6" }}>
      {/* NAV */}
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display" style={{ background: C.gold, color: C.ink }}>C</div>
          <span className="font-display text-lg" style={{ color: C.ink }}>Caserito</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/ingresar"><GhostButton>Iniciar sesión</GhostButton></Link>
          <Link to="/registro-cliente"><PrimaryButton>Crear cuenta</PrimaryButton></Link>
        </div>
      </div>

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-5">
          <p className="font-body text-xs font-semibold" style={{ color: C.orangeDeep }}>BOLIVIA · LA PAZ · SANTA CRUZ · COCHABAMBA</p>
          <h1 className="font-display leading-[1.05]" style={{ color: C.ink, fontSize: "44px" }}>
            Lo que no se vendió, todavía puede tener dueño
          </h1>
          <p className="font-body text-base leading-relaxed max-w-md" style={{ color: C.inkSoft }}>
            Caserito conecta restaurantes, panaderías, supermercados, ferreterías y tiendas que tienen excedentes —
            de comida o de mercadería que lleva tiempo en el almacén — con personas que quieren pagar menos por
            productos en buen estado.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link to="/registro-cliente"><PrimaryButton>Explorar ofertas cerca de ti</PrimaryButton></Link>
            <Link to="/registro-comercio"><GhostButton>Registra tu comercio</GhostButton></Link>
          </div>
        </div>
        <div className="rounded-3xl p-8" style={{ background: C.greenDeep }}>
          <p className="font-body text-xs font-semibold" style={{ color: "#CFE3D3" }}>NUESTRO IMPACTO</p>
          <p className="font-display text-3xl mt-2" style={{ color: "#FFF8EE" }}>+3,400 kg</p>
          <p className="font-body text-sm" style={{ color: "#CFE3D3" }}>de comida y mercadería recuperada</p>
        </div>
      </div>

      {/* POR QUÉ USAR */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display text-3xl max-w-lg" style={{ color: C.ink }}>Buen precio, buen gesto, cero desperdicio</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {[
            { icon: Coins, texto: "Paga hasta 70% menos por comida y mercadería en buen estado" },
            { icon: MapPin, texto: "Descubre excedentes disponibles cerca de tu ubicación" },
            { icon: Leaf, texto: "Reduce el desperdicio de alimentos y el stock parado en almacenes" },
            { icon: Sparkles, texto: "Descubre panaderías, ferreterías, tiendas y restaurantes nuevos de tu ciudad" },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl p-5" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
              <f.icon size={20} style={{ color: C.orange }} />
              <p className="font-body text-sm mt-3" style={{ color: C.ink }}>{f.texto}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PARA TU NEGOCIO */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="font-body text-xs font-semibold" style={{ color: C.orangeDeep }}>PARA TU NEGOCIO</p>
        <h2 className="font-display text-3xl mt-2 max-w-lg" style={{ color: C.ink }}>Una solución para cada tipo de comercio</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mt-10">
          {[
            { icon: Store, titulo: "Excedentes diarios", texto: "Publica lo que no vendiste hoy: pan, almuerzos o repostería.", para: "Restaurantes, cafeterías, panaderías" },
            { icon: Package, titulo: "Mercadería de bodega", texto: "Dale salida al stock que lleva tiempo guardado.", para: "Ferreterías y tiendas" },
            { icon: Building2, titulo: "Panel Caserito Negocios", texto: "Gestiona publicaciones, pedidos y estadísticas.", para: "Supermercados y cadenas" },
            { icon: Handshake, titulo: "Únete a la red", texto: "Un asesor valida tu comercio en menos de 48 horas.", para: "Cualquier comercio nuevo" },
          ].map((s) => (
            <div key={s.titulo} className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: C.greenDeep }}>
                <s.icon size={19} style={{ color: C.gold }} />
              </div>
              <p className="font-display text-lg" style={{ color: C.ink }}>{s.titulo}</p>
              <p className="font-body text-sm leading-relaxed flex-1" style={{ color: C.inkSoft }}>{s.texto}</p>
              <span className="font-body text-xs font-semibold px-2.5 py-1 rounded-full inline-block w-fit" style={{ background: "#E6EFE7", color: C.greenDeep }}>Para {s.para}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link to="/registro-comercio"><PrimaryButton>Registra tu comercio</PrimaryButton></Link>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: C.ink }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs" style={{ color: "#8A836F" }}>© {new Date().getFullYear()} Caserito, Bolivia.</p>
          <p className="font-body text-xs" style={{ color: "#8A836F" }}>Plataforma boliviana que rescata excedentes de comida y mercadería.</p>
        </div>
      </div>
    </div>
  );
}
