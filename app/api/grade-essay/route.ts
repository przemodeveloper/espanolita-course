import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { buildGradingPrompt } from "@/lib/buildGradingPrompt";
import type { GradeEssayRequest } from "@/models/grading";

export async function POST(req: Request) {
  try {
    const body: GradeEssayRequest = await req.json();

    const prompt = buildGradingPrompt(body);

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      temperature: 0,
      response_format: { type: "json_object" },

      messages: [
        {
          role: "system",
          content: "You are a strict professional essay grader.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = JSON.parse(completion.choices[0].message.content!);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Grading failed" }, { status: 500 });
  }
}
