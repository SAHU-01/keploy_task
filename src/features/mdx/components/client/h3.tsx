"use client";

import React, { useEffect, useRef } from "react";
import { useTutorialStore } from "@/features/tutorial-core/store/use-tutorial-store";

export const H3 = ({ children }: { children: React.ReactNode }) => {
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

  const text = extractText(children);
  const id = text ? text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") : undefined;
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

  return <h3 id={id} ref={ref} className="text-xl font-bold text-foreground mb-2 mt-6 break-words scroll-mt-20">{children}</h3>;
};
