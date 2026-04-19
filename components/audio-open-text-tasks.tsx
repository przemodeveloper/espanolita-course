import type { Question } from "@/models/task";
import type { Attempt } from "@/models/attempt";
import OpenTextTask from "./open-text-task";
import { useState } from "react";
import { useDeleteAttempt } from "@/queries/useDeleteAttempt";
import { TaskSummary } from "./task-summary";
import { TaskActions } from "./task-actions";
import { useAiGradeTask } from "@/queries/useAiGradeTask";
import AudioPlayer from "./audio-player";

export default function AudioOpenTextTasks({
  audioUrl,
  questions,
  attempt,
  taskId,
  transcript,
  taskInstructions,
  language = "es-ES",
}: {
  audioUrl: string;
  questions: Question[];
  attempt?: Attempt | null;
  taskId: string;
  transcript: string;
  taskInstructions: string;
  language?: string;
}) {
  const [answers, setAnswers] = useState<
    { questionId: string; answerText: string }[]
  >(
    () =>
      attempt?.answers?.map((a) => ({
        questionId: a.questionId,
        answerText: a.answerText ?? "",
      })) ?? [],
  );

  const { mutate: gradeTask, isPending: isGrading } = useAiGradeTask(
    taskId,
    "audio_open_text_grading",
  );

  const { mutate: deleteAttempt, isPending: isDeleting } =
    useDeleteAttempt(taskId);

  const handleGradeTask = () => {
    gradeTask({
      language,
      task: taskInstructions,
      transcript,
      gaps: questions.map((q) => ({
        id: q.id,
        label: String(q.order_index),
        sentenceWithGap: q.prompt.sentence ?? "",
        studentAnswer:
          answers.find((a) => a.questionId === q.id)?.answerText ?? "",
      })),
    });
  };

  const handleResetAnswers = () => {
    deleteAttempt(undefined, {
      onSuccess: () => {
        setAnswers([]);
      },
    });
  };

  const handleChangeAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) =>
      prev.find((a) => a.questionId === questionId)
        ? prev.map((a) =>
            a.questionId === questionId ? { ...a, answerText: answer } : a,
          )
        : [...prev, { questionId, answerText: answer }],
    );
  };

  return (
    <div>
      {audioUrl && (
        <div className="mb-4">
          <AudioPlayer url={audioUrl} />
        </div>
      )}
      <div className="space-y-4 mb-4">
        {questions.map((question) => (
          <OpenTextTask
            key={question.id}
            orderIndex={question.order_index}
            sentence={question.prompt.sentence}
            keywords={question.prompt.keywords}
            value={
              answers.find((a) => a.questionId === question.id)?.answerText ??
              ""
            }
            disabled={Boolean(attempt?.attemptId) || isGrading || isDeleting}
            onChange={(answerText) =>
              handleChangeAnswer(question.id, answerText)
            }
          />
        ))}
      </div>

      {attempt?.attemptId && (
        <TaskSummary score={attempt.score} className="mb-4" />
      )}
      <TaskActions
        onSubmit={handleGradeTask}
        onReset={handleResetAnswers}
        isSubmitting={isGrading}
        isDeleting={isDeleting}
        attemptId={attempt?.attemptId ?? null}
        disabled={answers.length !== questions.length}
      />
    </div>
  );
}
