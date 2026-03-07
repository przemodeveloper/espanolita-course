"use client";

import { useTask } from "@/queries/useTask";
import { GapFillSharedTask } from "./gap-fill-shared-task";
import LoadingSpinner from "./loading-spinner";
import WritingTask from "./writing-task";
import SingleChoiceTasks from "./single-choice-tasks";
import TaskHeader from "./task-header";
import { useLayoutEffect } from "react";
import { useAttempt } from "@/queries/useAttempt";
import OpenTextTasks from "./open-text-tasks";

export function TaskPageContent({ taskId }: { taskId: string }) {
  const { task, isLoading } = useTask({ taskId });
  const { attempt } = useAttempt(taskId);

  useLayoutEffect(() => {
    document.title = `${task?.title} - Kurs maturalny Españolita`;
  }, [task]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <LoadingSpinner />
      </div>
    );
  }

  switch (task?.type) {
    case "single_choice":
      return (
        <SingleChoiceTasks
          key={attempt?.attemptId ?? "new"}
          title={task?.title}
          instructions={task?.instructions}
          questions={task?.questions_v2}
          taskId={taskId}
          attempt={attempt}
        />
      );
    case "gap_fill_shared":
      return (
        <div>
          <TaskHeader title={task?.title} instructions={task?.instructions} />
          <GapFillSharedTask
            key={attempt?.attemptId ?? "new"}
            taskId={taskId}
            text={task?.content.text}
            options={task?.sharedOptions}
            questions={task?.questions_v2}
            attempt={attempt}
          />
        </div>
      );
    case "open_text":
      return (
        <OpenTextTasks
          taskId={taskId}
          key={attempt?.attemptId ?? "new"}
          title={task?.title}
          instructions={task?.instructions}
          questions={task?.questions_v2}
          attempt={attempt}
        />
      );
    case "writing":
      return (
        <div>
          <TaskHeader title={task?.title} instructions={task?.instructions} />
          <WritingTask
            language={task?.content.language}
            maxScore={task?.content.maxScore}
            minWords={task?.content.minWords}
            maxWords={task?.content.maxWords}
            requirements={task?.content.requirements}
            rubric={task?.content.rubric}
            openingText={task?.content.openingText}
          />
        </div>
      );
    default:
      return null;
  }
}
