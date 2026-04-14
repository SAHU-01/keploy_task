"use client";

import React, { useState } from "react";
import { useTutorialStore } from "../../../store/useTutorialStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Copy, Check } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CodeGroup = ({ children }: { children: React.ReactNode }) => {

  const childrenArray = React.Children.toArray(children);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeCodeSnippet = useTutorialStore(state => state.activeCodeSnippet);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (activeCodeSnippet) {
      navigator.clipboard.writeText(activeCodeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-6 rounded-xl border border-border bg-muted/30 backdrop-blur-md overflow-hidden shadow-sm min-w-0 group/codegroup">
      <div className="flex items-center justify-between border-b border-border bg-muted/50">
        <div className="flex overflow-x-auto custom-scrollbar no-scrollbar">
          {childrenArray.map((child, i) => {
            const element = child as React.ReactElement<{ label?: string; filename?: string }>;
            return (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "px-4 py-2.5 text-xs font-semibold transition-all border-b-2 shrink-0",
                  activeIndex === i 
                    ? "border-accent text-accent bg-background/50" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {element.props.label || element.props.filename}
              </button>
            );
          })}
        </div>
        <button
          onClick={handleCopy}
          className="mr-2 p-1.5 rounded-md text-zinc-400 hover:text-[#FF914D] hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all opacity-0 group-hover/codegroup:opacity-100"
          title="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-[#FF914D]" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <div className="p-0 min-w-0">
        {childrenArray[activeIndex]}
      </div>
    </div>
  );
};
