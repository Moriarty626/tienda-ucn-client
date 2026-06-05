import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

// Configuración de la fuente Montserrat
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "TiendaUCN",
  description: "Plataforma de compras",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="es">
      <body className={`${montserrat.variable} font-sans antialiased min-h-screen flex flex-col`}>
      <Navbar />
      {/* El main ocupará todo el espacio disponible, empujando el footer hacia abajo */}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      </body>
      </html>
  );
}
