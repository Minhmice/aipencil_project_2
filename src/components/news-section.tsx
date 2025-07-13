"use client";

import { Button } from "@/components/ui/button";
import NewsCard from "@/components/news-card";
import content from "@/content/news-section.json";

const newsVisuals = [
  <div className="bg-white border border-gray-400 rounded-lg p-8 h-80 relative overflow-hidden">
    {/* Dashboard Cards */}
    <div className="absolute top-4 right-4">
      <div className="w-16 h-16 bg-[#41E88D] rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
    </div>

    {/* Chart Card - Rotated */}
    <div className="absolute top-20 left-8 transform rotate-6">
      <div className="bg-white border-2 border-[#C00] rounded-xl p-4 w-48 h-36">
        <div className="flex items-center gap-2 mb-3">
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <div className="space-y-1">
          <div className="flex items-end gap-1">
            <div className="w-6 h-4 bg-[#C00] rounded-sm"></div>
            <div className="w-6 h-8 bg-[#C00] rounded-sm"></div>
            <div className="w-6 h-12 bg-[#C00] rounded-sm"></div>
            <div className="w-6 h-16 bg-[#C00] rounded-sm"></div>
          </div>
        </div>
        <div className="text-sm font-bold mt-2">2,100</div>
      </div>
    </div>

    {/* Analytics Card */}
    <div className="absolute bottom-16 right-8 transform -rotate-3">
      <div className="bg-white border border-[#C00] rounded-lg p-3 w-32 h-40">
        <div className="w-14 h-14 bg-[#32CAFD] rounded-full mx-auto mb-3 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
          </svg>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">85</div>
          <div className="text-sm text-gray-600">Complete</div>
        </div>
      </div>
    </div>
  </div>,
  <div className="bg-white border border-gray-400 rounded-lg p-8 h-80 relative overflow-hidden">
    {/* Star Badge */}
    <div className="absolute top-4 left-24">
      <div className="w-16 h-16 bg-[#FFC933] rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
    </div>

    {/* Dashboard Report - Rotated */}
    <div className="absolute top-16 right-4 transform rotate-12">
      <div className="bg-white border-2 border-[#C00] rounded-xl p-4 w-56 h-44">
        <div className="text-sm font-bold mb-3">Dashboard Report</div>
        <div className="space-y-4">
          {/* Chart Lines */}
          <div className="space-y-2">
            <div className="h-px bg-[#C00]"></div>
            <div className="h-px bg-[#C00]"></div>
            <div className="h-px bg-[#C00]"></div>
            <div className="h-px bg-[#C00]"></div>
          </div>
          {/* Y-axis labels */}
          <div className="text-xs space-y-2">
            <div>100</div>
            <div>60</div>
            <div>30</div>
            <div>0</div>
          </div>
          {/* Chart curves */}
          <svg className="w-full h-20" viewBox="0 0 200 80">
            <path
              d="M10 60 Q50 40 100 45 T190 30"
              stroke="#32CAFD"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M10 70 Q50 50 100 55 T190 40"
              stroke="#CC0000"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>

    {/* Project Card */}
    <div className="absolute bottom-16 left-8 transform -rotate-3">
      <div className="bg-white border border-[#C00] rounded-lg p-3 w-32 h-40">
        <div className="w-14 h-14 bg-[#C00] rounded-full mx-auto mb-3 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 11H7v9h2v-9zm4-4H11v13h2V7zm4-3h-2v16h2V4z" />
          </svg>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">134</div>
          <div className="text-sm text-gray-600">Project</div>
        </div>
      </div>
    </div>
  </div>,
  <div className="bg-white border border-gray-400 rounded-lg p-8 h-80 relative overflow-hidden">
    {/* Circular Chart - Rotated */}
    <div className="absolute top-8 left-8 transform rotate-6">
      <div className="bg-white border-2 border-[#C00] rounded-xl p-4 w-48 h-56">
        {/* Donut Chart */}
        <div className="w-32 h-32 mx-auto mb-4 relative">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#41E88D"
              strokeWidth="8"
              strokeDasharray="180 283"
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#C00"
              strokeWidth="8"
              strokeDasharray="90 283"
              strokeDashoffset="-180"
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#32CAFD"
              strokeWidth="8"
              strokeDasharray="113 283"
              strokeDashoffset="-270"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xl font-bold">264K</div>
            <div className="text-xs text-gray-600">Sales</div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#32CAFD] rounded-full border border-[#C00]"></div>
            <div className="h-px bg-[#C00] flex-1"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#7214FF] rounded-full border border-[#C00]"></div>
            <div className="h-px bg-[#C00] flex-1"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#41E88D] rounded-full border border-[#C00]"></div>
            <div className="h-px bg-[#C00] flex-1"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Blue Star Badge */}
    <div className="absolute top-4 right-4">
      <div className="w-16 h-16 bg-[#2D55FB] rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
    </div>

    {/* Assigned Card */}
    <div className="absolute bottom-16 right-8 transform -rotate-3">
      <div className="bg-white border border-[#C00] rounded-lg p-3 w-32 h-40">
        <div className="w-14 h-14 bg-[#DF2DB1] rounded-full mx-auto mb-3 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">45</div>
          <div className="text-sm text-gray-600">Assigned</div>
        </div>
      </div>
    </div>
  </div>,
];

export default function NewsSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16 gap-8">
          <h2 className="text-5xl lg:text-7xl font-bold text-black leading-tight tracking-tight">
            {content.title}
          </h2>
          <Button className="bg-gradient-to-r from-[#C00] to-[#800000] hover:from-[#A00] text-white font-bold text-xl px-8 py-6 rounded-full w-fit">
            {content.buttonText}
          </Button>
        </div>

        {/* News Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {content.news.map((item, index) => (
            <NewsCard
              key={index}
              visual={newsVisuals[index]}
              title={item.title}
              description={item.description}
              date={item.date}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
