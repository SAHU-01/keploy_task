"use client";

import React, { useEffect, useRef } from "react";
import { useTutorialStore } from "../../../store/useTutorialStore";

export const H2 = ({ children }: { children: React.ReactNode }) => {
  const id = typeof children === "string" ? children.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") : undefined;
  const setActiveSection = useTutorialStore(state => state.setActiveSection);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!id) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          setActiveSection(id);
        }
      },
      { 
        threshold: [0, 0.1],
        rootMargin: "-10% 0px -40% 0px"
      }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [id, setActiveSection]);

  return <h2 id={id} ref={ref} className="text-2xl font-bold text-foreground mb-4 mt-8 break-words scroll-mt-20">{children}</h2>;
};
