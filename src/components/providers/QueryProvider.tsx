"use client";

import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/clients/query-client";

interface QueryProviderProps {
  children: ReactNode;
}

let clientQueryClient: ReturnType<typeof createQueryClient> | undefined;

const getQueryClient = () => {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  if (!clientQueryClient) {
    clientQueryClient = createQueryClient();
  }
  return clientQueryClient;
};

export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
