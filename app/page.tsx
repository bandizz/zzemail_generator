"use client";

import { ColorInput } from "@/components/ColorInput";
import { EmailPreview } from "@/components/EmailPreview";
import { PsEditor } from "@/components/PsEditor";
import { RichTextEditor } from "@/components/RichTextEditor";
import { SettingsSection } from "@/components/SettingsSection";
import { SocialsEditor } from "@/components/SocialsEditor";
import { TextInput } from "@/components/TextInput";
import {
  DEFAULT_CONFIG,
  buildEmailHtml,
  type EmailConfig,
} from "@/lib/emailTemplate";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";

export default function Page() {
  const [config, setConfig] = useState<EmailConfig>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleUpdate = (partial: Partial<EmailConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const handleCopyHtml = async () => {
    try {
      const html = buildEmailHtml(config);
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    const html = buildEmailHtml(config);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email_generated.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 1600);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        padding: "20px 12px",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1.2fr)",
          gap: 18,
        }}
      >
        <section
          style={{
            borderRadius: 18,
            padding: 18,
            background:
              "linear-gradient(135deg, rgba(8,8,20,0.96), rgba(25,6,30,0.97))",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow:
              "0 18px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02)",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  opacity: 0.7,
                }}
              >
                Bandizz
              </div>
              <h1
                style={{
                  margin: "4px 0 2px",
                  fontSize: 20,
                  letterSpacing: 0.4,
                }}
              >
                Générateur d’email ZZ hyper custom
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  opacity: 0.8,
                  maxWidth: 420,
                }}
              >
                Remplis les champs, ajuste les couleurs et les P$, puis copie /
                télécharge le HTML en un clic.
              </p>
            </div>
          </header>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <SettingsSection
              title="Header"
              description="Titre, logos principaux et couleurs de la bannière."
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                <TextInput
                  label="Titre principal"
                  value={config.title}
                  onChange={(v) => handleUpdate({ title: v })}
                />
                <TextInput
                  label="Signature"
                  value={config.signature}
                  onChange={(v) => handleUpdate({ signature: v })}
                />
                <TextInput
                  label="Logo du haut (URL)"
                  value={config.firstLogo}
                  onChange={(v) => handleUpdate({ firstLogo: v })}
                />
                <TextInput
                  label="Logo du bas (URL)"
                  value={config.endLogo}
                  onChange={(v) => handleUpdate({ endLogo: v })}
                />
                <ColorInput
                  label="Couleur de fond du header"
                  value={config.headerBgColor}
                  onChange={(v) => handleUpdate({ headerBgColor: v })}
                />
                <ColorInput
                  label="Couleur du séparateur"
                  value={config.dividerColor}
                  onChange={(v) => handleUpdate({ dividerColor: v })}
                />
              </div>
            </SettingsSection>

            <SettingsSection
              title="Corps"
              description="Texte principal de l'email (éditeur riche : texte, listes, images, etc.)."
            >
              <RichTextEditor
                value={config.bodyHtml}
                onChange={(bodyHtml: string) => handleUpdate({ bodyHtml })}
              />
            </SettingsSection>

            <SettingsSection
              title="Réseaux sociaux"
              description="Choisis les réseaux à afficher, les liens sont cliquables et les logos sont fournis automatiquement en blanc."
            >
              <SocialsEditor
                socials={config.socials}
                setSocials={(socials) => handleUpdate({ socials })}
              />
            </SettingsSection>

            <SettingsSection
              title="PS"
              description="Liste de P$ avec P$ spécial #4."
            >
              <PsEditor
                psRaw={config.psRaw}
                setPsRaw={(psRaw) => handleUpdate({ psRaw })}
              />
            </SettingsSection>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 6,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={handleCopyHtml}
                style={{
                  borderRadius: 999,
                  border: "none",
                  padding: "7px 16px",
                  fontSize: 13,
                  cursor: "pointer",
                  background:
                    "linear-gradient(135deg, #ff4dad, #ffc400, #ff4dad)",
                  backgroundSize: "180% 180%",
                  color: "#111",
                  fontWeight: 700,
                  boxShadow:
                    "0 0 0 1px rgba(0,0,0,0.3), 0 14px 30px rgba(0,0,0,0.6)",
                }}
              >
                {copied ? "Copié ✅" : "Copier le HTML"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.25)",
                  padding: "7px 16px",
                  fontSize: 13,
                  cursor: "pointer",
                  background: "rgba(5,5,15,0.9)",
                  color: "white",
                  fontWeight: 500,
                }}
              >
                {downloaded ? "Téléchargé ✅" : "Télécharger .html"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setConfig(DEFAULT_CONFIG)}
              style={{
                borderRadius: 999,
                border: "none",
                padding: "6px 12px",
                fontSize: 12,
                cursor: "pointer",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Reset paramètres
            </button>
          </div>
        </section>

        <section>
          <EmailPreview config={config} />
        </section>
      </div>
    </main>
  );
}
