import type { ChangeEvent } from "react";

export interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder
}: TextInputProps) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        fontSize: 13
      }}
    >
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        style={{
          padding: "6px 8px",
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(10,10,20,0.9)",
          color: "white",
          fontSize: 13,
          outline: "none"
        }}
      />
    </label>
  );
}


