"use client";

// --- IMPORTS ---
import * as React from "react";
import Link from "next/link"; // Component Link của Next.js để điều hướng phía client
import { usePathname } from "next/navigation"; // Hook để lấy đường dẫn URL hiện tại
import { NavUser } from "@/components/nav-user"; // Component hiển thị thông tin người dùng

// Import các icon từ thư viện @tabler/icons-react
import {
  IconDashboard,
  IconAd,
  IconChartBar,
  IconFolder,
  IconSettings,
  IconHelp,
  IconSearch,
} from "@tabler/icons-react";

// Import các component con từ hệ thống Sidebar đã được tạo
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

// Import component Collapsible để tạo các mục menu có thể đóng/mở
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react"; // Icon mũi tên

// --- CONFIGURATION ---
// Cấu hình dữ liệu cho các mục điều hướng và thông tin người dùng.
// Việc tách ra một object riêng giúp dễ dàng quản lý và thay đổi sau này.
const navItems = {
  user: {
    name: "minhmice",
    email: "trantueminh35@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  main: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    {
      title: "Ads",
      url: "/ads",
      icon: IconAd,
      // `items` cho biết đây là một mục cha có các mục con
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
};

// --- REUSABLE NAV ITEM COMPONENT ---
// Một component con có thể đệ quy để render các mục menu và menu con của chúng.
function NavItem({ item, path }: { item: any; path: string }) {
  // Kiểm tra xem mục này có đang được active hay không.
  // Active khi đường dẫn hiện tại trùng khớp hoặc là con của URL mục này.
  const isActive =
    path === item.url || (item.items && path.startsWith(item.url));

  // Trường hợp 1: Mục có các mục con (item.items tồn tại)
  if (item.items) {
    return (
      // Sử dụng Collapsible để tạo hiệu ứng đóng/mở
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel asChild className="... hover:bg-sidebar-accent ...">
            {/* CollapsibleTrigger là phần tử được click để đóng/mở */}
            <CollapsibleTrigger className="w-full flex items-center justify-between text-xl">
              <div className="flex items-center gap-2">
                <item.icon className="h-8 w-8" />
                <span className="font-semibold">{item.title}</span>
              </div>
              {/* Icon mũi tên sẽ xoay khi menu được mở */}
              <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          {/* CollapsibleContent chứa các mục menu con, sẽ được ẩn/hiện */}
          <CollapsibleContent>
            <SidebarGroupContent className="ml-12 border-l-2 border-gray-200">
              <SidebarMenu>
                {/* Đệ quy: Render các mục con bằng chính component NavItem */}
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

  // Trường hợp 2: Mục không có mục con
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={item.url} className="flex items-center gap-2 text-xl">
          {item.icon && <item.icon className="h-8 w-8" />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// --- MAIN APP SIDEBAR COMPONENT ---
// Đây là component chính được export, lắp ráp các phần lại với nhau.
export function AppSidebar() {
  // Lấy đường dẫn hiện tại để xác định mục menu nào đang active.
  const path = usePathname();
  const { user } = navItems; // Lấy thông tin người dùng từ config

  return (
    // Sử dụng component Sidebar đã được định nghĩa ở file `sidebar.tsx`
    // collapsible="offcanvas": trên desktop, sidebar sẽ trượt ra/vào từ cạnh màn hình.
    <Sidebar collapsible="offcanvas" className="bg-red-50">
      <SidebarHeader>
        {/* Phần Logo và tên ứng dụng */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex rounded shadow-sm ">
                <div className="w-6 h-6 md:w-10 md:h-10">
                  <svg /* ... SVG logo ... */ >
                    {/* ... paths ... */}
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

      {/* Phần nội dung chính của sidebar, chứa menu */}
      <SidebarContent className="gap-0">
        <SidebarMenu className="list-none">
          {/* Render các mục menu chính bằng cách lặp qua `navItems.main` */}
          {navItems.main.map((item) => (
            <NavItem key={item.title} item={item} path={path} />
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      {/* Phần chân của sidebar, chứa thông tin người dùng */}
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
