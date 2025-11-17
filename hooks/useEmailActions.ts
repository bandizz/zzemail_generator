import { buildEmailHtml, type EmailConfig } from "@/lib/emailTemplate";
import { useState } from "react";

interface EmailActionsState {
  copied: boolean;
  copiedRendered: boolean;
  downloaded: boolean;
}

interface EmailActions extends EmailActionsState {
  copyHtml: () => Promise<void>;
  copyRendered: () => Promise<void>;
  downloadHtml: () => void;
}

export function useEmailActions(config: EmailConfig): EmailActions {
  const [state, setState] = useState<EmailActionsState>({
    copied: false,
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

  const copyHtml = async () => {
    try {
      if (!ensureHasTitle()) {
        return;
      }
      const html = buildEmailHtml(config);
      await navigator.clipboard.writeText(html);
      setState((prev) => ({ ...prev, copied: true }));
      setTimeout(() => setState((prev) => ({ ...prev, copied: false })), 1600);
    } catch (e) {
      console.error(e);
    }
  };

  const copyRendered = async () => {
    try {
      if (!ensureHasTitle()) {
        return;
      }
      const html = buildEmailHtml(config);

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
    if (!ensureHasTitle()) {
      return;
    }
    const html = buildEmailHtml(config);
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

  return {
    ...state,
    copyHtml,
    copyRendered,
    downloadHtml,
  };
}
