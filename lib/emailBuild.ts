import { replaceEmojisWithImages } from "./emailEmoji";
import { buildPsList } from "./emailPs";
import { getSocialIconSrc } from "./emailSocials";
import {
  DEFAULT_CONFIG,
  type EmailConfig,
  type SocialItem,
} from "./emailTypes";

export function escapeHtml(str: string | null | undefined): string {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Mot-clé à taper dans l'éditeur pour insérer un séparateur horizontal.
export const BODY_SEPARATOR_TOKEN = "[SEPARATOR]" as const;

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyBodyShortcodes(html: string | null | undefined): string {
  if (!html) return "";

  let result = html;

  const hrHtml =
    '<hr style="width: 100%; height: 2px; background-color: rgb(221, 221, 221); margin: 25px 0px; border: none;">';

  // 1) Cas classique avec Quill : le mot-clé est dans un paragraphe seul.
  const escapedToken = escapeForRegExp(BODY_SEPARATOR_TOKEN);

  const paragraphRegex = new RegExp(`<p>\\s*${escapedToken}\\s*<\\/p>`, "g");
  result = result.replace(paragraphRegex, hrHtml);

  // 2) Fallback : on remplace le token brut où qu'il soit.
  const tokenRegex = new RegExp(escapedToken, "g");
  result = result.replace(tokenRegex, hrHtml);

  // 3) Cartes colorées : [CARD color="#000"] ... [/CARD]
  const cardRegex = /\[CARD\s+color="([^"]*)"\]([\s\S]*?)\[\/CARD\]/gi;

  result = result.replace(
    cardRegex,
    (_match, colorRaw: string, inner: string) => {
      const bgColor = (colorRaw || "").trim() || "#f5f5f5";

      return `<div style="background-color: ${bgColor}; border-radius: 12px; padding: 16px; margin: 16px 0;">${inner}</div>`;
    }
  );

  return result;
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

  const bodyWithShortcodes = applyBodyShortcodes(bodyHtml);

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

  blockquote {
    margin: 0 0 0 10px;
    padding-left: 10px;
    border-left: 3px solid #ccc;
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
                  ${bodyWithShortcodes}
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
 * Variante asynchrone de buildEmailHtml qui gère les emojis en les
 * remplaçant par des <img> avec src en data:image/png;base64,...
 */
export async function buildEmailHtmlWithEmojis(
  config?: Partial<EmailConfig>
): Promise<string> {
  const html = buildEmailHtml(config);
  return replaceEmojisWithImages(html);
}
