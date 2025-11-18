import {
  buildEmailHtmlWithEmojis,
  type EmailConfig,
} from "@/lib/emailTemplate";
import { useEffect, useState } from "react";

export interface EmailPreviewProps {
  config: EmailConfig;
}

export function EmailPreview({ config }: EmailPreviewProps) {
  // On utilise le même pipeline que pour la copie / le téléchargement
  // (buildEmailHtmlWithEmojis) pour avoir exactement le même rendu.
  const [html, setHtml] = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const rendered = await buildEmailHtmlWithEmojis(config);
      if (!cancelled) {
        setHtml(rendered);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [config]);

  return (
    <div
      style={{
        background: "#0b0b12",
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.1)",
        padding: 16,
        height: "100%",
        boxShadow:
          "0 18px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.02)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: 2,
              opacity: 0.7,
            }}
          >
            Prévisualisation
          </div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>
            Rendu HTML prêt à être collé dans ton outil d&apos;emails
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "#111319",
          padding: 16,
        }}
      >
        <div
          style={{ background: "white", padding: 12 }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
