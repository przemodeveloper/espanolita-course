import type { RubricItem } from "./grading";

export interface HeadingItem {
  text: string;
  label: string;
}

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
    | "open_text_gaps"
    | "heading_match"
    | "audio_single_choice";
  questions: Question[];
  content: {
    options?: Option[];
    texts?: {
      sections: string[];
      label: string;
    }[];
    audio_url?: string;
    headings?: HeadingItem[];
    text?: string;
    title?: string;
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
  prompt: {
    lines?: string[];
    sentence?: string;
    text?: string;
    section?: string;
    keywords?: string[];
  };
  options: Option[];
}

export interface Option {
  id: string;
  label: string;
  text: string;
}
