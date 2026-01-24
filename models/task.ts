export interface Task {
  id: string;
  title: string;
  instructions: string;
  questions: Question[];
}

export interface Question {
  id: string;
  order_index: number;
  prompt: {
    lines: string[];
  };
  options: Option[];
}

export interface Option {
  id: string;
  label: string;
  text: string;
}