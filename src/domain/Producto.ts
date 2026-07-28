export interface Resena {
  id: string;
  autor: string;
  calificacion: number; // Por ejemplo: de 1 a 5 estrellas
  comentario: string;
  fecha: Date;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  marca?: string;
  // Restringimos las categorías solo a las que manejas
  categoria: "Electronica" | "Ropa" | "Hogar" | "Juguetes" | "Libros";
  precio: number;
  precioFormateado: string;
  stock: number;
  imagenUrl?: string;
  resenas?: Resena[];
}
