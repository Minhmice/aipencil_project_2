'use client';

import { ArrowRight } from 'lucide-react';
import content from '@/content/testimonials.json';

interface TestimonialCardProps {
  statistic: string;
  description: string;
}

function TestimonialCard({ statistic, description }: TestimonialCardProps) {
  return (
    <div className="relative bg-gradient-to-br from-[#C00] via-[#C00] to-[#FA8888] rounded-[32px] p-16 min-h-[640px] flex flex-col justify-end">
      <button className="absolute top-10 right-10 w-24 h-24 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
        <ArrowRight className="w-8 h-8 text-gray-600" />
      </button>
      <div className="space-y-6">
        <h3 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
          {statistic}
        </h3>
        <p className="text-lg lg:text-xl text-[#D7D7D7] leading-relaxed max-w-lg">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="bg-[#C00] py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-5xl lg:text-7xl font-bold text-white leading-tight max-w-2xl">
            {content.title}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {content.testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              statistic={testimonial.statistic}
              description={testimonial.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
