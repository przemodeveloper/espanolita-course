import axios from "axios";
import type {
  GradeAudioGapFillRequest,
  GradeEssayRequest,
} from "@/models/grading";
import type { AiUsageKind } from "@/lib/aiUsage";

export type AiGradeTaskRequest = GradeEssayRequest | GradeAudioGapFillRequest;

export const aiGradeTask = async (
  taskId: string,
  kind: AiUsageKind,
  request: AiGradeTaskRequest,
) => {
  const response = await axios.post(
    `/api/v2/tasks/${taskId}/ai-grade-task?kind=${kind}`,
    request,
  );
  return response.data;
};
