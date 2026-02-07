"use client";

import { ActionsBar } from "@/components/ActionsBar";
import { EditorPanel } from "@/components/EditorPanel";
import { EmailPreview } from "@/components/EmailPreview";
import { useEmailActions } from "@/hooks/useEmailActions";
import { useEmailConfig } from "@/hooks/useEmailConfig";
import "react-quill/dist/quill.snow.css";

export default function Page() {
  const { config, updateConfig, resetConfig, preset, setPreset } = useEmailConfig();
  const { copiedRendered, downloaded, copyRendered, downloadHtml } =
    useEmailActions(config);

  return (
    <main
      className="layout-main"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
      }}
    >
      <div className="layout-grid">
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <EditorPanel
            config={config}
            onUpdate={updateConfig}
            preset={preset}
            setPreset={setPreset}
          />
          <ActionsBar
            copiedRendered={copiedRendered}
            downloaded={downloaded}
            onCopyRendered={copyRendered}
            onDownload={downloadHtml}
            onReset={resetConfig}
          />
        </section>

        <section>
          <EmailPreview config={config} />
        </section>
      </div>
    </main>
  );
}
