import { Cookie, UtensilsCrossed, Coffee, ShoppingBasket, Wrench, ShoppingBag, Package } from "lucide-react";

export const C = {
  cream: "#FBF3E4",
  paper: "#FFFFFF",
  ink: "#242217",
  inkSoft: "#655D4B",
  line: "#E8DCC2",
  orange: "#C15A2E",
  orangeDeep: "#9C4322",
  green: "#33684A",
  greenDeep: "#20452F",
  gold: "#E3A63B",
  pink: "#AD3B63",
  sky: "#3C7C8C",
};

export const CATEGORIAS = ["Panadería", "Restaurante", "Cafetería", "Supermercado", "Ferretería", "Tienda", "Otro"];

export const CATEGORY_META = {
  "Panadería": { color: C.orange, icon: Cookie, perecedero: true },
  "Restaurante": { color: C.orange, icon: UtensilsCrossed, perecedero: true },
  "Cafetería": { color: C.orange, icon: Coffee, perecedero: true },
  "Supermercado": { color: C.orange, icon: ShoppingBasket, perecedero: true },
  "Ferretería": { color: C.sky, icon: Wrench, perecedero: false },
  "Tienda": { color: C.pink, icon: ShoppingBag, perecedero: false },
};
const defaultMeta = { color: C.inkSoft, icon: Package, perecedero: true };
export const getCategoryMeta = (categoria) => CATEGORY_META[categoria] || defaultMeta;
