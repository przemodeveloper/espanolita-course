import type { GradeEssayResponse } from "./grading";

export interface Attempt {
  attemptId: string;
  score: number;
  type: string;
  correctQuestionIds?: string[];
  incorrectQuestionIds?: string[];
  answerText?: string;
  answers?: {
    questionId: string;
    optionId?: string;
    answerText?: string;
  }[];
  grading?: GradeEssayResponse;
}
