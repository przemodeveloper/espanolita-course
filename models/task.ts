export interface Task {
  id: string;
  title: string;
  instructions: string;
  type: "single_choice" | "gap_fill_shared" | "open_text";
  questions_v2: Question[];
  content: {
    text: string;
    options: {
      text: string;
      key: string;
    }[];
  };
}

export interface Question {
  id: string;
  order_index: number;
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