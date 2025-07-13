"use client";

import { useRef } from "react";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import SolutionsSection from "@/components/solutions-section";
import NewsSection from "@/components/news-section";
import TestimonialsSection from "@/components/testimonials-section";
import EnterpriseSection from "@/components/enterprise-section";
import Comp2 from "@/animation/Comp 2.json";
import Lottie from "lottie-react";

export default function Home() {
  const navRef = useRef<HTMLElement | null>(null);

  return (
    <div>
      <Navbar navRef={navRef} />
      <div className="=h-full md:h-fit mx-auto absolute -z-10 ">
        <Lottie animationData={Comp2} loop={true} />
      </div>
      <HeroSection />
      <SolutionsSection />
      <NewsSection />
      <TestimonialsSection />
      <EnterpriseSection />
    </div>
  );
}
