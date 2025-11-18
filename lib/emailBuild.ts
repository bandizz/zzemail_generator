import { getSocialIconSrc } from "./emailSocials";
import { buildPsList } from "./emailPs";
import {
  DEFAULT_CONFIG,
  type EmailConfig,
  type SocialItem,
} from "./emailTypes";
import { replaceEmojisWithImages } from "./emailEmoji";

export function escapeHtml(str: string | null | undefined): string {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
 * Variante asynchrone de buildEmailHtml qui gère les emojis en les
 * remplaçant par des <img> avec src en data:image/png;base64,...
 */
export async function buildEmailHtmlWithEmojis(
  config?: Partial<EmailConfig>
): Promise<string> {
  const html = buildEmailHtml(config);
  return replaceEmojisWithImages(html);
}


