import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Bandizz Email Generator",
  description: "Générateur d'emails hyper custom pour les ZZs",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "'Segoe UI','Lucida Sans',system-ui,sans-serif",
          background: "#333",
          minHeight: "100vh",
          color: "#f5f5f5",
        }}
      >
        {children}
      </body>
    </html>
  );
}
