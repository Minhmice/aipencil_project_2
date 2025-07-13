import { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LinkCardGrid  } from "@/components/link-card";

export const metadata: Metadata = {
  title: "Advertise Facebook",
  description: "AI Pencil",
};
export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Advertise Facebook" />
        <div className="p-8">
          <LinkCardGrid  />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
