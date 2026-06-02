// Shared mapping + validation for the forløbsbibliotek API routes.
// The browser tool (content/aarsplan.html) speaks camelCase with Danish
// letters; the `forloeb` table uses snake_case. Map at the API boundary.

export const FORLOEB_COLUMNS =
  "id, title, fag, uger, beskrivelse, faelles_maal";

export type ForloebRow = {
  id: string;
  title: string;
  fag: string;
  uger: number;
  beskrivelse: string;
  faelles_maal: string[] | null;
};

export function toClient(row: ForloebRow) {
  return {
    id: row.id,
    title: row.title,
    fag: row.fag,
    uger: row.uger,
    beskrivelse: row.beskrivelse,
    fællesMål: row.faelles_maal ?? [],
  };
}

// Pull a clean, validated forløb payload out of a request body.
// Returns null when the required title is missing.
export function parseForloebBody(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>;
  const title = typeof b.title === "string" ? b.title.trim() : "";
  if (!title) return null;
  const ugerNum = Number(b.uger);
  return {
    title,
    fag: typeof b.fag === "string" && b.fag ? b.fag : "Dansk",
    uger: Number.isFinite(ugerNum) && ugerNum > 0 ? Math.floor(ugerNum) : 1,
    beskrivelse:
      typeof b.beskrivelse === "string" && b.beskrivelse.trim()
        ? b.beskrivelse.trim()
        : "Ingen beskrivelse endnu.",
    faelles_maal: Array.isArray(b.fællesMål)
      ? b.fællesMål.filter((m): m is string => typeof m === "string")
      : [],
  };
}
