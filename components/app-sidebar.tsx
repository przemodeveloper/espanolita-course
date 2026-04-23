"use client";

import { BookOpen, CheckCircle, ChevronRight, Circle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { useTask } from "@/queries/useTask";
import { usePathname, useParams, useRouter } from "next/navigation";
import { useTaskSets } from "@/queries/useTaskSets";
import type { TaskSet } from "@/models/taskSets";
import { useProgress } from "@/queries/useProgress";

export function AppSidebar() {
  const { taskSets = [] } = useTaskSets();
  const { taskSetId = "" } = useParams<{ taskSetId: string }>();
  const { progress } = useProgress(taskSetId as string);

  const { prefetchQuery } = useTask({ enabled: false });
  const pathname = usePathname();
  const router = useRouter();
  const isActiveLink = (url: string) => pathname === url;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">
            Matura Españolita
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {taskSets.map((taskSet: TaskSet) => {
                const isActiveSet = taskSet.tasks.some(
                  (t) =>
                    pathname === `/course/task-set/${taskSet.id}/task/${t.id}`,
                );
                return (
                  <Collapsible
                    key={taskSet.id}
                    defaultOpen={isActiveSet}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="cursor-pointer font-medium [&>svg[data-chevron]]:transition-transform group-data-[state=open]/collapsible:[&>svg[data-chevron]]:rotate-90">
                          <BookOpen />
                          <span className="flex-1 truncate text-left font-semibold">
                            {taskSet.title}
                          </span>
                          <ChevronRight
                            data-chevron
                            className="size-4 shrink-0"
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {taskSet.tasks.map(
                            (task: { id: string; title: string }) => {
                              const url = `/course/task-set/${taskSet.id}/task/${task.id}`;
                              return (
                                <SidebarMenuSubItem key={task.id}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isActiveLink(url)}
                                  >
                                    <Link
                                      href={url}
                                      prefetch
                                      onMouseEnter={() => {
                                        router.prefetch(url);
                                        prefetchQuery(task.id);
                                      }}
                                      onFocus={() => {
                                        router.prefetch(url);
                                        prefetchQuery(task.id);
                                      }}
                                    >
                                      {progress?.taskSets?.[
                                        taskSet.id
                                      ]?.completedTasks.includes(task.id) ? (
                                        <span className="text-xs text-green-500 flex items-center gap-1">
                                          <CheckCircle className="size-4" />
                                        </span>
                                      ) : (
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                          <Circle className="size-4" />
                                        </span>
                                      )}
                                      <span className="font-semibold">
                                        {task.title}
                                      </span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            },
                          )}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
