import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface NewsCardProps {
  visual: ReactNode;
  title: string;
  description: string;
  date: string;
}

export default function NewsCard({ visual, title, description, date }: NewsCardProps) {
  return (
    <div className="bg-[#F1F0EE] border border-gray-400 rounded-lg p-8 space-y-6">
      {visual}
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-3xl lg:text-4xl font-bold text-black leading-tight">
            {title}
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="h-px bg-[#C00]"></div>
        <div className="flex items-center justify-between">
          <span className="text-lg text-gray-600">{date}</span>
          <button className="flex items-center gap-2 text-lg text-gray-600 hover:text-gray-800 transition-colors">
            <span>Read more</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
