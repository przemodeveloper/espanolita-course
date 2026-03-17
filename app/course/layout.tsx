import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <div className="flex flex-1 relative min-w-0">
        <div className="sticky top-[73px] z-20 self-start">
          <SidebarTrigger />
        </div>
        <div className="flex-1 min-w-0 w-full mr-[28px] py-6">{children}</div>
      </div>
    </SidebarProvider>
  );
}
