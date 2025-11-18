import { LOGO_ALT_BASE64, LOGO_BASE64 } from "./logos";

export interface PsItem {
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
  signature: "C'était vos ReZZpo Comm de la liste Bandizz 🔫",
  headerBgColor: "#FF4DAD",
  dividerColor: "#fefefe",
  specialPsText: SPECIAL_PS_TEXT,
  specialPsColor: "black",
  // 3 P$ minimum obligatoires, vides au départ mais à remplir
  psRaw: [
    { text: "", color: "black" },
    { text: "", color: "black" },
    { text: "", color: "black" },
  ],
  socials: [
    {
      provider: "discord",
      url: "https://discord.gg/xVFzMuhtZ4",
    },
    {
      provider: "instagram",
      url: "https://www.instagram.com/liste_bandizz",
    },
    {
      provider: "youtube",
      url: "https://www.youtube.com/@TheBandizz",
    },
  ],
};


