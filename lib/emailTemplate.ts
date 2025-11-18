export {
  DEFAULT_CONFIG,
  SPECIAL_PS_TEXT,
  type EmailConfig,
  type PsItem,
  type PsWithId,
  type SocialItem,
  type SocialProvider,
} from "./emailTypes";

export { getSocialIconSrc } from "./emailSocials";
export { buildPsList, validatePsRaw } from "./emailPs";
export {
  escapeHtml,
  buildEmailHtml,
  buildEmailHtmlWithEmojis,
} from "./emailBuild";

