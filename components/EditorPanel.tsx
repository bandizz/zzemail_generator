import { ColorInput } from "@/components/ColorInput";
import { EditorHeader } from "@/components/EditorHeader";
import { PsEditor } from "@/components/PsEditor";
import { RichTextEditor } from "@/components/RichTextEditor";
import { SettingsSection } from "@/components/SettingsSection";
import { SocialsEditor } from "@/components/SocialsEditor";
import { TextInput } from "@/components/TextInput";
import type { EmailConfig } from "@/lib/emailTemplate";

export interface EditorPanelProps {
  config: EmailConfig;
  onUpdate: (partial: Partial<EmailConfig>) => void;
}

export function EditorPanel({ config, onUpdate }: EditorPanelProps) {
  return (
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
      <EditorHeader />

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
              onChange={(v) => onUpdate({ title: v })}
            />
            <TextInput
              label="Signature"
              value={config.signature}
              onChange={(v) => onUpdate({ signature: v })}
            />
            <TextInput
              label="Logo du haut (image base64)"
              value={config.firstLogo}
              onChange={(v) => onUpdate({ firstLogo: v })}
            />
            <TextInput
              label="Logo du bas (image base64)"
              value={config.endLogo}
              onChange={(v) => onUpdate({ endLogo: v })}
            />
            <ColorInput
              label="Couleur de fond du header"
              value={config.headerBgColor}
              onChange={(v) => onUpdate({ headerBgColor: v })}
            />
            <ColorInput
              label="Couleur du séparateur"
              value={config.dividerColor}
              onChange={(v) => onUpdate({ dividerColor: v })}
            />
          </div>
        </SettingsSection>

        <SettingsSection
          title="Corps"
          description='Texte principal du mail. Mots clés disponibles : [SEPARATOR] et [CARD color="#000"] ... [/CARD].'
        >
          <RichTextEditor
            value={config.bodyHtml}
            onChange={(bodyHtml: string) => onUpdate({ bodyHtml })}
          />
        </SettingsSection>

        <SettingsSection
          title="Réseaux sociaux"
          description="Choisis les réseaux à afficher, les liens sont cliquables et les logos sont fournis automatiquement en blanc."
        >
          <SocialsEditor
            socials={config.socials}
            setSocials={(socials) => onUpdate({ socials })}
          />
        </SettingsSection>

        <SettingsSection
          title="PS"
          description="Liste de P$ avec P$ spécial #4."
        >
          <PsEditor
            psRaw={config.psRaw}
            setPsRaw={(psRaw) => onUpdate({ psRaw })}
          />
        </SettingsSection>
      </div>
    </section>
  );
}
