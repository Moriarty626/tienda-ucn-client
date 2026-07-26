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
    try {
      const { getSession } = await import("next-auth/react");
      const session = await getSession();
      if (session?.backendToken) {
        config.headers.Authorization = `Bearer ${session.backendToken}`;
      }
    } catch {
      // Ignorar si falla la verificación de sesión
    }
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        "Error en respuesta:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("Error en solicitud:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
