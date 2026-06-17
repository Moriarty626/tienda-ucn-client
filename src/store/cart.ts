import { atom } from "jotai";

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  precioFormateado: string;
  cantidad: number;
  imagenUrl?: string;
}

export const cartItemsAtom = atom<CartItem[]>([]);

export const cartTotalAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, item) => sum + item.precio * item.cantidad, 0)
);

export const cartCountAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, item) => sum + item.cantidad, 0)
);
