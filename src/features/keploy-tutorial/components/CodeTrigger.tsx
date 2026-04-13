"use client";

import React, { useEffect } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTutorialStore } from "../store/useTutorialStore";

interface CodeTriggerProps {
  file: string;
  lines?: [number, number];
  children: React.ReactNode;
}

export const CodeTrigger = ({ file, lines, children }: CodeTriggerProps) => {
  const ref = useRef(null);
  const setActiveCode = useTutorialStore((state) => state.setActiveCode);
  
  const isInView = useInView(ref, {
    margin: "-20% 0px -40% 0px",
    amount: "all"
  });

  useEffect(() => {
    if (isInView) {
      setActiveCode(file, lines);
    }
  }, [isInView, file, JSON.stringify(lines), setActiveCode]);

  return (
    <div ref={ref} className="relative transition-opacity duration-300" style={{ opacity: isInView ? 1 : 0.6 }}>
      {children}
    </div>
  );
};
