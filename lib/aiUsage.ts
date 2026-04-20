import { prisma } from "@/lib/prisma";

export type AiUsageKind = "essay_grading" | "audio_open_text_grading"; // extend as needed

export async function countAiUsageSince(
  userId: string,
  kind: AiUsageKind,
  since: Date,
) {
  return prisma.ai_usage_events.count({
    where: { user_id: userId, kind, created_at: { gte: since } },
  });
}

export async function logAiUsage(params: {
  userId: string;
  kind: AiUsageKind;
  taskId?: string | null;
  model?: string | null;
  promptTokens?: number | null;
  completionTokens?: number | null;
}) {
  return prisma.ai_usage_events.create({
    data: {
      user_id: params.userId,
      kind: params.kind,
      task_id: params.taskId ?? null,
      model: params.model ?? null,
      prompt_tokens: params.promptTokens ?? null,
      completion_tokens: params.completionTokens ?? null,
    },
  });
}

export function startOfTodayUtc() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}
