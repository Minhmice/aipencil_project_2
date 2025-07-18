"use client";

// --- IMPORTS ---
import React from "react";
import { Separator } from "@/components/ui/separator"; // Component đường kẻ phân cách
import { SidebarTrigger } from "@/components/ui/sidebar"; // Component nút bấm để mở/đóng sidebar
import { ModeToggle } from "@/components/mode-toggle"; // Component nút bấm để chuyển đổi theme Sáng/Tối

// --- TYPE DEFINITION ---
// Định nghĩa kiểu dữ liệu cho props của component SiteHeader.
export interface SiteHeaderProps {
  title: string; // Tiêu đề của trang, sẽ được hiển thị trên header.
}

// --- COMPONENT DEFINITION ---
// Component SiteHeader, là thanh header nằm ở đầu phần nội dung chính của trang.
export function SiteHeader({ title }: SiteHeaderProps) {
  return (
    // Thẻ header của HTML5, được style bằng Tailwind CSS.
    // `h-[var(--header-height)]`: Chiều cao được điều khiển bởi biến CSS `--header-height` được định nghĩa trong `SidebarProvider`.
    // `shrink-0`: Ngăn không cho header bị co lại khi không đủ không gian.
    // `border-b`: Thêm một đường viền ở cạnh dưới.
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
      {/* Container bên trong để căn chỉnh các phần tử. */}
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        
        {/* Nút trigger để mở/đóng sidebar. 
            Nó sẽ tự động được ẩn/hiện trên desktop/mobile nhờ logic bên trong component Sidebar. */}
        <SidebarTrigger className="-ml-1" />
        
        {/* Đường kẻ phân cách dọc. */}
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        {/* Hiển thị tiêu đề của trang được truyền vào qua props. */}
        <h1 className="text-base font-medium">{title}</h1>
        
        {/* Container cho các nút hành động ở bên phải header. */}
        {/* `ml-auto`: Đẩy container này vềสุดขอบ bên phải. */}
        <div className="ml-auto flex items-center gap-2">
          {/* Nút chuyển đổi theme Sáng/Tối. */}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
