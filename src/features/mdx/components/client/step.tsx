"use client";

import React, { useEffect, useRef } from "react";
import { useTutorialStore } from "@/features/tutorial-core/store/use-tutorial-store";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Step = ({ 
  number, 
  title, 
  children,
  file,
  lines
}: { 
  number: number; 
  title: string; 
  children: React.ReactNode;
  file?: string;
  lines?: [number, number];
}) => {
  const activeStep = useTutorialStore(state => state.activeStep);
  const setActiveStep = useTutorialStore(state => state.setActiveStep);
  const setActiveCode = useTutorialStore(state => state.setActiveCode);
  const searchQuery = useTutorialStore(state => state.searchQuery);
  const setActiveSection = useTutorialStore(state => state.setActiveSection);
  
  const stepRef = useRef<HTMLDivElement>(null);
  const isActive = activeStep === number;
  const linesString = JSON.stringify(lines);

  const isCompleted = activeStep > number;
  const isSearchMatch = React.useMemo(() => {
    if (!searchQuery) return false;
    const query = searchQuery.toLowerCase();
    
    if (title.toLowerCase().includes(query)) return true;
    
    // Improved children string conversion
    const extractText = (node: React.ReactNode): string => {
      if (!node) return "";
      if (typeof node === "string") return node;
      if (typeof node === "number") return node.toString();
      if (Array.isArray(node)) return node.map(extractText).join("");
      if (React.isValidElement(node)) {
        const props = node.props as { children?: React.ReactNode };
        if (props.children) return extractText(props.children);
      }
      return "";
    };

    const childrenString = extractText(children).toLowerCase();
    if (childrenString.includes(query)) return true;
    
    return false;
  }, [searchQuery, title, children]);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const minRatio = isMobile ? 0.4 : 0.1;
        
        if (entry.isIntersecting && entry.intersectionRatio > minRatio) {
          setActiveStep(number);
          setActiveSection(`step-${number}`);
          if (file) {
            setActiveCode(file, lines);
          }
        }
      },
      { 
        threshold: isMobile ? [0, 0.4, 0.6] : [0, 0.1, 0.2],
        rootMargin: isMobile ? "-20% 0px -20% 0px" : "-10% 0px -40% 0px"
      }
    );

    if (stepRef.current) {
      observer.observe(stepRef.current);
    }

    return () => observer.disconnect();
  }, [number, setActiveStep, setActiveSection, file, setActiveCode, linesString, lines]);

  return (
    <div 
      id={`step-${number}`}
      ref={stepRef} 
      onClick={() => setActiveStep(number)}
      className={cn(
        "flex gap-6 mb-16 relative group cursor-pointer min-w-0 overflow-visible transition-opacity duration-300 rounded-xl p-6 -mx-6 scroll-mt-20",
        isSearchMatch && !isActive && "ring-2 ring-accent/50 bg-accent/5 animate-pulse"
      )}
    >
      <div className={cn(
        "absolute -left-[32px] top-0 bottom-0 w-[2px] transition-all duration-300",
        isActive ? "bg-[#FF914D] opacity-100" : "bg-transparent opacity-0"
      )} />

      <div className="flex flex-col items-center shrink-0 w-10 overflow-visible">
        <div className={cn(
          "w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-sm z-10 transition-colors duration-300",
          (isActive || isCompleted)
            ? "border-[#FF914D] bg-[#FF914D] text-white shadow-[0_0_20px_rgba(255,145,77,0.4)]" 
            : "border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 bg-background group-hover:border-zinc-300 dark:group-hover:border-zinc-700"
        )}>
          {number}
        </div>
        <div className={cn(
          "w-[2px] h-full absolute top-9 group-last:hidden transition-colors duration-300",
          isCompleted ? "bg-[#FF914D]" : "bg-border"
        )} />
      </div>
      <div className={cn(
        "flex-1 min-w-0 transition-opacity duration-300",
        isActive ? "opacity-100" : "opacity-40 hover:opacity-100"
      )}>
        <h2 className={cn(
          "text-xl font-bold mb-4 mt-0 transition-colors duration-300",
          isActive ? "text-foreground" : "text-muted-foreground"
        )}>
          {title}
        </h2>
        <div className="text-muted-foreground leading-relaxed break-words">
          {children}
        </div>
      </div>
    </div>
  );
};
