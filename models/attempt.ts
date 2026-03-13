export interface Attempt {
  attemptId: string;
  score: number;
  correctQuestionIds: string[];
  incorrectQuestionIds: string[];
  answerText?: string;
  answers: {
    questionId: string;
    optionId?: string;
    answerText?: string;
  }[];
}
