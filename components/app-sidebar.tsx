"use client";

import { ChevronRight, ListChecks } from "lucide-react";
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
import { usePathname } from "next/navigation";
import { useTaskSets } from "@/queries/useTaskSets";
import type { TaskSet } from "@/models/taskSets";

export function AppSidebar() {
  const { taskSets = [] } = useTaskSets();
  const { prefetchQuery } = useTask({ enabled: false });
  const pathname = usePathname();

  const isActiveLink = (url: string) => pathname === url;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Kurs maturalny Españolita</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {taskSets.map((taskSet: TaskSet) => {
                const isActiveSet = taskSet.tasks.some(
                  (t) => pathname === `/course/task/${t.id}`,
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
                          <ListChecks />
                          <span className="flex-1 truncate text-left">
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
                              const url = `/course/task/${task.id}`;
                              return (
                                <SidebarMenuSubItem key={task.id}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isActiveLink(url)}
                                  >
                                    <Link
                                      href={url}
                                      onMouseOver={() => prefetchQuery(task.id)}
                                    >
                                      <span>{task.title}</span>
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
