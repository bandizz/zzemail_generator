import { PsExtraBlocks } from "@/components/PsExtraBlocks";
import { validatePsRaw, type PsItem } from "@/lib/emailTemplate";
import { addPsBlock, removePsBlock } from "@/utils/psBlocks";
import type { ChangeEvent } from "react";
import { useState } from "react";

export interface PsEditorProps {
  psRaw: PsItem[];
  setPsRaw: (items: PsItem[]) => void;
  specialPsLabel: string;
  specialPsText: string;
  specialPsColor: string;
  setSpecialPs: (partial: {
    label?: string;
    text?: string;
    color?: string;
  }) => void;
}

export function PsEditor({
  psRaw,
  setPsRaw,
  specialPsLabel,
  specialPsText,
  specialPsColor,
  setSpecialPs,
}: PsEditorProps) {
  const [specialEditable, setSpecialEditable] = useState(false);
  const [advanced, setAdvanced] = useState(false);
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              opacity: 0.8,
            }}
          >
            <input
              type="checkbox"
              checked={advanced}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAdvanced(e.target.checked)
              }
            />
            Mode avancé (préfixes par ligne)
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              opacity: 0.8,
            }}
          >
            <input
              type="checkbox"
              checked={specialEditable}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSpecialEditable(e.target.checked)
              }
            />
            P$ spécial éditable
          </label>
        </div>
        <button
          type="button"
          onClick={handleAddPs}
          style={{
            borderRadius: 999,
            border: "none",
            padding: "4px 10px",
            fontSize: 12,
            cursor: "pointer",
            background: "linear-gradient(135deg, #ff4dad,rgb(251, 56, 160))",
            color: "#fefefe",
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
              gridTemplateColumns: advanced
                ? "auto minmax(0,1fr) auto auto"
                : "minmax(0,1fr) auto auto",
              gap: 6,
              alignItems: "center",
            }}
          >
            {advanced && (
              <input
                value={ps.label ?? ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChangePs(index, "label", e.target.value)
                }
                placeholder="P$"
                style={{
                  padding: "4px 6px",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(10,10,20,0.9)",
                  color: "white",
                  fontSize: 11,
                  width: 56,
                }}
              />
            )}
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

        {/* P$4 traditionnel, éditable si la case est cochée */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: advanced
              ? "auto minmax(0,1fr) auto auto"
              : "minmax(0,1fr) auto auto",
            gap: 6,
            alignItems: "center",
            opacity: 0.8,
          }}
        >
          {advanced && (
            <input
              value={specialPsLabel}
              readOnly={!specialEditable}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSpecialPs({ label: e.target.value })
              }
              placeholder="P$"
              style={{
                padding: "4px 6px",
                borderRadius: 6,
                border: specialEditable
                  ? "1px solid rgba(255,255,255,0.4)"
                  : "1px dashed rgba(255,255,255,0.25)",
                background: specialEditable
                  ? "rgba(10,10,20,0.9)"
                  : "rgba(10,10,20,0.4)",
                color: "white",
                fontSize: 11,
                width: 56,
              }}
            />
          )}
          <input
            value={specialPsText}
            readOnly={!specialEditable}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSpecialPs({ text: e.target.value })
            }
            style={{
              padding: "4px 6px",
              borderRadius: 6,
              border: specialEditable
                ? "1px solid rgba(255,255,255,0.4)"
                : "1px dashed rgba(255,255,255,0.25)",
              background: specialEditable
                ? "rgba(10,10,20,0.9)"
                : "rgba(10,10,20,0.4)",
              color: "white",
              fontSize: 12,
            }}
          />
          <input
            type="color"
            value={specialPsColor || "#000000"}
            readOnly={!specialEditable}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSpecialPs({ color: e.target.value })
            }
            style={{
              width: 32,
              height: 22,
              borderRadius: 6,
              border: "none",
              background: "transparent",
              opacity: specialEditable ? 1 : 0.6,
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
          advanced={advanced}
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
