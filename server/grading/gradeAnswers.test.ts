import { describe, expect, it } from "vitest";
import {
  gradeSubmitAnswers,
  validateSubmitAnswers,
} from "@/server/grading/gradeAnswers";
import { normalizeText } from "@/server/grading/normalize";

describe("normalizeText", () => {
  it("trims, lowercases, and collapses whitespace", () => {
    expect(normalizeText("  Hola   Mundo ")).toBe("hola mundo");
  });
});

describe("validateSubmitAnswers", () => {
  it("rejects duplicate question ids", () => {
    expect(() =>
      validateSubmitAnswers("single_choice", [
        { questionId: "q1", optionId: "o1" },
        { questionId: "q1", optionId: "o2" },
      ]),
    ).toThrow(/Duplikat/);
  });

  it("requires optionId for choice tasks", () => {
    expect(() =>
      validateSubmitAnswers("single_choice", [{ questionId: "q1" }]),
    ).toThrow(/optionId/);
  });
});

describe("gradeSubmitAnswers", () => {
  it("grades single choice from option.is_correct", () => {
    const rows = gradeSubmitAnswers({
      taskType: "single_choice",
      answers: [
        { questionId: "q1", optionId: "o-correct" },
        { questionId: "q2", optionId: "o-wrong" },
      ],
      questions: [
        { id: "q1", points: 2, correct_key: null },
        { id: "q2", points: 1, correct_key: null },
      ],
      options: [
        { id: "o-correct", is_correct: true },
        { id: "o-wrong", is_correct: false },
      ],
      acceptableAnswers: [],
    });

    expect(rows[0]).toMatchObject({
      is_correct: true,
      points_awarded: 2,
    });
    expect(rows[1]).toMatchObject({
      is_correct: false,
      points_awarded: 0,
    });
  });

  it("grades heading_match via correct_key", () => {
    const rows = gradeSubmitAnswers({
      taskType: "heading_match",
      answers: [{ questionId: "q1", answerText: "  A " }],
      questions: [{ id: "q1", points: 1, correct_key: "a" }],
      options: [],
      acceptableAnswers: [],
    });

    expect(rows[0]).toMatchObject({
      is_correct: true,
      points_awarded: 1,
      option_id: null,
    });
  });

  it("grades open_text with normalized acceptable answers", () => {
    const rows = gradeSubmitAnswers({
      taskType: "open_text",
      answers: [{ questionId: "q1", answerText: "Madrid" }],
      questions: [{ id: "q1", points: 3, correct_key: null }],
      options: [],
      acceptableAnswers: [
        {
          question_id: "q1",
          normalized_text: "madrid",
          regex_pattern: null,
        },
      ],
    });

    expect(rows[0]).toMatchObject({
      is_correct: true,
      points_awarded: 3,
    });
  });
});
