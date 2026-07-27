# Arquitectura de Componentes y Estado

## Filosofia de Diseño

La arquitectura separa claramente el estado del servidor (datos de la API) del estado del cliente (estado local de la aplicacion).

---

## TanStack Query - Estado del Servidor

**Proposito**: Gestionar datos provenientes de la API REST

### Caracteristicas

- Cacheo automatico con tiempo de vida configurable
- Sincronizacion automatica con el servidor
- Manejo de loading, error y success states
- Invalidacion inteligente de caches
- Retry automatico en fallos de red

### Implementacion

```typescript
// Ejemplo: Obtener lista de productos
const { data: products, isLoading, error } = useQuery({
  queryKey: ['products', { page, limit }],
  queryFn: () => productService.getProducts({ page, limit }),
  staleTime: 1000 * 60, // 1 minuto
  gcTime: 1000 * 60 * 10, // 10 minutos en caché
});
```

### Ubicaciones en el Proyecto

- `src/clients/query-client.ts` - Configuracion global
- `src/components/providers/QueryProvider.tsx` - Provider
- `src/hooks/useProducts.ts` - Hooks de queries
- `src/services/productService.ts` - Servicios HTTP

### Datos Manejados

- Listado de productos
- Detalle de producto
- Categorias y marcas
- Historial de pedidos
- Datos del usuario

---

## Jotai - Estado del Cliente

**Proposito**: Gestionar estado local de la aplicacion sin persistencia en servidor

### Caracteristicas

- Atomos primitivos reutilizables
- Reactividad sin re-renders innecesarios
- Sintaxis simple y declarativa
- Performance optimizado
- Integracion sin boilerplate

### Implementacion

```typescript
// Definir atomo del carrito
import { atom } from 'jotai';

export const cartAtom = atom<CartItem[]>([]);
export const cartCountAtom = atom(
  (get) => get(cartAtom).length
);
export const cartTotalAtom = atom(
  (get) => get(cartAtom).reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// Usar en componente
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

export function Cart() {
  const [cart, setCart] = useAtom(cartAtom);
  const total = useAtomValue(cartTotalAtom);
  
  const addItem = (product) => {
    setCart(prev => [...prev, product]);
  };
}
```

### Ubicaciones en el Proyecto

- `src/store/cart.ts` - Atomos del carrito
- `src/components/shared/Navbar.tsx` - Uso de cartCountAtom
- `src/app/carrito/page.tsx` - Manejo completo del carrito

### Datos Manejados

- Items del carrito
- Cantidad total de items
- Total del carrito
- Estado de UI local (modales, filtros activos, etc)

---

## Comparacion: Jotai vs TanStack Query

| Aspecto | TanStack Query | Jotai |
|---------|----------------|-------|
| **Proposito** | Estado del servidor | Estado del cliente |
| **Persistencia** | Cacheado temporal | Sesion del navegador |
| **Sincronizacion** | Automatica con API | Manual con setState |
| **Validacion** | Intrinseca | Usuario define |
| **Performance** | Optimizado para red | Optimizado para UI |
| **Datos Tipicos** | Productos, usuarios, ordenes | Carrito, filtros, UI state |
| **Libreria Ideal** | Datos que cambian en servidor | Datos que controla el cliente |

---

## Flujo de Datos

```
API REST (Backend)
    ↓
Axios (cliente HTTP)
    ↓
TanStack Query (cache servidor)
    ↓
Componentes React
    ↓
Jotai (estado local)
    ↓
DOM
```

### Ejemplo: Agregar producto al carrito

```
1. Usuario ve producto en listado (TanStack Query)
2. Click en "Agregar al carrito"
3. Actualizar carrito en Jotai (estado local)
4. Actualizar UI automaticamente
5. Al checkout, enviar carrito a API
6. Invalidar TanStack Query de pedidos
7. Vaciar carrito en Jotai
```

---

## Patrones de Uso

### Lectura de datos del servidor

```typescript
// Usar TanStack Query
const { data, isLoading } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
});
```

### Escribir en estado local

```typescript
// Usar Jotai
const [filter, setFilter] = useAtom(filterAtom);

// Escribir
setFilter({ category: 'electronics' });

// Leer
const currentFilter = useAtomValue(filterAtom);
```

### Combinar ambos

```typescript
// Leer del servidor, escribir local
const { data: products } = useQuery({
  queryKey: ['products', filter], // filter del atom Jotai
  queryFn: () => fetchProducts(filter),
});
```

---

## Ventajas de esta Arquitectura

### Separacion de Responsabilidades
- TanStack Query: "Que hay en el servidor"
- Jotai: "Que está pasando en mi aplicacion"

### Performance
- No re-renderizar todo cuando cambia el estado del servidor
- Caching automático evita peticiones innecesarias
- Atomos de Jotai = actualizaciones granulares

### Escalabilidad
- Facil agregar nuevas queries
- Facil agregar nuevo estado local
- Patrón consistente en todo el proyecto

### Debugging
- Redux DevTools para Jotai
- React Query DevTools para TanStack Query
- Estado claramente separado

---

## Integracion en el Proyecto

### Provider Setup

```typescript
// src/app/layout.tsx
export default function RootLayout() {
  return (
    <SessionProvider>
      <QueryProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </QueryProvider>
    </SessionProvider>
  );
}
```

### Uso en Componentes

```typescript
// Leer datos del servidor
const { data: products } = useProducts();

// Leer estado local
const cartCount = useAtomValue(cartCountAtom);

// Escribir estado local
const [cart, setCart] = useAtom(cartAtom);
```

---

## Migracion Futura

Si el proyecto crece:

1. **Zustand**: Alternativa a Jotai para estado mas complejo
2. **Redux**: Si se necesita tiempo-travel debugging
3. **Recoil**: Similar a Jotai pero mas maduro

Pero TanStack Query + Jotai es optima para la mayoria de casos.

---

## Justificacion Tecnica

### Por que TanStack Query?

✓ Cacheo automatico
✓ Sincronizacion de fondo
✓ Manejo de errores transparente
✓ Invalidacion inteligente
✓ Comunidad y documentacion excelentes

### Por que Jotai?

✓ Sintaxis simple
✓ Sin boilerplate de Redux
✓ Performance optimizado
✓ Facil de entender
✓ Perfecto para estado local

### Por que NO mezclar?

✗ Complica debugging
✗ Conflictos de sincronizacion
✗ Overhead de features que no usas
✗ Duplicacion de estado

---

## Conclusion

Esta arquitectura permite:
- Manejo consistente de estado
- Performance optimizado
- Codigo mantenible
- Escalabilidad futura

TanStack Query para lo que viene del servidor.
Jotai para lo que controla el cliente.
Simple. Claro. Efectivo.

