"use client";

import FeatureCard from "@/components/feature-card";
import content from "@/content/solutions-section.json";

export default function SolutionsSection() {
  return (
    <section className="relative bg-gradient-to-b from-transparent via-gray-200/20 to-gray-200 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Power Bundle Header */}
        <div className="text-center mb-20">
          <div className="relative inline-block">
            <h2 className="text-9xl md:text-[176px] font-semibold text-gray-400/40 leading-none">
              {content.header.top}
            </h2>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#C00] to-[#800000] transform translate-x-[-10px] translate-y-[10px] rounded-sm"></div>
                <h2 className="relative text-6xl md:text-9xl font-semibold text-black leading-none px-2 bg-white/90 rounded-sm">
                  {content.header.bottom}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-20">
          {content.sections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl p-16 shadow-lg">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div>
                    <span className="text-gray-500 text-3xl font-normal">
                      {section.pretitle}
                    </span>
                    <div className="flex items-center gap-4 mt-4 flex-wrap">
                      <h3 className="text-4xl md:text-6xl font-semibold text-black">
                        {section.title_part1}
                      </h3>
                      {section.title_conjunction && (
                        <span className="text-2xl md:text-3xl font-semibold text-black">
                          {section.title_conjunction}
                        </span>
                      )}
                      <div className="bg-[#C00] text-white px-8 py-4 rounded-lg">
                        <span className="text-4xl md:text-6xl font-semibold">
                          {section.title_part2}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xl text-black leading-relaxed max-w-2xl">
                    {section.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mt-12">
                    {section.features.map((feature, featureIndex) => (
                      <FeatureCard
                        key={featureIndex}
                        icon={<div className="w-6 h-6 bg-[#C00] rounded-sm"></div>}
                        title={feature.title}
                        description={feature.description}
                      />
                    ))}
                  </div>
                </div>

                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="rounded-2xl border border-gray-400 shadow-2xl overflow-hidden bg-white">
                    <img
                      src={section.image.src}
                      alt={section.image.alt}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Bottom Two Cards */}
          <div className="grid lg:grid-cols-2 gap-8">
            {content.cards.map((card, index) => (
              <div key={index} className="bg-white rounded-2xl border-2 border-gray-400 p-10 shadow-lg">
                <div className="space-y-8">
                  <div className="rounded-lg border border-gray-400 shadow-lg overflow-hidden bg-blue-900 h-64 flex items-center justify-center">
                    <img
                      src={card.image.src}
                      alt={card.image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <span className="text-gray-500 text-2xl md:text-3xl font-normal">
                        {card.pretitle}
                      </span>
                      <h3 className="text-3xl md:text-5xl font-semibold text-black mt-4">
                        {card.title}
                      </h3>
                    </div>

                    <p className="text-lg text-black leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
