import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="space-y-4">
      <div className="w-12 h-12 bg-white border-4 border-[#C00] rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h4 className="text-xl font-semibold text-black">{title}</h4>
      <p className="text-base text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
