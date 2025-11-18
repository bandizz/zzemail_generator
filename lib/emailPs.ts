import type { PsItem, PsWithId } from "./emailTypes";

export function buildPsList(
  psRaw: PsItem[] | undefined,
  specialPsLabel: string,
  specialPsText: string,
  specialPsColor: string
): PsWithId[] {
  const result: PsWithId[] = [];
  const list = Array.isArray(psRaw) ? psRaw : [];

  // P$1-3 : issus des 3 premiers éléments de psRaw
  list.slice(0, 3).forEach((ps, index) => {
    result.push({
      id: index + 1,
      text: ps?.text ?? "",
      color: ps?.color || "black",
      label: ps?.label,
    });
  });

  // P$4 : traditionnel (texte/config dédié)
  if (list.length >= 3) {
    result.push({
      id: 4,
      text: specialPsText,
      color: specialPsColor || "black",
      label: specialPsLabel,
    });
  }

  // P$ suivants (P$5, P$6, ...) : à partir de psRaw[3]
  list.slice(3).forEach((ps, index) => {
    result.push({
      id: 5 + index,
      text: ps?.text ?? "",
      color: ps?.color || "black",
      label: ps?.label,
    });
  });

  return result;
}

export function validatePsRaw(psRaw: PsItem[] | undefined): boolean {
  const count = Array.isArray(psRaw) ? psRaw.length : 0;
  // Il faut au moins 3 P$ non vides et respecter la règle :
  // nombre total de P$ (avec le P$4) multiple de 4 → (count + 1) % 4 === 0
  if (!Array.isArray(psRaw) || count < 3) {
    return false;
  }

  const firstThreeValid = psRaw
    .slice(0, 3)
    .every(
      (ps) => ps && typeof ps.text === "string" && ps.text.trim().length > 0
    );

  if (!firstThreeValid) {
    return false;
  }

  return (count + 1) % 4 === 0;
}
