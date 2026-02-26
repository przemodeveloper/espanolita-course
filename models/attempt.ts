export interface Attempt {
  attemptId: string;
  score: number;
  answers: {
    questionId: string;
    optionId?: string;
    answerText?: string;
  }[];
}