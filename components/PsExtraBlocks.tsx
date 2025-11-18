import type { PsItem } from "@/lib/emailTemplate";
import type { ChangeEvent } from "react";

export interface PsExtraBlocksProps {
  psRaw: PsItem[];
  onChangePs: (index: number, field: keyof PsItem, value: string) => void;
  onRemoveBlock: (blockIndex: number) => void;
  advanced: boolean;
}

export function PsExtraBlocks({
  psRaw,
  onChangePs,
  onRemoveBlock,
  advanced,
}: PsExtraBlocksProps) {
  const extraCount = Math.max(Math.ceil((psRaw.length - 3) / 4), 0);

  if (extraCount <= 0) {
    return null;
  }

  return (
    <>
      {Array.from({ length: extraCount }, (_, blockIndex) => {
        const blockStart = 3 + blockIndex * 4;
        const block = psRaw.slice(blockStart, blockStart + 4);
        if (!block.length) return null;

        return (
          <div
            key={blockStart}
            style={{
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.16)",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              background: "rgba(8,8,18,0.9)",
            }}
          >
            {block.map((ps, innerIndex) => {
              const globalIndex = blockStart + innerIndex;
              return (
                <div
                  key={globalIndex}
                  style={{
                    display: "grid",
                    gridTemplateColumns: advanced
                      ? "auto minmax(0,1fr) auto"
                      : "minmax(0,1fr) auto",
                    gap: 6,
                    alignItems: "center",
                  }}
                >
                  {advanced && (
                    <input
                      value={ps.label ?? ""}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        onChangePs(globalIndex, "label", e.target.value)
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
                      onChangePs(globalIndex, "text", e.target.value)
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
                      onChangePs(globalIndex, "color", e.target.value)
                    }
                    style={{
                      width: 32,
                      height: 22,
                      borderRadius: 6,
                      border: "none",
                      background: "transparent",
                    }}
                  />
                </div>
              );
            })}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 4,
              }}
            >
              <button
                type="button"
                onClick={() => onRemoveBlock(blockIndex)}
                style={{
                  borderRadius: 999,
                  border: "none",
                  padding: "2px 10px",
                  fontSize: 11,
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.04)",
                  color: "#f66",
                }}
              >
                Supprimer ce bloc de 4
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}
