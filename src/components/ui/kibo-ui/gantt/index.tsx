'use client';

// --- IMPORTS ---
// Dnd-kit: Thư viện kéo-thả (drag-and-drop) nhẹ và có khả năng truy cập cao.
import {
  DndContext,
  MouseSensor,
  useDraggable,
  useSensor,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
// Uidotdev/usehooks: Một tập hợp các React hook hữu ích.
import { useMouse, useThrottle, useWindowScroll } from '@uidotdev/usehooks';
// Date-fns: Thư viện mạnh mẽ để làm việc với đối tượng Date trong JavaScript.
import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  endOfDay,
  endOfMonth,
  format,
  formatDate,
  formatDistance,
  getDate,
  getDaysInMonth,
  isSameDay,
  startOfDay,
  startOfMonth,
} from 'date-fns';
// Jotai: Thư viện quản lý state global tối giản.
import { atom, useAtom } from 'jotai';
// Lodash.throttle: Hàm để giới hạn tần suất một hàm được gọi.
import throttle from 'lodash.throttle';
// Lucide-react: Thư viện icon.
import { PlusIcon, TrashIcon } from 'lucide-react';
// Các kiểu dữ liệu và hook cơ bản từ React.
import type {
  CSSProperties,
  FC,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  RefObject,
} from 'react';
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
// Import các component UI cơ bản khác.
import { Card } from '@/components/ui/card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';

// --- GLOBAL STATE (JOTAI) ---
// Atom để theo dõi trạng thái kéo-thả trên toàn bộ biểu đồ.
const draggingAtom = atom(false);
// Atom để theo dõi vị trí cuộn ngang của biểu đồ.
const scrollXAtom = atom(0);

// Custom hooks để dễ dàng sử dụng các atom trên.
export const useGanttDragging = () => useAtom(draggingAtom);
export const useGanttScrollX = () => useAtom(scrollXAtom);

// --- TYPE DEFINITIONS ---
// Kiểu dữ liệu cho trạng thái của một công việc.
export type GanttStatus = {
  id: string;
  name: string;
  color: string;
};

// Kiểu dữ liệu cho một công việc (feature) trong biểu đồ Gantt.
export type GanttFeature = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  status: GanttStatus;
  lane?: string; // Tùy chọn: các feature cùng lane sẽ nằm trên cùng một hàng.
};

// Kiểu dữ liệu cho một mốc thời gian (marker).
export type GanttMarkerProps = {
  id: string;
  date: Date;
  label: string;
};

// Các chế độ xem của timeline.
export type Range = 'daily' | 'monthly' | 'quarterly';

// Cấu trúc dữ liệu của timeline, dùng để render header và các cột.
export type TimelineData = {
  year: number;
  quarters: {
    months: {
      days: number;
    }[];
  }[];
}[];

// Kiểu dữ liệu cho Context của Gantt, chứa tất cả cấu hình và state được chia sẻ.
export type GanttContextProps = {
  zoom: number;
  range: Range;
  columnWidth: number;
  sidebarWidth: number;
  headerHeight: number;
  rowHeight: number;
  onAddItem: ((date: Date) => void) | undefined;
  placeholderLength: number;
  timelineData: TimelineData;
  ref: RefObject<HTMLDivElement | null> | null;
  scrollToFeature?: (feature: GanttFeature) => void;
};

// --- UTILITY FUNCTIONS (Hàm tiện ích tính toán ngày tháng) ---
// Các hàm này giúp trừu tượng hóa logic tính toán dựa trên `range` (daily, monthly, quarterly).

const getsDaysIn = (range: Range) => {
  if (range === 'monthly' || range === 'quarterly') return getDaysInMonth;
  return (_date: Date) => 1;
};

const getDifferenceIn = (range: Range) => {
  if (range === 'monthly' || range === 'quarterly') return differenceInMonths;
  return differenceInDays;
};

const getInnerDifferenceIn = (range: Range) => {
  if (range === 'monthly' || range === 'quarterly') return differenceInDays;
  return differenceInHours;
};

