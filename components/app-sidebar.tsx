"use client";

import { ListChecks } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTasks } from "@/queries/useTasks";
import type { ListTask } from "@/models/tasks";
import Link from "next/link";
import { useTask } from "@/queries/useTask";

export function AppSidebar() {
  const { tasks } = useTasks();
  const { prefetchQuery } = useTask();

  const items = tasks?.map((task: ListTask) => ({
    title: task.title,
    url: `/task/${task.id}`,
    icon: ListChecks,
    onMouseOver: () => prefetchQuery(task.id),
  }));

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Kurs maturalny Españolita</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items?.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} onMouseOver={item.onMouseOver}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
