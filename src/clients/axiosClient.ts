import axios, { AxiosInstance } from "axios";
import env from "@/env";

const axiosClient: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  timeout: env.NEXT_PUBLIC_API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor de peticiones: agrega el token JWT de sesion a todas las peticiones
 * El token se obtiene de la sesion de NextAuth
 */
axiosClient.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const { getSession } = await import("next-auth/react");
    const session = await getSession();
    if (session?.backendToken) {
      config.headers.Authorization = `Bearer ${session.backendToken}`;
    }
  }
  return config;
});

/**
 * Interceptor de respuestas: maneja errores globales
 * - 500+: Errores del servidor
 * - Errores de red: CORS, backend caido, timeout
 * - 401: No autorizado (token expirado o invalido)
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "(sin url)";
    const requestMethod = (error.config?.method || "GET").toUpperCase();

    if (error.response) {
      if (error.response.status >= 500) {
        console.error(
          `Error en respuesta ${requestMethod} ${requestUrl}:`,
          error.response.status,
          error.response.data
        );
      }

      // Manejar errores 401: token expirado o invalido
      if (error.response.status === 401) {
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/login") &&
          !window.location.pathname.startsWith("/register")
        ) {
          console.warn(
            `Token invalido o expirado en ${requestMethod} ${requestUrl}. Redirigiendo a inicio de sesion.`
          );
          import("next-auth/react").then(({ signOut }) => {
            signOut({ callbackUrl: "/login" });
          });
        }
      }
    } else if (error.request) {
      console.error(
        `Error de red en ${requestMethod} ${requestUrl}. Posible CORS, backend caido o timeout.`,
        {
          code: error.code,
          message: error.message,
        }
      );
    } else {
      console.error(`Error al preparar ${requestMethod} ${requestUrl}:`, error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
