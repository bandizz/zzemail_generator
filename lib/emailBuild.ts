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
    introHtml,
    signature,
    headerBgColor,
    dividerColor,
    psRaw,
    specialPsLabel,
    specialPsText,
    specialPsColor,
    showSocials,
    showEndLogo,
    showSpecialPs,
    zzemainePlanningImage,
    showZzemaineSection,
    events,
    socials,
  } = { ...DEFAULT_CONFIG, ...(config || {}) };

  const psList = buildPsList(
    psRaw,
    specialPsLabel,
    specialPsText,
    specialPsColor
  );
  const finalPsList = showSpecialPs === false ? psList.filter((p) => p.id !== 4) : psList;

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
                                      <a style="color: white; text-decoration: none; display: inline-block;" href="${href}" target="_blank">
                                        <img alt="${alt}" style="height: 40px; object-fit: contain; display: block;" src="${iconSrc}">
                                      </a>
                                    </span>`;
    })
    .join("\n");

  const introWithShortcodes = applyBodyShortcodes(introHtml);

  const endLogoHtml = showEndLogo
    ? `
            <tr>
              <td style="padding: 3mm; text-align:center;">
                <img alt="BandiZZ Logo" style="width: auto; max-height: 100px; display: block; margin: 0px auto;" src="data:image/png;base64,${escapeHtml(
                  endLogo
                )}">
                <p style="margin-top: 16px; color: #333;">${safeSignature}</p>
              </td>
            </tr>
            `
    : "";

  const socialsHtml = showSocials
    ? `
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
                                    <h2 style="margin: 0px; color: white;">Suivez le BDE sur :</h2>
                                  </td>
                                  <td style="text-align: right;">
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
            `
    : "";

  const bodyWithShortcodes = applyBodyShortcodes(bodyHtml);

  const introBlock = introWithShortcodes
    ? `
            <tr>
              <td class="zzemail-body" style="padding: 3mm; color: #333; font-size: 20px; line-height: 1.6;">
                ${introWithShortcodes}
              </td>
            </tr>
            `
    : "";

  const zzemaineHtml = showZzemaineSection && zzemainePlanningImage
    ? `
            <tr>
              <td style="padding: 3mm;">
                <div style="background-color: #f5f5f5; border-radius: 12px; padding: 0; overflow: hidden;">
                  <div style="background-color: ${safeHeaderBgColor}; color: white; padding: 12px; text-align: left;">
                    <h3 style="margin: 0; font-size: 24px; letter-spacing: 1px;">Planning de la ZZemaine</h3>
                  </div>
                  <div style="text-align: center;">
                    <img alt="Planning ZZemaine" style="width: 100%; max-width: 100%; height: auto; display: block;" src="data:image/png;base64,${escapeHtml(
                      zzemainePlanningImage
                    )}">
                  </div>
                </div>
              </td>
            </tr>
            `
    : "";

  const eventsHtml = events && events.length > 0
    ? `
            <tr>
              <td style="padding: 3mm;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 100%;">
                  ${events.map((event) => {
                    const eventImage = escapeHtml(event.eventImage || "");
                    const eventTitle = escapeHtml(event.eventTitle || "");
                    const eventDate = escapeHtml(event.eventDate || "");
                    const eventTime = escapeHtml(event.eventTime || "");
                    const eventLocation = escapeHtml(event.eventLocation || "");
                    return `
                    <div style="background: white; border-radius: 15px; overflow: hidden; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 15px;">
                      ${eventImage ? `<img alt="" style="width: 100%; height: auto; display: block;" src="data:image/png;base64,${eventImage}">` : ""}
                      <div style="padding: 20px;">
                        <h3 style="margin: 0px 0px 10px; color: rgb(26, 26, 26); font-size: 20px;">${eventTitle}</h3>
                        <p style="margin: 0px; color: rgb(102, 102, 102); font-size: 14px;">${eventDate}${eventTime ? ` • ${eventTime}` : ""}</p>
                        <p style="margin: 10px 0px 0px; color: rgb(51, 51, 51);">${eventLocation}</p>
                      </div>
                    </div>`;
                  }).join("")}
                </div>
              </td>
            </tr>
            `
    : "";

  const psHtml = finalPsList
    .map((ps) => {
      // undefined → "P$" (par défaut), "" → aucun préfixe
      const prefix = ps.label === undefined ? "P$" : ps.label;
      const labelPart = prefix ? `${escapeHtml(prefix)} ` : "";
      return `
                  <p style="color: ${escapeHtml(
                    ps.color
                  )}; font-size: 16px; line-height: 1.4;">
                    <strong>${labelPart}${ps.id}</strong> : ${escapeHtml(
        ps.text
      )}
                  </p>`;
    })
    .join("\n");

  return `
<style>
  blockquote {
    margin: 0 0 0 10px !important;
    padding: 0 0 0 10px !important;
    border-left: 3px solid #ccc;
  }
</style>
<table class="zzemail-root-table" style="margin: auto; width: 100%; max-width: 600px; border-collapse: collapse; table-layout: fixed; font-family: 'Segoe UI','Lucida Sans',sans-serif">
  <tbody>
    <tr>
      <td style="padding: 0px;">
        <table style="border: 1px solid rgb(194, 196, 214); background-color: white; border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="
                  background-color: ${safeHeaderBgColor};
                  background-position: center; /* centre le motif */
                  padding: 20px; 
                  color: #fff;
                  text-align: center;">
                <img alt="Logo BandiZZ" style="width: auto; max-height: 100px; display: block; margin: 0px auto;" src="data:image/png;base64,${escapeHtml(
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
            ${introBlock}
            ${zzemaineHtml}
            <tr>
              <td class="zzemail-body" style="padding: 3mm; color: #333; font-size: 20px; line-height: 1.6;">
                ${bodyWithShortcodes}
              </td>
            </tr>
            ${eventsHtml}
            ${endLogoHtml}
            ${socialsHtml}
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
