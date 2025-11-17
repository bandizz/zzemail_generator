import { LOGO_ALT_BASE64, LOGO_BASE64 } from "./logos";
import { SOCIAL_LOGOS_BASE64 } from "./socialLogos";

// Cache en mémoire pour éviter de refetch les mêmes emojis.
const EMOJI_BASE64_CACHE = new Map<string, string>();

export interface PsItem {
  text: string;
  color: string;
}

export interface PsWithId extends PsItem {
  id: number;
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

function getSocialIconSlug(provider: SocialProvider): string {
  switch (provider) {
    case "discord":
      return "discord";
    case "instagram":
      return "instagram";
    case "youtube":
      return "youtube";
    case "tiktok":
      return "tiktok";
    case "twitter":
      return "x"; // Simple Icons slug for X (Twitter)
    case "facebook":
      return "facebook";
    case "linkedin":
      return "linkedin";
    case "snapchat":
      return "snapchat";
    case "whatsapp":
      return "whatsapp";
    case "twitch":
      return "twitch";
    case "github":
      return "github";
    case "website":
    default:
      return "globe";
  }
}

export function getSocialIconSrc(provider: SocialProvider): string {
  const base64 = SOCIAL_LOGOS_BASE64[provider];
  if (base64 && base64.length > 0) {
    // Icône inline en PNG base64 (64x64).
    return `data:image/png;base64,${base64}`;
  }

  // Fallback : ancienne URL (SVG) vers le CDN Simple Icons
  const slug = getSocialIconSlug(provider);
  return `https://cdn.simpleicons.org/${slug}/ffffff`;
}

export function escapeHtml(str: string | null | undefined): string {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildPsList(psRaw: PsItem[] | undefined): PsWithId[] {
  const result: PsWithId[] = [];
  const list = Array.isArray(psRaw) ? psRaw : [];

  // P$1-3 : issus des 3 premiers éléments de psRaw
  list.slice(0, 3).forEach((ps, index) => {
    result.push({
      id: index + 1,
      text: ps?.text ?? "",
      color: ps?.color || "black",
    });
  });

  // P$4 : traditionnel et non modifiable
  if (list.length >= 3) {
    result.push({
      id: 4,
      text: SPECIAL_PS_TEXT,
      color: "black",
    });
  }

  // P$ suivants (P$5, P$6, ...) : à partir de psRaw[3]
  list.slice(3).forEach((ps, index) => {
    result.push({
      id: 5 + index,
      text: ps?.text ?? "",
      color: ps?.color || "black",
    });
  });

  return result;
}

export function validatePsRaw(psRaw: PsItem[] | undefined): boolean {
  const count = Array.isArray(psRaw) ? psRaw.length : 0;
  // Il faut au moins 3 P$ non vides et respecter la règle :
  // nombre total de P$ (avec le P$4) multiple de 4 → (count + 1) % 4 === 0
  if (!Array.isArray(psRaw) || count < 3) {
    return false;
  }

  const firstThreeValid = psRaw
    .slice(0, 3)
    .every(
      (ps) => ps && typeof ps.text === "string" && ps.text.trim().length > 0
    );

  if (!firstThreeValid) {
    return false;
  }

  return (count + 1) % 4 === 0;
}

export function buildEmailHtml(config?: Partial<EmailConfig>): string {
  const {
    firstLogo,
    endLogo,
    title,
    bodyHtml,
    signature,
    headerBgColor,
    dividerColor,
    psRaw,
  } = { ...DEFAULT_CONFIG, ...(config || {}) };

  const psList = buildPsList(psRaw);
  const socials: SocialItem[] =
    (config && Array.isArray(config.socials) && config.socials.length
      ? config.socials
      : DEFAULT_CONFIG.socials) ?? [];

  const safeTitle = escapeHtml(title);
  const safeSignature = escapeHtml(signature);
  const safeHeaderBgColor = headerBgColor || "#FF4DAD";
  const safeDividerColor = dividerColor || "#fefefe";

  const socialHtml = socials
    .map((social) => {
      const href = escapeHtml(social.url);
      const iconSrc = escapeHtml(getSocialIconSrc(social.provider));
      const alt = escapeHtml(
        social.provider.charAt(0).toUpperCase() + social.provider.slice(1)
      );
      return `
                                    <span class="Object" role="link">
                                      <a style="color: white;" href="${href}" target="_blank">
                                        <img alt="${alt}" style="height: 50px;" src="${iconSrc}">
                                      </a>
                                    </span>`;
    })
    .join("\n");

  const psHtml = psList
    .map(
      (ps) => `
                  <p style="color: ${escapeHtml(
                    ps.color
                  )}; font-size: 16px; line-height: 1.4;">
                    <strong>P$ ${ps.id}</strong> : ${escapeHtml(ps.text)}
                  </p>`
    )
    .join("\n");

  return `
<style>
  .zzemail-root-table {
    margin: auto;
    max-width: 600px;
    width: 100%;
    border-collapse: collapse;
    font-family: 'Segoe UI','Lucida Sans',sans-serif;
  }

  .zzemail-root-table img {
    max-width: 95%;
    height: auto;
  }
</style>
<table class="zzemail-root-table" style="margin: auto; max-width: 600px; width: 100%; border-collapse: collapse; font-family: 'Segoe UI','Lucida Sans',sans-serif">
  <tbody>
    <tr>
      <td style="padding: 0px;">
        <table style="border: 1px solid rgb(194, 196, 214); background-color: rgb(252, 252, 253); border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="
                  background-color: ${safeHeaderBgColor};
                  background-position: center; /* centre le motif */
                  padding: 20px; 
                  color: #fff;
                  text-align: center;">
                <img alt="Logo BandiZZ" style="width: auto; max-height: 200px; display: block; margin: 0px auto;" src="data:image/png;base64,${escapeHtml(
                  firstLogo
                )}">
                <div style="width: 60px; height: 4px; background-color: ${safeDividerColor}; margin: 15px auto;"></div>
                  <span style="
                    display: inline-block;
                    background-color: white;
                    padding: 5px 5px;
                    border-radius: 5px;
                    color: black;
                    font-size: 16px;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    font-weight: bold;">
                    ${safeTitle}
                  </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 3mm; color: #333">
                <p style="font-size: 20px; line-height: 1;">
                  ${bodyHtml || ""}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 3mm; text-align:center;">
                <img alt="BandiZZ Logo" style="width: auto; max-height: 100px; display: block; margin: 0px auto;" src="data:image/png;base64,${escapeHtml(
                  endLogo
                )}">
                <p style="margin-top: 0; color: #333;">${safeSignature}</p>
              </td>
            </tr>
            <tr style="background: ${safeHeaderBgColor}; color: white;">
                  <td style="padding: 3mm;">
                    <table style="width: 100%;">
                      <tbody>
                        <tr style="background: ${safeHeaderBgColor}; color: white;">
                          <td style="padding: 3mm;">
                            <table style="width: 100%;">
                              <tbody>
                                <tr>
                                  <td>
                                    <h2 style="margin: 0px; color: white;">Suivez
                                      les BandiZZ sur :</h2>
                                  </td>
                                  <td style="display: flex;gap: 16px;justify-content: flex-end;">
${socialHtml}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
            </tr>
            <tr>
              <td style="padding: 3mm;">
                ${psHtml}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
`.trim();
}

/**
 * Remplace les emojis présents dans le HTML final par des balises <img>
 * dont la source est un PNG 256px récupéré depuis emoji.family,
 * encodé en base64 localement dans le navigateur.
 *
 * Exemple d’URL utilisée :
 * https://www.emoji.family/api/emojis/%F0%9F%8E%89/fluent/png/256
 */
async function replaceEmojisWithImages(html: string): Promise<string> {
  // Sécurité : si on est côté serveur, on ne tente rien de réseau vers /api.
  if (typeof window === "undefined") {
    return html;
  }

  const isEmojiCodePoint = (codePoint: number): boolean => {
    // Plages couvrant la plupart des emojis modernes (Unicode blocs emoji).
    return (
      (codePoint >= 0x1f300 && codePoint <= 0x1f5ff) || // Misc Symbols and Pictographs
      (codePoint >= 0x1f600 && codePoint <= 0x1f64f) || // Emoticons
      (codePoint >= 0x1f680 && codePoint <= 0x1f6ff) || // Transport & Map
      (codePoint >= 0x1f700 && codePoint <= 0x1f77f) ||
      (codePoint >= 0x1f780 && codePoint <= 0x1f7ff) ||
      (codePoint >= 0x1f800 && codePoint <= 0x1f8ff) ||
      (codePoint >= 0x1f900 && codePoint <= 0x1f9ff) ||
      (codePoint >= 0x1fa00 && codePoint <= 0x1fa6f) ||
      (codePoint >= 0x1fa70 && codePoint <= 0x1faff)
    );
  };

  const uniqueEmojis = new Set<string>();

  // Parcours du HTML par points de code pour détecter les emojis.
  for (let i = 0; i < html.length; ) {
    const codePoint = html.codePointAt(i);
    if (codePoint == null) {
      break;
    }
    const char = String.fromCodePoint(codePoint);
    if (isEmojiCodePoint(codePoint)) {
      uniqueEmojis.add(char);
    }
    i += char.length;
  }

  if (uniqueEmojis.size === 0) {
    return html;
  }

  const fetchPromises: Promise<void>[] = [];
  const emojiToDataUrl = new Map<string, string>();

  uniqueEmojis.forEach((emoji) => {
    const cached = EMOJI_BASE64_CACHE.get(emoji);
    if (cached) {
      emojiToDataUrl.set(emoji, cached);
      return;
    }

    const promise = (async () => {
      try {
        // On passe par une route interne pour éviter les problèmes CORS
        const url = `/api/emoji?char=${encodeURIComponent(emoji)}`;

        const response = await fetch(url);
        if (!response.ok) {
          return;
        }

        const data: { base64?: string } = await response.json();
        const base64 = data.base64;
        if (!base64) {
          return;
        }

        const dataUrl = `data:image/png;base64,${base64}`;
        emojiToDataUrl.set(emoji, dataUrl);
        EMOJI_BASE64_CACHE.set(emoji, dataUrl);
      } catch {
        // En cas d'erreur réseau ou autre, on laisse simplement l'emoji texte.
        return;
      }
    })();

    fetchPromises.push(promise);
  });

  await Promise.all(fetchPromises);

  if (emojiToDataUrl.size === 0) {
    return html;
  }

  // Reconstruction du HTML en substituant les emojis détectés.
  let result = "";
  for (let i = 0; i < html.length; ) {
    const codePoint = html.codePointAt(i);
    if (codePoint == null) {
      break;
    }
    const char = String.fromCodePoint(codePoint);
    const dataUrl = emojiToDataUrl.get(char);

    console.log("data", dataUrl);

    if (dataUrl) {
      result += `<img src="${dataUrl}" alt="${char}" style="height: 1em; width: 1em; vertical-align: -0.1em;" />`;
    } else {
      result += char;
    }

    i += char.length;
  }

  return result;
}

/**
 * Variante asynchrone de buildEmailHtml qui gère les emojis en les
 * remplaçant par des <img> avec src en data:image/png;base64,...
 */
export async function buildEmailHtmlWithEmojis(
  config?: Partial<EmailConfig>
): Promise<string> {
  const html = buildEmailHtml(config);
  return replaceEmojisWithImages(html);
}
