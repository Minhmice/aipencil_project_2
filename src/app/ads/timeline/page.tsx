// Cần "use client" để sử dụng React Hooks như useState và các tương tác phía client.
"use client";

// --- IMPORTS ---
// Metadata từ Next.js để định nghĩa tiêu đề và mô tả cho trang.
import { Metadata } from "next";
// Các component layout chung của ứng dụng.
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// Thư viện faker để tạo dữ liệu giả cho mục đích demo.
import { faker } from "@faker-js/faker";
// Import toàn bộ hệ thống component Gantt chart tùy chỉnh.
import {
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttMarker,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from "@/components/ui/kibo-ui/gantt";
// Tiện ích groupBy từ lodash để nhóm các feature lại.
import groupBy from "lodash.groupby";
// Icons từ thư viện lucide-react.
import { EyeIcon, LinkIcon, TrashIcon } from "lucide-react";
// React hook để quản lý state.
import { useState } from "react";
// Các component UI cơ bản khác.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

// --- METADATA ---
// Định nghĩa metadata cho trang, hữu ích cho SEO.
const metadata: Metadata = {
  title: "Advertise Facebook",
  description: "AI Pencil",
};

// --- DATA GENERATION (Dữ liệu giả) ---
// Hàm tiện ích để viết hoa chữ cái đầu.
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// Tạo một mảng các trạng thái (status) có thể có cho một công việc.
const statuses = [
  { id: faker.string.uuid(), name: "Planned", color: "#6B7280" },
  { id: faker.string.uuid(), name: "In Progress", color: "#F59E0B" },
  { id: faker.string.uuid(), name: "Done", color: "#10B981" },
];

// Tạo một mảng người dùng giả.
const users = Array.from({ length: 4 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    image: faker.image.avatar(),
  }));

// Tạo các nhóm, sản phẩm, sáng kiến, và phiên bản giả để phân loại công việc.
const exampleGroups = Array.from({ length: 6 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: capitalize(faker.company.buzzPhrase()),
  }));
// ... (tương tự cho products, initiatives, releases)
const exampleProducts = Array.from({ length: 4 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: capitalize(faker.company.buzzPhrase()),
  }));
const exampleInitiatives = Array.from({ length: 2 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: capitalize(faker.company.buzzPhrase()),
  }));
const exampleReleases = Array.from({ length: 3 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: capitalize(faker.company.buzzPhrase()),
  }));

// Tạo một mảng lớn các công việc (features) giả.
// Mỗi công việc có ngày bắt đầu/kết thúc, trạng thái, người phụ trách, và thuộc về các nhóm khác nhau.
const exampleFeatures = Array.from({ length: 20 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: capitalize(faker.company.buzzPhrase()),
    startAt: faker.date.past({ years: 0.5, refDate: new Date() }),
    endAt: faker.date.future({ years: 0.5, refDate: new Date() }),
    status: faker.helpers.arrayElement(statuses),
    owner: faker.helpers.arrayElement(users),
    group: faker.helpers.arrayElement(exampleGroups),
    product: faker.helpers.arrayElement(exampleProducts),
    initiative: faker.helpers.arrayElement(exampleInitiatives),
    release: faker.helpers.arrayElement(exampleReleases),
  }));

// Tạo các mốc thời gian (markers) giả để hiển thị trên biểu đồ.
const exampleMarkers = Array.from({ length: 6 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    date: faker.date.past({ years: 0.5, refDate: new Date() }),
    label: capitalize(faker.company.buzzPhrase()),
    className: faker.helpers.arrayElement([
      // Chọn ngẫu nhiên một class để có màu sắc khác nhau
      "bg-blue-100 text-blue-900",
      "bg-green-100 text-green-900",
      "bg-purple-100 text-purple-900",
      "bg-red-100 text-red-900",
      "bg-orange-100 text-orange-900",
      "bg-teal-100 text-teal-900",
    ]),
  }));

// --- PAGE COMPONENT ---
const Example = () => {
  // Sử dụng lodash.groupBy để nhóm các công việc theo tên nhóm.
  // Kết quả là một object với key là tên nhóm và value là mảng các công việc trong nhóm đó.
  const groupedFeatures = groupBy(exampleFeatures, "group.name");

  // Sắp xếp các nhóm theo thứ tự alphabet.
  const sortedGroupedFeatures = Object.fromEntries(
    Object.entries(groupedFeatures).sort(([nameA], [nameB]) =>
      nameA.localeCompare(nameB)
    )
  );

  // --- RENDER ---
  return (
    // Bọc toàn bộ trang trong SidebarProvider để quản lý trạng thái của sidebar (đóng/mở, responsive).
    <SidebarProvider
      style={
        {
          // Định nghĩa các biến CSS tùy chỉnh cho layout.
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* Nội dung của sidebar bên trái (menu điều hướng chính). */}
      <AppSidebar />

      {/* Container cho phần nội dung chính, sẽ tự điều chỉnh khi sidebar co/giãn. */}
      <SidebarInset>
        {/* Header của trang, hiển thị tiêu đề. */}
        <SiteHeader title="Advertise Facebook" />

        {/* Container chính cho biểu đồ Gantt. */}
        <div className="p-2 w-full">
          {/* GanttProvider cung cấp context (cấu hình, dữ liệu) cho tất cả component con của biểu đồ. */}
          {/* range="monthly": Hiển thị các cột theo tháng. */}
          {/* zoom={100}: Mức phóng to ban đầu. */}
          <GanttProvider className="border" range="monthly" zoom={100}>
            {/* Phần sidebar của biểu đồ Gantt, hiển thị danh sách công việc. */}
            <GanttSidebar>
              {/* Lặp qua các nhóm đã được sắp xếp. */}
              {Object.entries(sortedGroupedFeatures).map(
                ([group, features]) => (
                  // Mỗi nhóm là một GanttSidebarGroup.
                  <GanttSidebarGroup key={group} name={group}>
                    {/* Lặp qua các công việc trong nhóm. */}
                    {features.map((feature) => (
                      // Mỗi công việc là một GanttSidebarItem.
                      <GanttSidebarItem feature={feature} key={feature.id} />
                    ))}
                  </GanttSidebarGroup>
                )
              )}
            </GanttSidebar>

            {/* Phần timeline trực quan của biểu đồ Gantt. */}
            <GanttTimeline>
              {/* Header của timeline, hiển thị các mốc thời gian (ví dụ: T7, T8, T9...). */}
              <GanttHeader />

              {/* Danh sách các thanh tác vụ (feature bars). */}
              <GanttFeatureList>
                {/* Lặp lại cấu trúc nhóm tương tự như sidebar để đảm bảo các hàng được căn chỉnh đúng. */}
                {Object.entries(sortedGroupedFeatures).map(
                  ([group, features]) => (
                    <GanttFeatureListGroup key={group}>
                      {/* Lặp qua các công việc để vẽ thanh bar tương ứng. */}
                      {features.map((feature) => (
                        <div className="flex" key={feature.id}>
                          <GanttFeatureItem {...feature} />
                        </div>
                      ))}
                    </GanttFeatureListGroup>
                  )
                )}
              </GanttFeatureList>

              {/* Vẽ các mốc thời gian (markers) đã tạo. */}
              {exampleMarkers.map((marker) => (
                <GanttMarker key={marker.id} {...marker} />
              ))}

              {/* Vẽ đường kẻ dọc đánh dấu ngày hôm nay. */}
              <GanttToday />
            </GanttTimeline>
          </GanttProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

// Xuất component để Next.js có thể render nó thành một trang.
export default Example;
