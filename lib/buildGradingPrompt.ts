import type { GradeEssayRequest } from "@/models/grading";

export function buildGradingPrompt(data: GradeEssayRequest) {
  const requirements = data.requirements
    .map((r, i) => `${i + 1}. ${r}`)
    .join("\n");

  const rubric = data.rubric
    .map((r) => `- ${r.name} (${r.weight} points)`)
    .join("\n");

  return `
You are a STRICT academic language examiner.

You MUST:
- grade fairly and consistently
- follow rubric exactly
- not invent criteria
- return ONLY valid JSON
- feedback, reasoning, missing points should be provided in Polish

TASK:
${data.task}

REQUIRED LANGUAGE:
${data.language}

REQUIREMENTS (ALL must be covered):
${requirements}

WORD LIMIT:
${data.wordLimit?.min}-${data.wordLimit?.max}

RUBRIC:
${rubric}

GRADING RULES:
- Count words
- Penalize if outside limits
- Check grammar
- Check vocabulary range
- Check coherence
- Check that ALL bullet points are addressed
- If language is wrong, penalize heavily

Return ONLY this JSON format:

{
  "totalScore": number,
  "wordCount": number,
  "languageCorrect": boolean,
  "breakdown": [
    { "category": string, "score": number, "reasoning": string }
  ],
  "missingPoints": string[],
  "feedback": string
}

ESSAY:
"""
${data.essay}
"""
`;
}
