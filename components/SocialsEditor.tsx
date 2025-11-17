import type {
  EmailConfig,
  SocialItem,
  SocialProvider,
} from "@/lib/emailTemplate";
import type { ChangeEvent } from "react";

const PROVIDER_OPTIONS: { value: SocialProvider; label: string }[] = [
  { value: "discord", label: "Discord" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "X / Twitter" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "snapchat", label: "Snapchat" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "twitch", label: "Twitch" },
  { value: "github", label: "GitHub" },
  { value: "website", label: "Site web" },
];

export interface SocialsEditorProps {
  socials: EmailConfig["socials"];
  setSocials: (items: SocialItem[]) => void;
}

export function SocialsEditor({ socials, setSocials }: SocialsEditorProps) {
  const handleChange = (
    index: number,
    field: keyof SocialItem,
    value: string
  ) => {
    const next = socials.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setSocials(next);
  };

  const handleAdd = () => {
    setSocials([
      ...socials,
      {
        provider: "instagram",
        url: "",
      },
    ]);
  };

  const handleRemove = (index: number) => {
    const next = socials.filter((_, i) => i !== index);
    setSocials(next);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13 }}>
          Choisis les réseaux à afficher et leurs liens.
        </span>
        <button
          type="button"
          onClick={handleAdd}
          style={{
            borderRadius: 999,
            border: "none",
            padding: "4px 10px",
            fontSize: 12,
            cursor: "pointer",
            background: "linear-gradient(135deg, #ff4dad,rgb(251, 56, 160))",
            color: "#fefefe",
            fontWeight: 600,
          }}
        >
          + Ajouter un réseau
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {socials.map((social, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(120px, 0.7fr) minmax(0, 1.6fr) auto",
              gap: 8,
              alignItems: "center",
            }}
          >
            <select
              value={social.provider}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleChange(
                  index,
                  "provider",
                  e.target.value as SocialProvider
                )
              }
              style={{
                padding: "5px 8px",
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(10,10,20,0.9)",
                color: "white",
                fontSize: 12,
              }}
            >
              {PROVIDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              value={social.url}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(index, "url", e.target.value)
              }
              placeholder={`Lien complet vers la page ${social.provider}`}
              style={{
                padding: "5px 8px",
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(10,10,20,0.9)",
                color: "white",
                fontSize: 12,
              }}
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              style={{
                borderRadius: 999,
                border: "none",
                padding: "2px 8px",
                fontSize: 11,
                cursor: "pointer",
                background: "rgba(255,255,255,0.04)",
                color: "#f66",
              }}
            >
              Suppr
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
