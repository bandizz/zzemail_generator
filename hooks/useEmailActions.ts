import {
  buildEmailHtmlWithEmojis,
  type EmailConfig,
} from "@/lib/emailTemplate";
import { useState } from "react";

interface EmailActionsState {
  copiedRendered: boolean;
  downloaded: boolean;
}

interface EmailActions extends EmailActionsState {
  copyRendered: () => Promise<void>;
  downloadHtml: () => void;
}

export function useEmailActions(config: EmailConfig): EmailActions {
  const [state, setState] = useState<EmailActionsState>({
    copiedRendered: false,
    downloaded: false,
  });

  const ensureHasTitle = (): boolean => {
    if (!config.title || config.title.trim().length === 0) {
      // Simple guard pour éviter de générer un email sans titre
      alert(
        "Le titre ne peut pas être vide. Merci d'en renseigner un avant de continuer."
      );
      return false;
    }
    return true;
  };

  const copyRendered = async () => {
    try {
      if (!ensureHasTitle()) {
        return;
      }
      const html = await buildEmailHtmlWithEmojis(config);

      if ("clipboard" in navigator && "write" in navigator.clipboard) {
        const blob = new Blob([html], { type: "text/html" });
        const item = new ClipboardItem({ "text/html": blob });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(html);
      }

      setState((prev) => ({ ...prev, copiedRendered: true }));
      setTimeout(
        () => setState((prev) => ({ ...prev, copiedRendered: false })),
        1600
      );
    } catch (e) {
      console.error(e);
    }
  };

  const downloadHtml = () => {
    // On ne peut pas rendre cette fonction elle-même async (API du hook),
    // on lance donc l'opération asynchrone en interne.
    const run = async () => {
      if (!ensureHasTitle()) {
        return;
      }
      const html = await buildEmailHtmlWithEmojis(config);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "email_generated.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setState((prev) => ({ ...prev, downloaded: true }));
      setTimeout(
        () => setState((prev) => ({ ...prev, downloaded: false })),
        1600
      );
    };

    if (!ensureHasTitle()) {
      return;
    }
    void run();
  };

  return {
    ...state,
    copyRendered,
    downloadHtml,
  };
}
