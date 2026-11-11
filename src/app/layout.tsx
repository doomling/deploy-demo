import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deploy demo",
  description: "App de ejemplo para la clase de deploy y CI/CD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
