import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartDrive - Gestor de Archivos en la Nube",
  description: "Plataforma profesional para gestionar, organizar y compartir archivos en la nube. Una creación de DoValeLabs.",
  keywords: ["gestor de archivos", "almacenamiento en la nube", "DoValeLabs", "SmartDrive"],
  authors: [{ name: "DoValeLabs" }],
  creator: "DoValeLabs",
  publisher: "DoValeLabs",
  robots: "index, follow",
  openGraph: {
    title: "SmartDrive - Gestor de Archivos en la Nube",
    description: "Plataforma profesional para gestionar, organizar y compartir archivos en la nube.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartDrive - Gestor de Archivos en la Nube",
    description: "Plataforma profesional para gestionar, organizar y compartir archivos en la nube.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900`}>
        <div className="min-h-screen">
          {children}
        </div>
        <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-gray-600">
              <strong>Una creación de DoValeLabs</strong>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

