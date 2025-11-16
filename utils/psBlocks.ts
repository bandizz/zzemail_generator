import type { PsItem } from "@/lib/emailTemplate";

export function addPsBlock(psRaw: PsItem[]): PsItem[] {
  const extra: PsItem[] = Array.from({ length: 4 }, () => ({
    text: "",
    color: "black",
  }));
  return [...psRaw, ...extra];
}

export function removePsBlock(psRaw: PsItem[], blockIndex: number): PsItem[] {
  // blocs de 4 après les 3 premiers P$ (P$1-3) et le P$4 traditionnel
  if (psRaw.length <= 3) {
    return psRaw;
  }
  const blockStart = 3 + blockIndex * 4;
  const blockEnd = blockStart + 4;
  return psRaw.filter((_, i) => i < blockStart || i >= blockEnd);
}
