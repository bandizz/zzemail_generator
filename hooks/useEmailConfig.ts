import { useEffect, useState } from "react";
import { DEFAULT_CONFIG, type EmailConfig } from "@/lib/emailTemplate";

const STORAGE_KEY = "zzemail-generator-config-v1";

export interface UseEmailConfigResult {
  config: EmailConfig;
  updateConfig: (partial: Partial<EmailConfig>) => void;
  resetConfig: () => void;
}

export function useEmailConfig(): UseEmailConfigResult {
  const [config, setConfig] = useState<EmailConfig>(DEFAULT_CONFIG);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Au montage, on essaie de restaurer la config depuis le localStorage.
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Partial<EmailConfig>;
      // On merge toujours avec DEFAULT_CONFIG pour éviter les soucis
      // quand on ajoute des champs dans EmailConfig plus tard.
      setConfig({ ...DEFAULT_CONFIG, ...parsed });
    } catch {
      // En cas d'erreur (JSON invalide, etc.), on ignore simplement
      // et on laisse la config par défaut.
    } finally {
      // On marque l'hydratation comme faite (même si rien n'est trouvé)
      // pour permettre ensuite l'écriture dans le localStorage.
      setHasHydrated(true);
    }
  }, []);

  // À chaque changement de config, on persiste dans le localStorage.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasHydrated) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Si le quota est dépassé ou autre, on ne bloque pas l'UI.
    }
  }, [config, hasHydrated]);

  const updateConfig = (partial: Partial<EmailConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);

    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignorer silencieusement les erreurs de storage.
      }
    }
  };

  return {
    config,
    updateConfig,
    resetConfig,
  };
}


