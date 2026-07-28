"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { productService } from "@/services/productService";
import { adminService } from "@/services/adminService";
import { Producto } from "@/domain/Producto";
import { Button } from "@/components/ui/button";

const ProductSchema = z.object({
  nombre: z.string().min(3, "Mínimo 3 caracteres").max(100, "Máximo 100 caracteres"),
  descripcion: z.string().min(10, "Mínimo 10 caracteres").max(1000, "Máximo 1000 caracteres"),
  categoria: z.enum(["Electronica", "Ropa", "Hogar", "Juguetes", "Libros"], {
    message: "Categoria invalida",
  }),
  marca: z.string().min(3, "Mínimo 3 caracteres").max(100, "Máximo 100 caracteres"),
  precio: z.coerce.number().int().positive("El precio debe ser mayor a 0"),
  stock: z.coerce.number().int().positive("El stock debe ser mayor a 0"),
});

type ProductFormData = z.infer<typeof ProductSchema>;

function ProductForm({
  initial,
  onSubmit,
  onCancel,
  isPending,
}: {
  initial?: Producto | null;
  onSubmit: (data: ProductFormData, imagen?: File) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(
    initial?.imagenUrl ?? null
  );
  const [file, setFile] = useState<File | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema) as never,
    defaultValues: {
      nombre: initial?.nombre ?? "",
      descripcion: initial?.descripcion ?? "",
      categoria:
        (initial?.categoria as
          | "Electronica"
          | "Ropa"
          | "Hogar"
          | "Juguetes"
          | "Libros") ?? "Electronica",
      marca: initial?.marca ?? "",
      precio: initial?.precio ?? 0,
      stock: initial?.stock ?? 1,
    },
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, file))}
      className="bg-white border border-slate-200 rounded-lg p-6 mb-6 space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900">
          {initial ? "Editar Producto" : "Nuevo Producto"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
          <input
            {...register("nombre")}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          />
          {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
          <select
            {...register("marca")}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          >
            <option value="">Seleccionar marca</option>
            <option value="Apple">Apple</option>
            <option value="Nike">Nike</option>
            <option value="Samsung">Samsung</option>
            <option value="Adidas">Adidas</option>
            <option value="Sony">Sony</option>
          </select>
          {errors.marca && <p className="mt-1 text-xs text-red-600">{errors.marca.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Descripcion</label>
          <textarea
            {...register("descripcion")}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          />
          {errors.descripcion && <p className="mt-1 text-xs text-red-600">{errors.descripcion.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
          <select
            {...register("categoria")}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          >
            <option value="Electronica">Electronica</option>
            <option value="Ropa">Ropa</option>
            <option value="Hogar">Hogar</option>
            <option value="Juguetes">Juguetes</option>
            <option value="Libros">Libros</option>
          </select>
          {errors.categoria && <p className="mt-1 text-xs text-red-600">{errors.categoria.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Precio</label>
          <input
            type="number"
            {...register("precio")}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
            min="1"
          />
          {errors.precio && <p className="mt-1 text-xs text-red-600">{errors.precio.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
          <input
            type="number"
            {...register("stock")}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
            min="1"
          />
          {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Imagen</label>
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleFile}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isPending}
          />
          {preview && (
            <div className="mt-2 relative w-24 h-24 rounded-md overflow-hidden border border-slate-200">
              <Image src={preview} alt="Vista previa" fill className="object-cover" unoptimized />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isPending ? "Guardando..." : "Guardar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-slate-200 rounded animate-pulse" />
      ))}
    </div>
  );
}

function AdminContent() {
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [editing, setEditing] = useState<Producto | null | undefined>(
    undefined
  );

  const { data: productos, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getProducts,
  });

  useEffect(() => {
    if (editId && productos && productos.length > 0) {
      const targetId = Number(editId);
      const found = productos.find((p) => p.id === targetId);
      if (found) {
        setEditing(found);
      }
    }
  }, [editId, productos]);

  const createMutation = useMutation({
    mutationFn: (vars: { data: ProductFormData; imagen?: File }) =>
      adminService.createProducto({ ...vars.data, imagen: vars.imagen }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto creado correctamente");
      setEditing(undefined);
    },
    onError: (error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      const responseData = (error as {
        response?: {
          data?: {
            detail?: string;
            message?: string;
            title?: string;
          };
        };
      })?.response?.data;

      const msg =
        status === 401
          ? "Tu sesion ha expirado o no tienes permisos. Inicia sesion nuevamente."
          : responseData?.detail ||
            responseData?.message ||
            responseData?.title ||
            "Error al crear el producto";
      toast.error(msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; data: ProductFormData; imagen?: File }) =>
      adminService.updateProducto(vars.id, { ...vars.data, imagen: vars.imagen }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto actualizado correctamente");
      setEditing(undefined);
    },
    onError: (error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      const responseData = (error as {
        response?: {
          data?: {
            detail?: string;
            message?: string;
            title?: string;
          };
        };
      })?.response?.data;

      const msg =
        status === 401
          ? "Tu sesion ha expirado o no tienes permisos. Inicia sesion nuevamente."
          : responseData?.detail ||
            responseData?.message ||
            responseData?.title ||
            "Error al actualizar el producto";
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteProducto(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto eliminado");
    },
    onError: () => toast.error("Error al eliminar el producto"),
  });

  const handleSubmit = (data: ProductFormData, imagen?: File) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data, imagen });
    } else {
      createMutation.mutate({ data, imagen });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Panel de Administracion
        </h1>
        {editing === undefined && (
          <Button
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            onClick={() => setEditing(null)}
          >
            <Plus size={16} />
            Nuevo producto
          </Button>
        )}
      </div>

      {editing !== undefined && (
        <ProductForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(undefined)}
          isPending={isPending}
        />
      )}

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">
                  Producto
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">
                  Categoria
                </th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700">
                  Precio
                </th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700">
                  Stock
                </th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productos?.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {p.nombre}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.categoria}</td>
                  <td className="px-4 py-3 text-right text-slate-900">
                    {p.precioFormateado}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {p.stock <= 0 ? (
                      <span className="text-red-600 font-semibold">Sin stock</span>
                    ) : (
                      p.stock
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditing(p)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(p.id)}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!productos || productos.length === 0) && (
            <p className="text-center text-slate-500 py-8">
              No hay productos registrados.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <AdminContent />
    </Suspense>
  );
}
