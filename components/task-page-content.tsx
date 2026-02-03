"use client";

import { SingleChoiceTaskContent } from "@/components/single-choice-task-content";
import { useTask } from "@/queries/useTask";

export function TaskPageContent({ taskId }: { taskId: string }) {
  const { task } = useTask({ taskId });

  switch (task?.type) {
    case "single_choice":
      return (
        <div>
          <div className="mb-8">
            <h1 className="text-lg font-bold mb-2">{task?.title}</h1>
            <p className="max-w-2xl text-muted-foreground">
              {task?.instructions}
            </p>
          </div>

          {task?.questions_v2?.map((question) => (
            <SingleChoiceTaskContent
              key={question.id}
              options={question.options_v2}
              prompt={question.prompt}
              orderIndex={question.order_index}
            />
          ))}
        </div>
      );
    default:
      return null;
  }
}
