import { SOCIAL_LOGOS_BASE64 } from "./socialLogos";
import type { SocialProvider } from "./emailTypes";

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


