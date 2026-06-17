// Fuente de verdad de todas las rutas de la API.
// Si el backend cambia un endpoint, solo hay que modificar aqui.

export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  products: {
    list: "/products",
    paginated: "/products/paginated",
    byId: (id: number) => `/products/${id}`,
  },
  orders: {
    create: "/orders",
    myOrders: "/orders/my",
  },
} as const;