const getStartOf = (range: Range) => {
  if (range === 'monthly' || range === 'quarterly') return startOfMonth;
  return startOfDay;
};

const getEndOf = (range: Range) => {
  if (range === 'monthly' || range === 'quarterly') return endOfMonth;
  return endOfDay;
};

const getAddRange = (range: Range) => {
  if (range === 'monthly' || range === 'quarterly') return addMonths;
  return addDays;
};

// Tính toán ngày tương ứng với vị trí con trỏ chuột trên timeline.
const getDateByMousePosition = (context: GanttContextProps, mouseX: number) => {
  const timelineStartDate = new Date(context.timelineData[0].year, 0, 1);
  const columnWidth = (context.columnWidth * context.zoom) / 100;
  const offset = Math.floor(mouseX / columnWidth);
  const daysIn = getsDaysIn(context.range);
  const addRange = getAddRange(context.range);
  const month = addRange(timelineStartDate, offset);
  const daysInMonth = daysIn(month);
  const pixelsPerDay = Math.round(columnWidth / daysInMonth);
  const dayOffset = Math.floor((mouseX % columnWidth) / pixelsPerDay);
  return addDays(month, dayOffset);
};

// Tạo dữ liệu timeline ban đầu (năm trước, năm nay, năm sau).
const createInitialTimelineData = (today: Date): TimelineData => {
  const data: TimelineData = [
    { year: today.getFullYear() - 1, quarters: [] },
    { year: today.getFullYear(), quarters: [] },
    { year: today.getFullYear() + 1, quarters: [] },
  ];
  for (const yearObj of data) {
    yearObj.quarters = Array.from({ length: 4 }).map((_, quarterIndex) => ({
      months: Array.from({ length: 3 }).map((_, monthIndex) => {
        const month = quarterIndex * 3 + monthIndex;
        return { days: getDaysInMonth(new Date(yearObj.year, month, 1)) };
      }),
    }));
  }
  return data;
};

// Tính toán vị trí offset (tính bằng pixel) của một ngày trên timeline.
const getOffset = (date: Date, timelineStartDate: Date, context: GanttContextProps) => {
  const parsedColumnWidth = (context.columnWidth * context.zoom) / 100;
  const differenceIn = getDifferenceIn(context.range);
  const startOf = getStartOf(context.range);
  const fullColumns = differenceIn(startOf(date), timelineStartDate);

  if (context.range === 'daily') {
    return parsedColumnWidth * fullColumns;
  }

  const partialColumns = date.getDate();
  const daysInMonth = getDaysInMonth(date);
  const pixelsPerDay = parsedColumnWidth / daysInMonth;
  return fullColumns * parsedColumnWidth + partialColumns * pixelsPerDay;
};

// Tính toán chiều rộng (tính bằng pixel) của một thanh công việc.
const getWidth = (startAt: Date, endAt: Date | null, context: GanttContextProps) => {
  const parsedColumnWidth = (context.columnWidth * context.zoom) / 100;
  if (!endAt) return parsedColumnWidth * 2; // Mặc định nếu không có ngày kết thúc.

  const differenceIn = getDifferenceIn(context.range);
  if (context.range === 'daily') {
    const delta = differenceIn(endAt, startAt);
    return parsedColumnWidth * (delta || 1);
  }

  const daysInStartMonth = getDaysInMonth(startAt);
  const pixelsPerDayInStartMonth = parsedColumnWidth / daysInStartMonth;
  if (isSameDay(startAt, endAt)) return pixelsPerDayInStartMonth;

  const innerDifferenceIn = getInnerDifferenceIn(context.range);
  const startOf = getStartOf(context.range);
  if (isSameDay(startOf(startAt), startOf(endAt))) {
    return innerDifferenceIn(endAt, startAt) * pixelsPerDayInStartMonth;
  }

  const startRangeOffset = daysInStartMonth - getDate(startAt);
  const endRangeOffset = getDate(endAt);
  const fullRangeOffset = differenceIn(startOf(endAt), startOf(startAt));
  const daysInEndMonth = getDaysInMonth(endAt);
  const pixelsPerDayInEndMonth = parsedColumnWidth / daysInEndMonth;

  return (
    (fullRangeOffset - 1) * parsedColumnWidth +
    startRangeOffset * pixelsPerDayInStartMonth +
    endRangeOffset * pixelsPerDayInEndMonth
  );
};

