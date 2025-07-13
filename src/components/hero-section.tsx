"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import content from "@/content/hero-section.json" assert { type: "json" };
import { gsap } from "gsap";

export default function HeroSection() {
  const [email, setEmail] = useState("");
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Handle form submission
      console.log("Email submitted:", email);
      // You can add your API call here
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto p-8 md:p-16 relative gap-8 grid-rows-2 text-white">
        <div className="flex flex-col md:flex-row">
          {/* Left Column - Content */}
          <div className="space-y-8 w-3/4 md:w-1/2">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-7xl  font-semibold  leading-none">
              {content.title}
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl font-normal leading-relaxed max-w-xl">
              {content.subtitle}
            </p>

            {/* Email CTA Form */}
            <form onSubmit={handleSubmit} className="">
              <div className="relative max-w-2xl">
                <div className="flex items-center bg-white/50 backdrop-blur-sm border border-gray-400 rounded-[40px] shadow-lg p-2.5 pr-2.5">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={content.cta.placeholder}
                    className="flex-1 bg-transparent text-xl md:text-2xl text-black placeholder-black/70 px-8 py-4 focus:outline-none border-none shadow-none focus-visible:ring-0"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-[#C00] hover:bg-[#A00] text-white font-bold text-xl md:text-2xl px-8 py-6 h-auto rounded-[31px] flex items-center gap-2 shadow-none"
                  >
                    <span>{content.cta.buttonText}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Dashboard Image */}
          <div className="relative w-full md:w-1/2 hidden md:block">
            <div className="relative">
              {/* Dashboard Container with Shadow */}
              <div className="relative rounded-[18px] shadow-2xl overflow-hidden bg-white">
                {/* Use one of the provided dashboard images */}
                <img
                  ref={imageRef}
                  src={content.image.src}
                  alt={content.image.alt}
                  className="w-full h-auto aspect-[1672/862] object-cover opacity-0"
                />
              </div>

              {/* Optional: Add some floating elements for visual interest */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-br from-red-100/30 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-gradient-to-tr from-blue-100/20 to-transparent rounded-full blur-3xl -z-10"></div>
    </section>
  );
}
