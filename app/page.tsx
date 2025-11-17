"use client";

import { ActionsBar } from "@/components/ActionsBar";
import { EditorPanel } from "@/components/EditorPanel";
import { EmailPreview } from "@/components/EmailPreview";
import { useEmailActions } from "@/hooks/useEmailActions";
import { DEFAULT_CONFIG, type EmailConfig } from "@/lib/emailTemplate";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";

export default function Page() {
  const [config, setConfig] = useState<EmailConfig>(DEFAULT_CONFIG);
  const { copiedRendered, downloaded, copyRendered, downloadHtml } =
    useEmailActions(config);

  const handleUpdate = (partial: Partial<EmailConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        padding: "20px 12px",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1.2fr)",
          gap: 18,
        }}
      >
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <EditorPanel config={config} onUpdate={handleUpdate} />
          <ActionsBar
            copiedRendered={copiedRendered}
            downloaded={downloaded}
            onCopyRendered={copyRendered}
            onDownload={downloadHtml}
            onReset={() => setConfig(DEFAULT_CONFIG)}
          />
        </section>

        <section>
          <EmailPreview config={config} />
        </section>
      </div>
    </main>
  );
}
