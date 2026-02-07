import { LOGO_BANDIZZ_BASE64, LOGO_BANDIZZ_ALT_BASE64, LOGO_BDE_BASE64, LOGO_BDE_SIMPLIFIED_BASE64 } from "./logos";

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

export interface EventItem {
  eventImage: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
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
  /** Show the special PS section (P$ special #4) */
  showSpecialPs?: boolean;
  /** Show the socials block at the bottom */
  showSocials?: boolean;
  /** Show the end logo / signature block */
  showEndLogo?: boolean;
  /** Base64 image for the ZZemaine section */
  zzemainePlanningImage?: string;
  /** Show the ZZemaine planning section */
  showZzemaineSection?: boolean;
  /** HTML content for an intro section shown before the planning block */
  introHtml?: string;
  events: EventItem[];
  psRaw: PsItem[];
  socials: SocialItem[];
}

export const SPECIAL_PS_TEXT = "Parce que 4 < 4";

const now = new Date();

const options: Intl.DateTimeFormatOptions = { 
  day: 'numeric', 
  month: 'long', 
  year: 'numeric' 
};

const formatedDate = new Intl.DateTimeFormat('fr-FR', options).format(now);

export const DEFAULT_CONFIG: EmailConfig = {
  firstLogo: LOGO_BANDIZZ_BASE64,
  endLogo: LOGO_BANDIZZ_ALT_BASE64,
  title: "",
  bodyHtml: "",
  signature: "C'était Samuel, votre ReZZpo Comm.",
  headerBgColor: "#FF4DAD",
  dividerColor: "#fefefe",
  specialPsLabel: "P$",
  specialPsText: SPECIAL_PS_TEXT,
  specialPsColor: "black",
  showSpecialPs: true,
  showSocials: true,
  showEndLogo: true,
  zzemainePlanningImage: "",
  showZzemaineSection: false,
  introHtml: "",
  events: [],
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

export const BDE_CONFIG: EmailConfig = {
  ...DEFAULT_CONFIG,
  firstLogo: LOGO_BDE_BASE64,
  endLogo: LOGO_BDE_SIMPLIFIED_BASE64,
  title: "MAIL DE LA ZZEMAINE - " + formatedDate,
  showSocials: true,
  showSpecialPs: true,
  showZzemaineSection: true,
  events: [],
  socials: [
    {
      provider: "discord",
      url: "https://discord.gg/FwfCph8298",
    },
    {
      provider: "instagram",
      url: "https://www.instagram.com/bde.isima/",
    },
    {
      provider: "website",
      url: "https://bde.zzs.fr/",
    }
  ]
};