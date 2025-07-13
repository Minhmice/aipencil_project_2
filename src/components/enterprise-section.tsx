"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import content from "@/content/enterprise-section.json";

const parseDescription = (description: string) => {
  const parts = description.split(/({professionalServices}|{certifiedPartners}|{appMarketplace})/g);
  return parts.map((part, index) => {
    if (part === "{professionalServices}") {
      return <span key={index} className="text-[#C00]">professional services</span>;
    }
    if (part === "{certifiedPartners}") {
      return <span key={index} className="text-[#C00]">certified partners</span>;
    }
    if (part === "{appMarketplace}") {
      return <span key={index} className="text-[#C00]">AI Pencil App Marketplace</span>;
    }
    return part;
  });
};

export default function EnterpriseSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Content */}
        <div className="mb-16">
          <p className="text-[#C00] text-3xl font-semibold mb-4">
            {content.pretitle}
          </p>
          <h2 className="text-4xl lg:text-6xl font-bold text-black mb-8 max-w-4xl">
            {content.title}
          </h2>
          <p className="text-2xl lg:text-3xl text-gray-600 leading-relaxed max-w-6xl mb-12">
            {parseDescription(content.description)}
          </p>

          {/* CTA Button */}
          <Button className="bg-[#C00] hover:bg-[#A00] text-white font-semibold text-xl px-8 py-6 rounded-full flex items-center gap-2">
            <span>{content.cta.text}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Statistics */}
          <div className="space-y-16">
            {content.statistics.map((stat, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-3xl lg:text-4xl font-semibold text-black">
                  {stat.value}
                </h3>
                <p className="text-2xl lg:text-3xl text-black leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))}

            {/* Products Used */}
            <div className="space-y-8">
              <h4 className="text-xl font-semibold text-black">
                Products used
              </h4>

              <div className="space-y-4">
                {content.products.map((product, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center"
                      style={{ backgroundColor: product.iconColor }}
                    >
                      <div className="w-4 h-4 bg-white rounded-sm"></div>
                    </div>
                    <span className="text-xl font-semibold text-black">
                      {product.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Case Study */}
          <div className="relative">
            <div className="bg-gradient-to-br from-pink-200 via-red-300 to-red-500 rounded-2xl p-8 min-h-[720px] relative overflow-hidden">
              {/* Background Elements */}
              <div className="absolute top-4 left-4 text-gray-600 opacity-60">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xs">10</span>
                  </div>
                  <span className="text-sm font-medium">10 EDUCATION</span>
                </div>
              </div>

              <div className="absolute top-4 right-4 text-gray-600 opacity-60">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">10</span>
                  </div>
                  <span className="text-sm font-medium">10 EDUCATION</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="space-y-4">
                  <div className="bg-[#C00] text-white px-4 py-2 rounded font-bold text-lg inline-block">
                    {content.caseStudy.tag}
                  </div>

                  <h3 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                    {content.caseStudy.title.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < content.caseStudy.title.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </h3>

                  <p className="text-xl text-white font-semibold">
                    {content.caseStudy.description}
                  </p>

                  <button className="text-white font-medium hover:underline flex items-center gap-2">
                    <span>{content.caseStudy.link.text}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Person Image Placeholder */}
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <div className="w-32 h-32 bg-white/20 rounded-full"></div>
              </div>

              {/* Decorative Stars */}
              <div className="absolute top-1/4 left-1/4 text-white text-2xl">
                ✦
              </div>
              <div className="absolute top-1/3 right-1/3 text-white text-lg">
                ✦
              </div>
            </div>
          </div>
        </div>

        {/* Company Logos */}
        <div className="mt-20 pt-16 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {content.logos.map((logo, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className={`text-2xl font-bold ${logo.color}`}>
                  {logo.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
