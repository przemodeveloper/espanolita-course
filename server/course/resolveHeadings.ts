import type { HeadingItem } from "@/models/task";

type OptionLike = { label?: string | null; text?: string | null };
type QuestionLike = { options?: OptionLike[] | null };
type ContentLike = {
  headings?: HeadingItem[] | null;
  options?: OptionLike[] | null;
};

/**
 * heading_match chips must come from a shared bank. Prefer content.headings,
 * then content.options, then unique labels across question.options.
 */
export function resolveHeadingMatchHeadings(
  content: ContentLike | null | undefined,
  questions: QuestionLike[] | null | undefined,
): HeadingItem[] {
  const fromContent = content?.headings?.filter(
    (h) => h?.label && h?.text != null,
  );
  if (fromContent && fromContent.length > 0) {
    return fromContent;
  }

  const fromContentOptions = (content?.options ?? [])
    .filter((o) => o?.label)
    .map((o) => ({
      label: String(o.label).trim().toUpperCase(),
      text: (o.text ?? "").trim() || String(o.label),
    }));
  if (fromContentOptions.length > 0) {
    return dedupeByLabel(fromContentOptions);
  }

  const fromQuestions: HeadingItem[] = [];
  for (const q of questions ?? []) {
    for (const o of q.options ?? []) {
      if (!o?.label) continue;
      fromQuestions.push({
        label: String(o.label).trim().toUpperCase(),
        text: (o.text ?? "").trim() || String(o.label),
      });
    }
  }
  return dedupeByLabel(fromQuestions);
}

function dedupeByLabel(items: HeadingItem[]): HeadingItem[] {
  const seen = new Set<string>();
  const out: HeadingItem[] = [];
  for (const item of items) {
    const key = item.label.toUpperCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ ...item, label: key });
  }
  return out;
}
