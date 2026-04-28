export interface RubricItem {
  name: string;
  weight: number; // points or %
}

interface AudioGapFillGradingGap {
  id: string;
  label: string;
  sentenceWithGap: string;
  studentAnswer: string;
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

export interface GradeAudioGapFillRequest {
  language: string;
  task: string;
  transcript: string;
  gaps: AudioGapFillGradingGap[];
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

export interface GradeAudioGapFillResponse {
  totalScore: number;
  languageCorrect: boolean;
  breakdown: {
    category: string;
    score: number;
    reasoning: string;
  }[];
  missingPoints: string[];
  feedback: string;
}
