import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CourseContext } from "@/context/course-context";
import { QUERY_KEYS } from "@/queries/consts";
import { requireCourseAccess } from "@/server/auth/requireCourseAccess";
import { loadProgress } from "@/server/course/loadProgress";
import { loadTaskSets } from "@/server/course/loadTaskSets";

export default async function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await requireCourseAccess();
  if (access.response) {
    redirect("/unauthorized");
  }

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.TASK_SETS],
      queryFn: () => loadTaskSets(),
    }),
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.PROGRESS],
      queryFn: () => loadProgress(access.user.id),
    }),
  ]);

  return (
    <CourseContext>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SidebarProvider defaultOpen>
          <AppSidebar />
          <div className="flex flex-1 relative min-w-0">
            <div className="sticky top-[64px] z-20 self-start">
              <SidebarTrigger />
            </div>
            <div className="flex-1 min-w-0 w-full mr-[28px] py-6">{children}</div>
          </div>
        </SidebarProvider>
      </HydrationBoundary>
    </CourseContext>
  );
}