// Tính toán offset bên trong một cột (ví dụ: ngày 15 trong cột tháng).
const calculateInnerOffset = (date: Date, range: Range, columnWidth: number) => {
  const startOf = getStartOf(range);
  const endOf = getEndOf(range);
  const differenceIn = getInnerDifferenceIn(range);
  const totalRangeDays = differenceIn(endOf(date), startOf(date));
  const dayOfMonth = date.getDate();
  return (dayOfMonth / totalRangeDays) * columnWidth;
};

// --- REACT CONTEXT ---
const GanttContext = createContext<GanttContextProps>({
  zoom: 100,
  range: 'monthly',
  columnWidth: 50,
  headerHeight: 60,
  sidebarWidth: 300,
  rowHeight: 36,
  onAddItem: undefined,
  placeholderLength: 2,
  timelineData: [],
  ref: null,
  scrollToFeature: undefined,
});

// --- GANTT COMPONENTS ---

// Component Header chung cho Timeline
export const GanttContentHeader: FC<any> = ({ title, columns, renderHeaderItem }) => {
  const id = useId();
  return (
    <div className="sticky top-0 z-20 grid w-full shrink-0 bg-backdrop/90 backdrop-blur-sm" style={{ height: 'var(--gantt-header-height)' }}>
      <div>
        <div className="sticky inline-flex whitespace-nowrap px-3 py-2 text-muted-foreground text-xs" style={{ left: 'var(--gantt-sidebar-width)' }}>
          <p>{title}</p>
        </div>
      </div>
      <div className="grid w-full" style={{ gridTemplateColumns: `repeat(${columns}, var(--gantt-column-width))` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <div className="shrink-0 border-border/50 border-b py-1 text-center text-xs" key={`${id}-${index}`}>
            {renderHeaderItem(index)}
          </div>
        ))}
      </div>
    </div>
  );
};

// Các component Header cụ thể cho từng `range`
const DailyHeader: FC = () => { /* ... */ };
const MonthlyHeader: FC = () => { /* ... */ };
const QuarterlyHeader: FC = () => { /* ... */ };

const headers: Record<Range, FC> = { daily: DailyHeader, monthly: MonthlyHeader, quarterly: QuarterlyHeader };

// Component GanttHeader chính, chọn header phù hợp để render.
export const GanttHeader: FC<any> = ({ className }) => {
  const gantt = useContext(GanttContext);
  const Header = headers[gantt.range];
  return <div className={cn('-space-x-px flex h-full w-max divide-x divide-border/50', className)}><Header /></div>;
};

// Component Item trong Sidebar của Gantt
export const GanttSidebarItem: FC<GanttSidebarItemProps> = ({ feature, onSelectItem, className }) => {
  const gantt = useContext(GanttContext);
  const duration = feature.endAt ? formatDistance(feature.startAt, feature.endAt) : "In progress";
  
  // Khi click, cuộn timeline đến feature tương ứng.
  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      gantt.scrollToFeature?.(feature);
      onSelectItem?.(feature.id);
    }
  };
  
  return (
    <div onClick={handleClick} /* ... */ >
      {/* ... nội dung item ... */}
    </div>
  );
};

// Các component xây dựng Sidebar của Gantt
export const GanttSidebarHeader: FC = () => { /* ... */ };
export const GanttSidebarGroup: FC<any> = ({ children, name, className }) => { /* ... */ };
export const GanttSidebar: FC<any> = ({ children, className }) => { /* ... */ };

// Component hiển thị các cột nền của timeline
export const GanttColumn: FC<any> = ({ index, isColumnSecondary }) => { /* ... */ };
export const GanttColumns: FC<any> = ({ columns, isColumnSecondary }) => { /* ... */ };

