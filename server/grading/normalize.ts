/** Normalize free-text answers for case/whitespace-insensitive comparison. */
export function normalizeText(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}
