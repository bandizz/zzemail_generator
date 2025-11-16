import { PsExtraBlocks } from "@/components/PsExtraBlocks";
import {
  SPECIAL_PS_TEXT,
  validatePsRaw,
  type PsItem,
} from "@/lib/emailTemplate";
import { addPsBlock, removePsBlock } from "@/utils/psBlocks";
import type { ChangeEvent } from "react";

export interface PsEditorProps {
  psRaw: PsItem[];
  setPsRaw: (items: PsItem[]) => void;
}

export function PsEditor({ psRaw, setPsRaw }: PsEditorProps) {
  const handleChangePs = (
    index: number,
    field: keyof PsItem,
    value: string
  ) => {
    const next = psRaw.map((ps, i) =>
      i === index ? { ...ps, [field]: value } : ps
    );
    setPsRaw(next);
  };

  const handleAddPs = () => {
    setPsRaw(addPsBlock(psRaw));
  };

  const handleRemoveBlock = (blockIndex: number) => {
    setPsRaw(removePsBlock(psRaw, blockIndex));
  };

  const isValidCount = validatePsRaw(psRaw);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxHeight: 320,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600 }}>P$ (post-scripts)</span>
        <button
          type="button"
          onClick={handleAddPs}
          style={{
            borderRadius: 999,
            border: "none",
            padding: "4px 10px",
            fontSize: 12,
            cursor: "pointer",
            background:
              "linear-gradient(120deg, rgba(255, 77, 173, 0.9), rgba(255, 196, 0, 0.9))",
            color: "#111",
            fontWeight: 600,
          }}
        >
          + Ajouter un P$
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 6,
          overflowY: "auto",
          paddingRight: 4,
        }}
      >
        {psRaw.slice(0, 3).map((ps, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) auto auto",
              gap: 6,
              alignItems: "center",
            }}
          >
            <input
              value={ps.text}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChangePs(index, "text", e.target.value)
              }
              placeholder="Texte du P$"
              style={{
                padding: "4px 6px",
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(10,10,20,0.9)",
                color: "white",
                fontSize: 12,
              }}
            />
            <input
              type="color"
              value={ps.color || "#000000"}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChangePs(index, "color", e.target.value)
              }
              style={{
                width: 32,
                height: 22,
                borderRadius: 6,
                border: "none",
                background: "transparent",
              }}
            />
            <span
              style={{
                fontSize: 10,
                opacity: 0.6,
                textAlign: "right",
              }}
            >
              Obligatoire
            </span>
          </div>
        ))}

        {/* P$4 traditionnel, non éditable */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) auto auto",
            gap: 6,
            alignItems: "center",
            opacity: 0.8,
          }}
        >
          <input
            value={SPECIAL_PS_TEXT}
            readOnly
            style={{
              padding: "4px 6px",
              borderRadius: 6,
              border: "1px dashed rgba(255,255,255,0.25)",
              background: "rgba(10,10,20,0.4)",
              color: "white",
              fontSize: 12,
            }}
          />
          <input
            type="color"
            value="#000000"
            readOnly
            style={{
              width: 32,
              height: 22,
              borderRadius: 6,
              border: "none",
              background: "transparent",
              opacity: 0.6,
            }}
          />
          <span
            style={{
              fontSize: 10,
              opacity: 0.6,
              textAlign: "right",
            }}
          >
            Obligatoire
          </span>
        </div>

        <PsExtraBlocks
          psRaw={psRaw}
          onChangePs={handleChangePs}
          onRemoveBlock={handleRemoveBlock}
        />
      </div>

      <div
        style={{
          marginTop: 4,
          fontSize: 11,
          opacity: 0.8,
          color: isValidCount ? "#7fffa5" : "#ffb3b3",
        }}
      >
        {isValidCount
          ? "OK : Le nombre de P$ est un multiple de 4."
          : "Le nombre de P$ n'est pas un multiple de 4."}
      </div>
    </div>
  );
}
