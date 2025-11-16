import type { ChangeEvent } from "react";

export interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        fontSize: 13
      }}
    >
      <span>{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        style={{
          width: 36,
          height: 22,
          borderRadius: 6,
          border: "none",
          padding: 0,
          background: "transparent"
        }}
      />
    </div>
  );
}


