import type { ReactNode } from "react";

export interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsSection({
  title,
  description,
  children
}: SettingsSectionProps) {
  return (
    <section
      style={{
        borderRadius: 14,
        padding: 12,
        background: "rgba(9,9,20,0.96)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: 10
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: 14,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            opacity: 0.9
          }}
        >
          {title}
        </h2>
        {description ? (
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 12,
              opacity: 0.7
            }}
          >
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}


