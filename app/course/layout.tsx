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
      <div className="flex flex-1 relative">
        <div className="sticky top-[73px] z-20 self-start">
          <SidebarTrigger />
        </div>
        {children}
      </div>
    </SidebarProvider>
  );
}
