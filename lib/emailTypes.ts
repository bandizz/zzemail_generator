import { LOGO_ALT_BASE64, LOGO_BASE64 } from "./logos";

export interface PsItem {
  /**
   * Préfixe affiché avant l'index (ex: "P$", "QT", "EV"...).
   * - undefined  → on utilisera "P$" par défaut dans le rendu
   * - "" (vide)  → aucun préfixe n'est affiché (juste le numéro)
   */
  label?: string;
  text: string;
  color: string;
}

export interface PsWithId extends PsItem {
  id: number;
}

export type SocialProvider =
  | "discord"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "twitter"
  | "facebook"
  | "linkedin"
  | "snapchat"
  | "whatsapp"
  | "twitch"
  | "github"
  | "website";

export interface SocialItem {
  provider: SocialProvider;
  url: string;
}

export interface EmailConfig {
  /**
   * Contenu base64 (sans préfixe data:) du logo du haut.
   */
  firstLogo: string;
  /**
   * Contenu base64 (sans préfixe data:) du logo du bas.
   */
  endLogo: string;
  title: string;
  bodyHtml: string;
  signature: string;
  headerBgColor: string;
  dividerColor: string;
  /**
   * Préfixe spécifique pour le P$ spécial (P$4).
   * Même logique que PsItem.label (undefined → "P$", "" → pas de préfixe).
   */
  specialPsLabel: string;
  specialPsText: string;
  specialPsColor: string;
  psRaw: PsItem[];
  socials: SocialItem[];
}

export const SPECIAL_PS_TEXT = "Parce que 4 < 4";

// Valeurs par défaut : contenu base64 embarqué via les fichiers dans `assets/`.
const DEFAULT_FIRST_LOGO = LOGO_BASE64;
const DEFAULT_END_LOGO = LOGO_ALT_BASE64;

export const DEFAULT_CONFIG: EmailConfig = {
  firstLogo: DEFAULT_FIRST_LOGO,
  endLogo: DEFAULT_END_LOGO,
  title: "",
  bodyHtml: "",
  signature: "C'était vos ReZZpo Comm de la liste BandiZZ 🔫",
  headerBgColor: "#FF4DAD",
  dividerColor: "#fefefe",
  specialPsLabel: "P$",
  specialPsText: SPECIAL_PS_TEXT,
  specialPsColor: "black",
  // 3 P$ minimum obligatoires, vides au départ mais à remplir
  psRaw: [
    { label: "P$", text: "", color: "black" },
    { label: "P$", text: "", color: "black" },
    { label: "P$", text: "", color: "black" },
  ],
  socials: [
    {
      provider: "discord",
      url: "https://discord.gg/xVFzMuhtZ4",
    },
    {
      provider: "instagram",
      url: "https://www.instagram.com/liste_BandiZZ",
    },
    {
      provider: "youtube",
      url: "https://www.youtube.com/@TheBandiZZ",
    },
  ],
};
