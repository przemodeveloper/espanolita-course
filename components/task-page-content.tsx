"use client";

import { TaskContent } from "@/components/task-content";
import { useTask } from "@/queries/useTask";

export function TaskPageContent({ taskId }: { taskId: string }) {
  const { task } = useTask({ taskId });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-lg font-bold mb-2">{task?.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{task?.instructions}</p>
      </div>

      {task?.questions_v2?.map((question) => (
        <TaskContent
          key={question.id}
          options={question.options_v2}
          prompt={question.prompt}
          orderIndex={question.order_index}
        />
      ))}
    </div>
  );
}
