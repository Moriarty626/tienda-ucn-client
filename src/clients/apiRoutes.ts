// Fuente de verdad de todas las rutas de la API.
// Si el backend cambia un endpoint, solo hay que modificar aqui.

export const API_ROUTES = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    emailVerification: "/api/auth/email-verification",
  },
  products: {
    list: "/api/product",
    paginated: "/api/product",
    byId: (id: number) => `/api/product/${id}`,
  },
  orders: {
    create: "/api/order",
    myOrders: "/api/order/history",
  },
} as const;
