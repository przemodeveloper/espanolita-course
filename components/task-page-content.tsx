"use client";

import { SingleChoiceTask } from "@/components/single-choice-task";
import { useTask } from "@/queries/useTask";
import { GapFillSharedTask } from "./gap-fill-shared-task";

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
            <SingleChoiceTask
              key={question.id}
              options={question.options_v2}
              prompt={question.prompt}
              orderIndex={question.order_index}
            />
          ))}
        </div>
      );
    case "gap_fill_shared":
      return (
        <div>
          <h1 className="text-lg font-bold mb-2">{task?.title}</h1>
          <p className="max-w-2xl text-muted-foreground mb-4">
            {task?.instructions}
          </p>
          <GapFillSharedTask
            text={task?.content.text}
            options={task?.content.options}
          />
        </div>
      );
    default:
      return null;
  }
}
