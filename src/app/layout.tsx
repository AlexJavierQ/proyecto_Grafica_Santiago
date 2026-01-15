import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gráfica Santiago | Papelería, Oficina y Escolar",
  description: "Tu tienda de confianza para productos de papelería, suministros de oficina y material escolar. Los mejores precios y calidad garantizada.",
  keywords: ["papelería", "oficina", "escolar", "suministros", "Quito", "Ecuador"],
  authors: [{ name: "Gráfica Santiago" }],
  openGraph: {
    title: "Gráfica Santiago | Papelería, Oficina y Escolar",
    description: "Tu tienda de confianza para productos de papelería, suministros de oficina y material escolar.",
    type: "website",
    locale: "es_EC",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
