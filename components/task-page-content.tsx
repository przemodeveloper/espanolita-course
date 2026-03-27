"use client";

import { useTask } from "@/queries/useTask";
import { GapFillSharedTask } from "./gap-fill-shared-task";
import LoadingSpinner from "./loading-spinner";
import WritingTask from "./writing-task";
import SingleChoiceTasks from "./single-choice-tasks";
import { useLayoutEffect } from "react";
import { useParams } from "next/navigation";
import { useAttempt } from "@/queries/useAttempt";
import OpenTextTasks from "./open-text-tasks";
import { Instructions } from "./instructions";
import { Criterion } from "./criterion";
import { TaskLabel } from "./task-label";
import { formatPoints } from "@/lib/utils";
import OpenTextGapsTask from "./open-text-gaps-task";
import { HeadingMatchTask } from "./heading-match-task";
import TaskSetProgressBar from "./task-set-progress-bar";
import { useProgress } from "@/queries/useProgress";

export function TaskPageContent({ taskId }: { taskId: string }) {
  const params = useParams<{ taskSetId: string }>();
  const taskSetIdFromRoute = params.taskSetId ?? "";

  const { task, isPending } = useTask({ taskId });
  const { attempt } = useAttempt(taskId);

  const { progress } = useProgress(taskSetIdFromRoute);

  useLayoutEffect(() => {
    document.title = `${task?.title} - Zadania Maturalne Españolita`;
  }, [task]);

  const completedTasksCount = taskSetIdFromRoute
    ? (progress?.taskSets?.[taskSetIdFromRoute]?.completedTasksCount ?? 0)
    : 0;

  const totalTasksCount = taskSetIdFromRoute
    ? (progress?.taskSets?.[taskSetIdFromRoute]?.totalTasksCount ?? 0)
    : 0;

  const taskSetTitle =
    task?.taskSetTitle ?? progress?.taskSets?.[taskSetIdFromRoute]?.title ?? "";

  let taskBody: React.ReactNode = null;
  switch (task?.type) {
    case "single_choice":
      taskBody = (
        <>
          <h1 className="text-lg font-semibold mb-2">{task?.title}</h1>
          <Instructions className="mb-4">{task?.instructions}</Instructions>
          <SingleChoiceTasks
            key={attempt?.attemptId ?? "new"}
            questions={task?.questions}
            taskId={taskId}
            attempt={attempt}
            text={task?.content.text}
            title={task?.content.title}
          />
        </>
      );
      break;
    case "gap_fill_shared":
      taskBody = (
        <>
          <h1 className="text-lg font-semibold mb-2">{task?.title}</h1>
          <Instructions className="mb-4">{task?.instructions}</Instructions>
          <GapFillSharedTask
            key={attempt?.attemptId ?? "new"}
            taskId={taskId}
            text={task?.content?.text ?? ""}
            options={task?.sharedOptions}
            questions={task?.questions}
            attempt={attempt}
          />
        </>
      );
      break;
    case "open_text":
      taskBody = (
        <>
          <h1 className="text-lg font-semibold mb-2">{task?.title}</h1>
          <Instructions className="mb-4">{task?.instructions}</Instructions>
          <OpenTextTasks
            taskId={taskId}
            key={attempt?.attemptId ?? "new"}
            questions={task?.questions}
            attempt={attempt}
          />
        </>
      );
      break;
    case "writing":
      taskBody = (
        <>
          <h1 className="text-lg font-semibold mb-4">{task?.title}</h1>
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
      break;
    case "open_text_gaps":
      taskBody = (
        <>
          <h1 className="text-lg font-semibold mb-2">{task?.title}</h1>
          <Instructions className="mb-4">{task?.instructions}</Instructions>
          <OpenTextGapsTask
            key={attempt?.attemptId ?? "new"}
            taskId={taskId}
            title={task?.content?.title}
            text={task?.content?.text ?? ""}
            questions={task?.questions}
            attempt={attempt}
          />
        </>
      );
      break;
    case "heading_match":
      taskBody = (
        <>
          <h1 className="text-lg font-semibold mb-2">{task?.title}</h1>
          <Instructions className="mb-4">{task?.instructions}</Instructions>
          <HeadingMatchTask
            key={attempt?.attemptId ?? "new"}
            taskId={taskId}
            headings={task?.content?.headings ?? []}
            questions={task?.questions ?? []}
            attempt={attempt}
          />
        </>
      );
      break;
    default:
      taskBody = null;
      break;
  }

  return (
    <>
      <TaskSetProgressBar
        taskSetTitle={taskSetTitle}
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasksCount}
      />
      {isPending ? (
        <div className="flex justify-center items-center min-h-[50vh] w-full">
          <LoadingSpinner />
        </div>
      ) : (
        taskBody
      )}
    </>
  );
}
