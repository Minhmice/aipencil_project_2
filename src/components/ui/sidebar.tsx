"use client";

// --- IMPORTS ---
import * as React from "react";
import { Slot } from "@radix-ui/react-slot"; // Dùng cho prop `asChild`
import { cva, VariantProps } from "class-variance-authority"; // Để quản lý các biến thể của component
import { PanelLeftIcon } from "lucide-react"; // Icon

// --- HOOKS & UTILS ---
import { useIsMobile } from "@/hooks/use-mobile"; // Hook tùy chỉnh để phát hiện thiết bị di động
import { cn } from "@/lib/utils"; // Hàm tiện ích để nối class

// --- UI COMPONENTS ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
// Sheet được sử dụng để hiển thị sidebar trên mobile dưới dạng một panel trượt ra
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// --- CONSTANTS ---
const SIDEBAR_COOKIE_NAME = "sidebar_state"; // Tên cookie để lưu trạng thái đóng/mở của sidebar
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // Thời gian sống của cookie (7 ngày)
const SIDEBAR_WIDTH = "16rem"; // Chiều rộng mặc định của sidebar
const SIDEBAR_WIDTH_MOBILE = "18rem"; // Chiều rộng trên mobile
const SIDEBAR_WIDTH_ICON = "3rem"; // Chiều rộng khi thu gọn chỉ còn icon
const SIDEBAR_KEYBOARD_SHORTCUT = "b"; // Phím tắt (Ctrl/Cmd + B) để đóng/mở

// --- CONTEXT DEFINITION ---
// Định nghĩa kiểu dữ liệu cho Context, chứa tất cả state và hàm điều khiển sidebar
type SidebarContextProps = {
  state: "expanded" | "collapsed"; // Trạng thái của sidebar (mở rộng / thu gọn)
  open: boolean; // State đóng/mở trên desktop
  setOpen: (open: boolean) => void; // Hàm để thay đổi state `open`
  openMobile: boolean; // State đóng/mở trên mobile
  setOpenMobile: (open: boolean) => void; // Hàm để thay đổi state `openMobile`
  isMobile: boolean; // Biến boolean cho biết có phải là thiết bị di động không
  toggleSidebar: () => void; // Hàm để đóng/mở sidebar
};

// Tạo React Context
const SidebarContext = React.createContext<SidebarContextProps | null>(null);

// Custom hook để dễ dàng truy cập vào Context từ các component con
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

// --- SIDEBAR PROVIDER ---
// Component Provider, bọc toàn bộ ứng dụng hoặc layout để cung cấp Context
function SidebarProvider({
  defaultOpen = true, // Trạng thái mở mặc định
  open: openProp, // Prop để điều khiển từ bên ngoài (controlled component)
  onOpenChange: setOpenProp, // Callback khi state thay đổi (controlled component)
  children,
  ...props
}: React.ComponentProps<"div"> & { /* ... */ }) {
  const isMobile = useIsMobile(); // Kiểm tra thiết bị
  const [openMobile, setOpenMobile] = React.useState(false);

  // State nội bộ cho sidebar trên desktop
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open; // Ưu tiên prop từ bên ngoài nếu có

  // Hàm để set trạng thái đóng/mở, đồng thời cập nhật cookie
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      // Lưu trạng thái vào cookie để ghi nhớ lựa chọn của người dùng
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );

  // Hàm tiện ích để đóng/mở sidebar tùy theo thiết bị
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Gán phím tắt Ctrl/Cmd + B để đóng/mở sidebar
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  // Tạo giá trị context, được memoize để tránh render lại không cần thiết
  const contextValue = React.useMemo<SidebarContextProps>(() => ({
    state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar,
  }), [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]);

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={{ /* Định nghĩa các biến CSS tùy chỉnh */ } as React.CSSProperties}
          className={cn("group/sidebar-wrapper ...", props.className)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

// --- SIDEBAR COMPONENT ---
// Component Sidebar chính, xử lý logic hiển thị cho desktop và mobile
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { /* ... */ }) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  // Trường hợp 1: Sidebar không thể thu gọn
  if (collapsible === "none") { /* ... */ }

  // Trường hợp 2: Trên thiết bị di động, render sidebar bằng component Sheet
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent /* ... */ side={side}>
          {/* ... */}
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Trường hợp 3: Trên desktop, render sidebar cố định
  return (
    <div
      className="group peer ... md:block"
      data-state={state} // `data-state`="expanded" hoặc "collapsed"
      data-collapsible={state === "collapsed" ? collapsible : ""} // `data-collapsible`="icon" hoặc "offcanvas"
      /* ... */
    >
      {/* Div này tạo ra một khoảng trống, đẩy nội dung chính sang phải */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-[var(--sidebar-width)] ... transition-[width]",
          // Các class để xử lý thay đổi chiều rộng khi thu gọn
          "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]"
        )}
      />
      {/* Container thực sự của sidebar, được định vị `fixed` */}
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 ... w-[var(--sidebar-width)] transition-all",
          // Các class để xử lý animation trượt ra/vào cho chế độ 'offcanvas'
          side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "...",
          // Thay đổi chiều rộng khi thu gọn
          "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]"
        )}
        {...props}
      >
        <div data-sidebar="sidebar" data-slot="sidebar-inner" className="flex h-full w-full flex-col ...">
          {children}
        </div>
      </div>
    </div>
  );
}

