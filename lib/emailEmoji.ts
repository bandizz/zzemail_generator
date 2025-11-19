// Cache en mémoire pour éviter de refetch les mêmes emojis.
const EMOJI_BASE64_CACHE = new Map<string, string>();

/**
 * Remplace les emojis présents dans le HTML final par des balises <img>
 * dont la source est un PNG 256px récupéré depuis emoji.family,
 * encodé en base64 localement dans le navigateur.
 *
 * Exemple d’URL utilisée :
 * https://www.emoji.family/api/emojis/%F0%9F%8E%89/fluent/png/256
 */
export async function replaceEmojisWithImages(html: string): Promise<string> {
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

    if (dataUrl) {
      result += `<img class="zz-emoji" src="${dataUrl}" alt="${char}" style="height: 1em; width: 1em; vertical-align: -0.1em;" />`;
    } else {
      result += char;
    }

    i += char.length;
  }

  return result;
}
