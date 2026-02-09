import { ColorInput } from "@/components/ColorInput";
import { EditorHeader } from "@/components/EditorHeader";
import { EventsEditor } from "@/components/EventsEditor";
import { PsEditor } from "@/components/PsEditor";
import { RichTextEditor } from "@/components/RichTextEditor";
import { SettingsSection } from "@/components/SettingsSection";
import { SocialsEditor } from "@/components/SocialsEditor";
import { TextInput } from "@/components/TextInput";
import type { EmailConfig } from "@/lib/emailTypes";

export interface EditorPanelProps {
  config: EmailConfig;
  onUpdate: (partial: Partial<EmailConfig>) => void;
  preset: "DEFAULT" | "BDE";
  setPreset: (p: "DEFAULT" | "BDE") => void;
}

export function EditorPanel({ config, onUpdate, preset, setPreset }: EditorPanelProps) {
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

      <SettingsSection title="Config" description="Choisis un preset et active/désactive des parties de l'email.">
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <label style={{ color: "#ddd" }}>
            Preset:{" "}
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as "DEFAULT" | "BDE")}
              style={{ marginLeft: 8 }}
            >
              <option value="DEFAULT">DEFAULT_CONFIG</option>
              <option value="BDE">ZZEMAINE_CONFIG</option>
            </select>
          </label>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <label style={{ color: "#ddd", display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={!!config.showSocials}
              onChange={(e) => onUpdate({ showSocials: e.target.checked })}
            />
            Afficher les réseaux sociaux
          </label>

          <label style={{ color: "#ddd", display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={!!config.showPS}
              onChange={(e) => onUpdate({ showPS: e.target.checked })}
            />
            Afficher PS
          </label>

          <label style={{ color: "#ddd", display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={!!config.showEndLogo}
              onChange={(e) => onUpdate({ showEndLogo: e.target.checked })}
            />
            Afficher logo de fin
          </label>
        </div>
      </SettingsSection>

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
          title="Intro"
          description="Texte d'introduction affiché avant le planning (HTML autorisé)."
        >
          <RichTextEditor
            value={config.introHtml || ""}
            onChange={(introHtml: string) => onUpdate({ introHtml })}
          />
        </SettingsSection>

        <SettingsSection
          title="Planning ZZemaine"
          description="Upload une image du planning de la zzemaine (affichée seulement avec le preset BDE)."
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ color: "#ddd", display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={!!config.showZzemaineSection}
                onChange={(e) => onUpdate({ showZzemaineSection: e.target.checked })}
              />
              Afficher la section Planning
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const result = event.target?.result as string;
                    const base64 = result.split(",")[1]; // Remove data:image/...;base64, prefix
                    onUpdate({ zzemainePlanningImage: base64 });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              style={{
                padding: 8,
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.05)",
                color: "#ddd",
                cursor: "pointer",
              }}
            />
            {config.zzemainePlanningImage && (
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                ✓ Image chargée
              </div>
            )}
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
          title="Évènements"
          description="Ajoute des cartes d'événements dans une grille 2 colonnes."
        >
          <EventsEditor
            events={config.events}
            setEvents={(events) => onUpdate({ events })}
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
            specialPsLabel={config.specialPsLabel}
            specialPsText={config.specialPsText}
            specialPsColor={config.specialPsColor}
            setSpecialPs={(partial) =>
              onUpdate({
                specialPsLabel:
                  partial.label !== undefined
                    ? partial.label
                    : config.specialPsLabel,
                specialPsText:
                  partial.text !== undefined
                    ? partial.text
                    : config.specialPsText,
                specialPsColor:
                  partial.color !== undefined
                    ? partial.color
                    : config.specialPsColor,
              })
            }
          />
        </SettingsSection>
      </div>
    </section>
  );
}
