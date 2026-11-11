import { normalizeText } from "@/server/grading/normalize";

export type SubmitAnswerInput = {
  questionId: string;
  optionId?: string;
  answerText?: string;
};

export type QuestionGradeInfo = {
  id: string;
  points: number | null;
  correct_key: string | null;
};

export type OptionGradeInfo = {
  id: string;
  is_correct: boolean | null;
};

export type AcceptableAnswerInfo = {
  question_id: string;
  normalized_text: string | null;
  regex_pattern: string | null;
};

export type GradedAnswerRow = {
  question_id: string;
  option_id: string | null;
  answer_text: string | null;
  is_correct: boolean | null;
  points_awarded: number;
};

export type TaskGradeKind =
  | "choice"
  | "open_text"
  | "heading_or_gap"
  | "unknown";

export function taskGradeKind(taskType: string): TaskGradeKind {
  if (taskType === "single_choice" || taskType === "audio_single_choice") {
    return "choice";
  }
  if (taskType === "open_text" || taskType === "open_text_gaps") {
    return "open_text";
  }
  if (taskType === "heading_match" || taskType === "gap_fill_shared") {
    return "heading_or_gap";
  }
  return "unknown";
}

export function validateSubmitAnswers(
  taskType: string,
  answers: SubmitAnswerInput[],
): void {
  if (!answers.length) {
    throw new Error("Brak odpowiedzi");
  }

  const seen = new Set<string>();
  for (const a of answers) {
    if (seen.has(a.questionId)) {
      throw new Error(`Duplikat odpowiedzi dla pytania ${a.questionId}`);
    }
    seen.add(a.questionId);
  }

  const kind = taskGradeKind(taskType);

  if (kind === "choice" && !answers.every((a) => a.optionId)) {
    throw new Error("Brak optionId dla zadania wyboru");
  }

  if (kind === "open_text" && !answers.every((a) => a.answerText !== undefined)) {
    throw new Error("Brak answerText dla pytania otwartego tekstu");
  }

  if (
    kind === "heading_or_gap" &&
    !answers.every((a) => a.answerText !== undefined)
  ) {
    throw new Error(
      "Brak answerText dla pytania dopasowania nagłówka lub wypełniania luk współdzielonych",
    );
  }

  if (kind === "unknown") {
    throw new Error(`Nieobsługiwany typ zadania: ${taskType}`);
  }
}

export function gradeSubmitAnswers(args: {
  taskType: string;
  answers: SubmitAnswerInput[];
  questions: QuestionGradeInfo[];
  options: OptionGradeInfo[];
  acceptableAnswers: AcceptableAnswerInfo[];
}): GradedAnswerRow[] {
  const { taskType, answers, questions, options, acceptableAnswers } = args;
  const kind = taskGradeKind(taskType);

  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const optionMap = new Map(options.map((o) => [o.id, o]));

  const acceptableMap = acceptableAnswers.reduce((map, a) => {
    const list = map.get(a.question_id) ?? [];
    list.push(a);
    map.set(a.question_id, list);
    return map;
  }, new Map<string, AcceptableAnswerInfo[]>());

  return answers.map((a) => {
    const q = questionMap.get(a.questionId);
    const option = a.optionId ? optionMap.get(a.optionId) : null;

    let isCorrect: boolean | null = null;
    let points = 0;

    if (kind === "choice") {
      isCorrect = option?.is_correct ?? false;
      points = isCorrect ? (q?.points ?? 1) : 0;
    }

    if (kind === "heading_or_gap") {
      const userRaw = a.answerText ?? "";
      const normalizedUser = normalizeText(userRaw);
      const key = q?.correct_key;

      if (key != null && key !== "") {
        isCorrect = normalizeText(key) === normalizedUser;
      } else {
        isCorrect = false;
      }
      points = isCorrect ? (q?.points ?? 1) : 0;
    }

    if (kind === "open_text") {
      const userRaw = a.answerText ?? "";
      const normalizedUser = normalizeText(userRaw);
      const acceptable = acceptableMap.get(a.questionId) ?? [];

      if (acceptable.length) {
        isCorrect = acceptable.some((ans) => {
          if (ans.normalized_text && normalizedUser === ans.normalized_text) {
            return true;
          }
          if (ans.regex_pattern) {
            try {
              return new RegExp(ans.regex_pattern, "i").test(normalizedUser);
            } catch {
              return false;
            }
          }
          return false;
        });
      } else {
        const key = q?.correct_key;
        if (key != null && key !== "") {
          isCorrect = normalizeText(key) === normalizedUser;
        } else {
          isCorrect = false;
        }
      }
      points = isCorrect ? (q?.points ?? 1) : 0;
    }

    return {
      question_id: a.questionId,
      option_id:
        kind === "heading_or_gap" ? null : (a.optionId ?? null),
      answer_text: a.answerText ?? null,
      is_correct: isCorrect,
      points_awarded: points,
    };
  });
}