// --- FEATURE ITEM & ROW (Logic hiển thị và tương tác với thanh công việc) ---

// Component cho một thanh công việc (feature)
export const GanttFeatureItem: FC<GanttFeatureItemProps> = ({ onMove, children, className, ...feature }) => {
  const gantt = useContext(GanttContext);
  const [startAt, setStartAt] = useState<Date>(feature.startAt);
  const [endAt, setEndAt] = useState<Date | null>(feature.endAt);

  // Tính toán chiều rộng và vị trí offset, được memoize để tối ưu hiệu năng.
  const width = useMemo(() => getWidth(startAt, endAt, gantt), [startAt, endAt, gantt]);
  const offset = useMemo(() => getOffset(startAt, new Date(gantt.timelineData[0].year, 0, 1), gantt), [startAt, gantt]);

  // Sử dụng dnd-kit để xử lý kéo-thả
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });

  // Hàm được gọi khi kết thúc kéo-thả, cập nhật state ở component cha.
  const onDragEnd = useCallback(() => onMove?.(feature.id, startAt, endAt), [onMove, feature.id, startAt, endAt]);

  // Các hàm xử lý khi kéo-thả (di chuyển toàn bộ, thay đổi ngày bắt đầu, thay đổi ngày kết thúc).
  const handleItemDragMove = useCallback(() => { /* ... */ }, [/* ... */]);
  const handleLeftDragMove = useCallback(() => { /* ... */ }, [/* ... */]);
  const handleRightDragMove = useCallback(() => { /* ... */ }, [/* ... */]);

  return (
    <div className="relative ..." style={{ height: 'var(--gantt-row-height)' }}>
      <div className="absolute ..." style={{ width: Math.round(width), left: Math.round(offset) }}>
        {/* Tay nắm kéo bên trái */}
        <DndContext onDragMove={handleLeftDragMove} onDragEnd={onDragEnd} sensors={[mouseSensor]}>
          <GanttFeatureDragHelper direction="left" featureId={feature.id} date={startAt} />
        </DndContext>
        {/* Thân của thanh công việc (có thể kéo di chuyển) */}
        <DndContext onDragMove={handleItemDragMove} onDragEnd={onDragEnd} sensors={[mouseSensor]}>
          <GanttFeatureItemCard id={feature.id}>{children ?? <p>{feature.name}</p>}</GanttFeatureItemCard>
        </DndContext>
        {/* Tay nắm kéo bên phải */}
        <DndContext onDragMove={handleRightDragMove} onDragEnd={onDragEnd} sensors={[mouseSensor]}>
          <GanttFeatureDragHelper direction="right" featureId={feature.id} date={endAt} />
        </DndContext>
      </div>
    </div>
  );
};

// Component cho một hàng, chứa các thanh công việc.
export const GanttFeatureRow: FC<GanttFeatureRowProps> = ({ features, onMove, children, className }) => {
  // **LOGIC QUAN TRỌNG: Xử lý chồng chéo (overlapping)**
  const sortedFeatures = [...features].sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
  const featureWithPositions = [];
  const subRowEndTimes: Date[] = []; // Mảng lưu thời điểm kết thúc của công việc cuối cùng trên mỗi hàng phụ.

  for (const feature of sortedFeatures) {
    let subRow = 0;
    // Tìm hàng phụ (sub-row) đầu tiên mà công việc này có thể được đặt vào mà không chồng chéo.
    while (subRow < subRowEndTimes.length && subRowEndTimes[subRow] > feature.startAt) {
      subRow++;
    }
    // Cập nhật thời điểm kết thúc cho hàng phụ này.
    subRowEndTimes[subRow] = feature.endAt;
    featureWithPositions.push({ ...feature, subRow });
  }

  const maxSubRows = Math.max(1, subRowEndTimes.length);
  const subRowHeight = 36;

  // Render các GanttFeatureItem vào đúng vị trí hàng phụ của chúng.
  return (
    <div className={cn('relative', className)} style={{ height: `${maxSubRows * subRowHeight}px`, minHeight: 'var(--gantt-row-height)' }}>
      {featureWithPositions.map((feature) => (
        <div key={feature.id} className="absolute w-full" style={{ top: `${feature.subRow * subRowHeight}px`, height: `${subRowHeight}px` }}>
          <GanttFeatureItem {...feature} onMove={onMove}>{children ? children(feature) : <p>{feature.name}</p>}</GanttFeatureItem>
        </div>
      ))}
    </div>
  );
};

