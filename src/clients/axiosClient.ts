import axios, { AxiosInstance } from "axios";
import env from "@/env";

const axiosClient: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  timeout: env.NEXT_PUBLIC_API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

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
