import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppStateProvider } from "@/context/app-state-context";

export const metadata: Metadata = {
  title: "Organiza+",
  description: "App personal de organizacion, habitos y control semanal",
  icons: {
    icon: "/favicon-organiza.png",
    shortcut: "/favicon-organiza.png",
    apple: "/foto.png.jpeg",
  },
  appleWebApp: {
    capable: true,
    title: "Organiza+",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