// --- CÁC COMPONENT PHỤ ---

// Nút để đóng/mở sidebar (thường là icon hamburger)
function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button onClick={(event) => { onClick?.(event); toggleSidebar(); }} {...props}>
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

// Thanh kéo (rail) để đóng/mở sidebar bằng cách click vào cạnh
function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();
  return <button onClick={toggleSidebar} className={cn("absolute inset-y-0 ...", className)} {...props} />;
}

// Container cho nội dung chính của trang, sẽ tự điều chỉnh vị trí theo sidebar
function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return <main className={cn("relative flex w-full flex-1 flex-col ...", className)} {...props} />;
}

// Các component nhỏ để xây dựng cấu trúc bên trong sidebar
function SidebarInput({ ... }: React.ComponentProps<typeof Input>) { /* ... */ }
function SidebarHeader({ ... }: React.ComponentProps<"div">) { /* ... */ }
function SidebarFooter({ ... }: React.ComponentProps<"div">) { /* ... */ }
function SidebarSeparator({ ... }: React.ComponentProps<typeof Separator>) { /* ... */ }
function SidebarContent({ ... }: React.ComponentProps<"div">) { /* ... */ }
function SidebarGroup({ ... }: React.ComponentProps<"div">) { /* ... */ }
function SidebarGroupLabel({ ... }: React.ComponentProps<"div"> & { asChild?: boolean }) { /* ... */ }
function SidebarGroupAction({ ... }: React.ComponentProps<"button"> & { asChild?: boolean }) { /* ... */ }
function SidebarGroupContent({ ... }: React.ComponentProps<"div">) { /* ... */ }

// Các component để xây dựng menu điều hướng
function SidebarMenu({ ... }: React.ComponentProps<"ul">) { /* ... */ }
function SidebarMenuItem({ ... }: React.ComponentProps<"li">) { /* ... */ }

// Định nghĩa các biến thể cho nút trong menu
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex items-center ...",
  { variants: { /* ... */ }, defaultVariants: { /* ... */ } }
);

// Nút trong menu, có hỗ trợ tooltip khi sidebar thu gọn
function SidebarMenuButton({ asChild = false, isActive = false, tooltip, ...props }: React.ComponentProps<"button"> & { /* ... */ }) {
  const { isMobile, state } = useSidebar();
  const button = <button className={cn(sidebarMenuButtonVariants({ ... }))} {...props} />;

  // Chỉ hiển thị tooltip khi sidebar được thu gọn và không phải trên mobile
  if (!tooltip) return button;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center" hidden={state !== "collapsed" || isMobile} {...tooltip}>
        {/* ... */}
      </TooltipContent>
    </Tooltip>
  );
}

// Các component phụ khác cho menu item (action, badge, skeleton, sub-menu)
function SidebarMenuAction({ ... }: React.ComponentProps<"button"> & { /* ... */ }) { /* ... */ }
function SidebarMenuBadge({ ... }: React.ComponentProps<"div">) { /* ... */ }
function SidebarMenuSkeleton({ ... }: React.ComponentProps<"div"> & { /* ... */ }) { /* ... */ }
function SidebarMenuSub({ ... }: React.ComponentProps<"ul">) { /* ... */ }
function SidebarMenuSubItem({ ... }: React.ComponentProps<"li">) { /* ... */ }
function SidebarMenuSubButton({ ... }: React.ComponentProps<"a"> & { /* ... */ }) { /* ... */ }

// Xuất tất cả các component và hook
export {
  Sidebar, SidebarProvider, useSidebar, // Core components
  // ... và tất cả các component phụ khác
};
