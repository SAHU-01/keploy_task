"use client";

import React, { useEffect } from "react";
import { useRef } from "react";
import { useTutorialStore } from "../../../store/useTutorialStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CodeTriggerProps {
  file: string;
  lines?: [number, number];
  children: React.ReactNode;
  className?: string;
}

export const CodeTrigger = ({ file, lines, children, className }: CodeTriggerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const setActiveCode = useTutorialStore((state) => state.setActiveCode);
  const [isInView, setIsInView] = React.useState(false);
  const linesString = JSON.stringify(lines);
  
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        const minRatio = isMobile ? 0.5 : 0.1;
        if (entry.isIntersecting && entry.intersectionRatio > minRatio) {
          setActiveCode(file, lines);
        }
      },
      { 
        threshold: isMobile ? [0, 0.5, 0.7] : [0, 0.1, 0.2],
        rootMargin: isMobile ? "-20% 0px -20% 0px" : "-10% 0px -40% 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [file, linesString, setActiveCode, lines]);

  return (
    <div 
      ref={ref} 
      className={cn(
        "relative transition-opacity duration-300", 
        isInView ? "opacity-100" : "opacity-60",
        className
      )}
    >
      {children}
    </div>
  );
};
