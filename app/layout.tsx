import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prints Lab OS",
  description: "Sistema interno de Prints Lab Panamá",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-paper text-ink font-sans">{children}</body>
    </html>
  );
}
