import { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LinkCardGrid } from "@/components/link-card";

export const metadata: Metadata = {
  title: "Advertise Facebook",
  description: "AI Pencil",
};
export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader title="Advertise Facebook" />
        
      </SidebarInset>
    </SidebarProvider>
  );
}
