export interface RubricItem {
  name: string;
  weight: number; // points or %
}

export interface GradeEssayRequest {
  language: string;

  task: string;

  requirements: string[];

  wordLimit?: {
    min: number;
    max: number;
  };

  rubric: RubricItem[];

  essay: string;
}

export interface GradeEssayResponse {
  totalScore: number;
  wordCount: number;
  languageCorrect: boolean;

  breakdown: {
    category: string;
    score: number;
    reasoning: string;
  }[];

  missingPoints: string[];

  feedback: string;
}
