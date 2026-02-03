export interface Task {
  id: string;
  title: string;
  instructions: string;
  type: "single_choice" | 'gap_fill_shared';
  questions_v2: Question[];
}

export interface Question {
  id: string;
  order_index: number;
  prompt: {
    lines: string[];
  };
  options_v2: Option[];
}

export interface Option {
  id: string;
  label: string;
  text: string;
}