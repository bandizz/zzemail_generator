interface ActionsBarProps {
  copiedRendered: boolean;
  downloaded: boolean;
  onCopyRendered: () => void;
  onDownload: () => void;
  onReset: () => void;
}

export function ActionsBar({
  copiedRendered,
  downloaded,
  onCopyRendered,
  onDownload,
  onReset,
}: ActionsBarProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 6,
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={onCopyRendered}
          style={{
            borderRadius: 999,
            border: "none",
            padding: "7px 16px",
            fontSize: 13,
            cursor: "pointer",
            background: "linear-gradient(135deg, #ff4dad,rgb(251, 56, 160))",
            color: "white",
            fontWeight: 500,
          }}
        >
          {copiedRendered ? "Rendu copié ✅" : "Copier le rendu"}
        </button>
        <button
          type="button"
          onClick={onDownload}
          style={{
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.25)",
            padding: "7px 16px",
            fontSize: 13,
            cursor: "pointer",
            background: "rgba(5,5,15,0.9)",
            color: "white",
            fontWeight: 500,
          }}
        >
          {downloaded ? "Téléchargé ✅" : "Télécharger .html"}
        </button>
      </div>
      <button
        type="button"
        onClick={onReset}
        style={{
          borderRadius: 999,
          border: "none",
          padding: "6px 12px",
          fontSize: 12,
          cursor: "pointer",
          background: "rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.9)",
        }}
      >
        Reset paramètres
      </button>
    </div>
  );
}
