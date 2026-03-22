import type { RubricItem } from "./grading";

export interface Task {
  id: string;
  title: string;
  instructions: string;
  taskSetId?: string | null;
  taskSetTitle: string;
  type:
    | "single_choice"
    | "gap_fill_shared"
    | "open_text"
    | "writing"
    | "open_text_gaps";
  questions_v2: Question[];
  sharedOptions?: Option[];
  content: {
    text: string;
    language?: string;
    maxScore?: number;
    minWords?: number;
    maxWords?: number;
    requirements?: string[];
    rubric?: RubricItem[];
    openingText?: string;
  };
}

export interface Question {
  id: string;
  order_index: number;
  gap_index: number;
  prompt: {
    lines?: string[];
    sentence?: string;
    keywords?: string[];
  };
  options_v2: Option[];
}

export interface Option {
  id: string;
  label: string;
  text: string;
}
