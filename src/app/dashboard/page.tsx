import { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import EmbedDashboard from "@/components/embed-dashboard";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
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
        <SiteHeader title="Dashboard" />
        <div className="h-screen flex flex-col">
          <EmbedDashboard iframeSrc="https://lookerstudio.google.com/embed/reporting/dc6089f2-db31-449d-bcd6-d1920067d418/page/p9hPF" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
