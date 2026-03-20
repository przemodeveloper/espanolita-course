"use client";

import { useTask } from "@/queries/useTask";
import { GapFillSharedTask } from "./gap-fill-shared-task";
import LoadingSpinner from "./loading-spinner";
import WritingTask from "./writing-task";
import SingleChoiceTasks from "./single-choice-tasks";
import { useLayoutEffect } from "react";
import { useAttempt } from "@/queries/useAttempt";
import OpenTextTasks from "./open-text-tasks";
import { Instructions } from "./instructions";
import { Criterion } from "./criterion";
import { TaskLabel } from "./task-label";
import { formatPoints } from "@/lib/utils";
import OpenTextGapsTask from "./open-text-gaps-task";

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
        <>
          <h1 className="text-lg font-bold mb-2">{task?.title}</h1>
          <Instructions className="mb-4">{task?.instructions}</Instructions>
          <SingleChoiceTasks
            key={attempt?.attemptId ?? "new"}
            questions={task?.questions_v2}
            taskId={taskId}
            attempt={attempt}
          />
        </>
      );
    case "gap_fill_shared":
      return (
        <>
          <h1 className="text-lg font-bold mb-2">{task?.title}</h1>
          <Instructions className="mb-4">{task?.instructions}</Instructions>
          <GapFillSharedTask
            key={attempt?.attemptId ?? "new"}
            taskId={taskId}
            text={task?.content.text}
            options={task?.sharedOptions}
            questions={task?.questions_v2}
            attempt={attempt}
          />
        </>
      );
    case "open_text":
      return (
        <>
          <h1 className="text-lg font-bold mb-2">{task?.title}</h1>
          <Instructions className="mb-4">{task?.instructions}</Instructions>
          <OpenTextTasks
            taskId={taskId}
            key={attempt?.attemptId ?? "new"}
            questions={task?.questions_v2}
            attempt={attempt}
          />
        </>
      );
    case "writing":
      return (
        <>
          <h1 className="text-lg font-bold mb-4">{task?.title}</h1>
          <Instructions className="mb-4">
            <p className="mb-4">{task?.instructions}</p>
            <ul>
              {task?.content.requirements?.map((requirement) => (
                <li className="list-disc list-inside ml-4" key={requirement}>
                  {requirement}
                </li>
              ))}
            </ul>
          </Instructions>
          <div className="border border-gray-200 p-4 rounded-lg">
            <p className="font-semibold mb-4">Kryteria oceniania</p>
            <ul className="flex flex-wrap gap-4">
              <Criterion
                name="długość wypowiedzi"
                criterion={`min. ${task?.content.minWords} słów, max. ${task?.content.maxWords} słów`}
              />
              {task?.content.rubric?.map((rubric) => (
                <Criterion
                  key={rubric.name}
                  name={rubric.name}
                  criterion={formatPoints(rubric.weight)}
                />
              ))}
            </ul>
          </div>

          <div className="border border-orange-200 bg-orange-50 p-4 rounded-lg my-4">
            <TaskLabel label="Zadanie" />
            <p className="font-semibold">{task?.content.openingText}</p>
          </div>

          <WritingTask
            key={attempt?.attemptId ?? "new"}
            taskId={taskId}
            language={task?.content.language ?? ""}
            minWords={task?.content.minWords ?? 0}
            maxWords={task?.content.maxWords ?? 0}
            requirements={task?.content.requirements ?? []}
            rubric={task?.content.rubric ?? []}
            instructions={task?.instructions ?? ""}
            attempt={attempt}
          />
        </>
      );
    case "open_text_gaps":
      return (
        <>
          <h1 className="text-lg font-bold mb-2">{task?.title}</h1>
          <Instructions className="mb-4">{task?.instructions}</Instructions>
          <OpenTextGapsTask
            key={attempt?.attemptId ?? "new"}
            taskId={taskId}
            text={task?.content.text}
            questions={task?.questions_v2}
            attempt={attempt}
          />
        </>
      );
    default:
      return null;
  }
}