// Các component container khác
export const GanttFeatureListGroup: FC<any> = ({ children, className }) => { /* ... */ };
export const GanttFeatureList: FC<any> = ({ children, className }) => { /* ... */ };

// Component cho một mốc thời gian (marker)
export const GanttMarker: FC<any> = memo(({ label, date, id, onRemove, className }) => { /* ... */ });
GanttMarker.displayName = 'GanttMarker';

// --- GANTT PROVIDER (Component Cha) ---
export const GanttProvider: FC<GanttProviderProps> = ({ zoom = 100, range = 'monthly', onAddItem, children, className }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [timelineData, setTimelineData] = useState<TimelineData>(createInitialTimelineData(new Date()));
  const [, setScrollX] = useGanttScrollX();
  const [sidebarWidth, setSidebarWidth] = useState(0);
  // ... các config khác

  // Memoize các biến CSS để tối ưu.
  const cssVariables = useMemo(() => ({ /* ... */ }), [zoom, columnWidth, sidebarWidth]);

  // Cuộn đến giữa timeline khi tải lần đầu.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 2 - scrollRef.current.clientWidth / 2;
      setScrollX(scrollRef.current.scrollLeft);
    }
  }, [setScrollX]);

  // **LOGIC QUAN TRỌNG: Cuộn vô hạn (Infinite Scroll)**
  const handleScroll = useCallback(throttle(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
    setScrollX(scrollLeft);

    // Nếu cuộn đến đầu, thêm dữ liệu năm cũ vào `timelineData`.
    if (scrollLeft === 0) {
      const firstYear = timelineData[0]?.year;
      if (!firstYear) return;
      const newTimelineData: TimelineData = [{ year: firstYear - 1, /* ... */ }, ...timelineData];
      setTimelineData(newTimelineData);
      // ...
    } 
    // Nếu cuộn đến cuối, thêm dữ liệu năm mới vào `timelineData`.
    else if (scrollLeft + clientWidth >= scrollWidth) {
      const lastYear = timelineData.at(-1)?.year;
      if (!lastYear) return;
      const newTimelineData: TimelineData = [...timelineData, { year: lastYear + 1, /* ... */ }];
      setTimelineData(newTimelineData);
      // ...
    }
  }, 100), []);

  // Gán và hủy sự kiện cuộn.
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) scrollElement.addEventListener('scroll', handleScroll);
    return () => {
      if (scrollElement) scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Hàm để cuộn đến một feature cụ thể.
  const scrollToFeature = useCallback((feature: GanttFeature) => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;
    const timelineStartDate = new Date(timelineData[0].year, 0, 1);
    const offset = getOffset(feature.startAt, timelineStartDate, { /* ... */ });
    scrollElement.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
  }, [timelineData, /* ... */]);

  // Cung cấp tất cả state và hàm qua Context.
  return (
    <GanttContext.Provider value={{ zoom, range, /* ... */, scrollToFeature }}>
      <div ref={scrollRef} className={cn('gantt ...')} style={{ ...cssVariables, gridTemplateColumns: 'var(--gantt-sidebar-width) 1fr' }}>
        {children}
      </div>
    </GanttContext.Provider>
  );
};

// Component container cho timeline
export const GanttTimeline: FC<any> = ({ children, className }) => { /* ... */ };

// Component đường kẻ đánh dấu ngày hôm nay
export const GanttToday: FC<any> = ({ className }) => { /* ... */ };
