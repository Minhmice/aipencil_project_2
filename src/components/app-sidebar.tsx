"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  IconDashboard,
  IconAd,
  IconChartBar,
  IconFolder,
  IconSettings,
  IconHelp,
  IconSearch,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

// Navigation items configuration
const navItems = {
  main: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    {
      title: "Ads",
      url: "/ads",
      icon: IconAd,
      items: [
        { title: "Ad Library", url: "/ads/library" },
        { title: "Creative Hub", url: "/ads/creative-hub" },
        { title: "Hooks", url: "/ads/hooks" },
        { title: "Timeline", url: "/ads/timeline" },
      ],
    },
    { title: "Analytics", url: "/analytics", icon: IconChartBar },
    { title: "Saved Ads", url: "/saved-ads", icon: IconFolder },
  ],
  secondary: [
    { title: "Settings", url: "/settings", icon: IconSettings },
    { title: "Get Help", url: "/help", icon: IconHelp },
    { title: "Search", url: "/search", icon: IconSearch },
  ],
};

// Reusable NavItem component
function NavItem({ item, path }: { item: any; path: string }) {
  const isActive = path === item.url || (item.items && path.startsWith(item.url));

  if (item.items) {
    return (
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel
            asChild
            className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <CollapsibleTrigger className="w-full flex items-center justify-between px-2 text-xl">
              <div className="flex items-center gap-2">
                <item.icon className="h-8 w-8" />
                <span className="font-semibold">{item.title}</span>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent className="ml-2 border-l-2 border-gray-200 pl-2">
              <SidebarMenu>
                {item.items.map((sub: any) => (
                  <NavItem key={sub.title} item={sub} path={path} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={item.url} className="flex items-center gap-2 p-2 text-xl">
          {item.icon && <item.icon className="h-8 w-8" />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const path = usePathname();

  return (
    <Sidebar collapsible="offcanvas" className="bg-red-50">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-6 mb-4 rounded"
              >
                <div className="w-6 h-6 md:w-12 md:h-12">
                  <svg
                    width="800"
                    height="800"
                    viewBox="0 0 800 800"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <path
                      d="M538.767 186.026H637L587.884 137L538.767 186.026Z"
                      className="fill-red-700"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M538.767 615V590.487H637V615H538.767Z"
                      className="fill-red-700"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M317.744 578.231L415.977 480.179H538.767V333.103L256.349 615H109L526.488 198.282H637V578.231H317.744ZM600.163 565.974H612.442V210.538H600.163V565.974ZM563.326 565.974H575.605V210.538H563.326V565.974Z"
                      className="fill-red-700"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-red-700 text-xl">
                  AI Pencil
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarMenu className="list-none">
          {navItems.main.map((item) => (
            <NavItem key={item.title} item={item} path={path} />
          ))}
        </SidebarMenu>
        <SidebarMenu className="mt-auto list-none">
          {navItems.secondary.map((item) => (
            <NavItem key={item.title} item={item} path={path} />
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-4 py-3">
        {/* your NavUser here */}
      </SidebarFooter>
    </Sidebar>
  );
}