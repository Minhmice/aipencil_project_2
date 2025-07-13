"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { RefObject } from "react";
import { gsap } from "gsap";

interface NavbarProps {
  navRef: RefObject<HTMLElement | null>;
}

export default function Navbar({ navRef }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const el = mobileMenuRef.current;
    if (!el) return;

    if (isMobileMenuOpen) {
      el.style.display = "block";
      gsap.fromTo(
        el,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    } else {
      gsap.to(el, {
        y: -20,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          if (el) el.style.display = "none";
        },
      });
    }
  }, [isMobileMenuOpen]);

  return (
    <nav
      ref={navRef}
      className={`top-0 w-full sticky z-50 transition-all duration-300 ${
        scrolled ? "bg-[#800000] h-[60px]" : "bg-[#cc0000] h-[80px]"
      }`}
    >
      <div className=" mx-auto px-8 md:px-16 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-12 h-12 md:w-16 md:h-16">
              <svg
                width="800"
                height="800"
                viewBox="0 0 800 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path
                  d="M538.767 186.026H637L587.884 137L538.767 186.026Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M538.767 615V590.487H637V615H538.767Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M317.744 578.231L415.977 480.179H538.767V333.103L256.349 615H109L526.488 198.282H637V578.231H317.744ZM600.163 565.974H612.442V210.538H600.163V565.974ZM563.326 565.974H575.605V210.538H563.326V565.974Z"
                  fill="white"
                />
              </svg>
            </div>
            <span className="text-white font-bold text-lg md:text-2xl font-montserrat">
              AI PENCIL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 text-sx">
            {["Product", "Solution"].map((label) => (
              <DropdownMenu key={label}>
                <DropdownMenuTrigger className="flex items-center space-x-2 text-white font-semibold  hover:opacity-50 transition-opacity">
                  <span>{label}</span>
                  <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>{label} 1</DropdownMenuItem>
                  <DropdownMenuItem>{label} 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
            {["Resource", "Pricing"].map((item) => (
              <button
                key={item}
                className="text-white font-semibold hover:opacity-80 transition-opacity"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="text-white font-semibold text-lg hover:opacity-80 transition-opacity">
              Book a demo
            </button>
            <Button className="cursor-pointer bg-white text-[#800000] font-semibold text-xl border-white hover:bg-[#800000] hover:text-white px-6 py-2 h-10 ">
              Sign up free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-white p-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu (always rendered) */}
        <div
          ref={mobileMenuRef}
          style={{ display: "none" }}
          className="lg:hidden absolute top-full left-0 w-full bg-[#C00] border-t border-red-700 z-50"
        >
          <div className="px-4 py-6 space-y-4">
            {["Product", "Solution"].map((label) => (
              <DropdownMenu key={label}>
                <DropdownMenuTrigger className="flex items-center justify-between w-full text-white font-semibold text-lg py-2">
                  <span>{label}</span>
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>{label} 1</DropdownMenuItem>
                  <DropdownMenuItem>{label} 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}

            {["Resource", "Pricing"].map((item) => (
              <button
                key={item}
                className="block w-full text-left text-white font-semibold text-lg py-2"
              >
                {item}
              </button>
            ))}

            <div className="pt-4 space-y-3 border-t border-red-700">
              <button className="block w-full text-left text-white font-semibold text-lg py-2">
                Book a demo
              </button>
              <Button
                variant="outline"
                className="w-full bg-white text-[#800000] font-semibold text-lg hover:bg-gray-100 hover:text-[#800000] rounded-2xl py-2 h-12"
              >
                Sign up free
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
