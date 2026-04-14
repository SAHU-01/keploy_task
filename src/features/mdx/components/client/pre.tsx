"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTutorialStore } from "@/features/tutorial-core/store/use-tutorial-store";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Copy, Check } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Pre = ({ children, ...props }: React.HTMLAttributes<HTMLPreElement> & { filename?: string }) => {
  const preRef = useRef<HTMLPreElement>(null);
  const setCode = useTutorialStore(state => state.setCode);
  const setActiveCode = useTutorialStore(state => state.setActiveCode);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const code = preRef.current?.innerText || "";
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const minRatio = isMobile ? 0.7 : 0.5;
        if (entry.isIntersecting && entry.intersectionRatio >= minRatio) {
          const code = preRef.current?.innerText || "";
          setCode(code);
          if (props.filename && props.filename !== "terminal") {
            setActiveCode(props.filename);
          }
        }
      },
      { threshold: isMobile ? [0, 0.7, 0.9] : 0.5 }
    );

    if (preRef.current) {
      observer.observe(preRef.current);
    }

    return () => observer.disconnect();
  }, [setCode, setActiveCode, props.filename]);

  const processContent = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === "string") {
      const lines = node.split("\n");
      return lines.map((line, i) => {
        const isAddition = line.startsWith("+");
        const isRemoval = line.startsWith("-");
        
        if (isAddition || isRemoval) {
          return (
            <div key={i} className={cn(
              "flex -mx-4 px-4 transition-colors border-l-2",
              isAddition ? "bg-green-500/10 border-green-500 diff-add" : "bg-red-500/10 border-red-500 diff-remove"
            )}>
              <span className="diff-symbol shrink-0 mr-2 opacity-40 select-none">
                {isAddition ? "+" : "-"}
              </span>
              <span className="flex-1">{line.substring(1)}</span>
            </div>
          );
        }
        return <div key={i} className="px-0">{line}</div>;
      });
    }

    if (Array.isArray(node)) {
      return node.map((child, i) => <React.Fragment key={i}>{processContent(child)}</React.Fragment>);
    }
    
    if (React.isValidElement(node)) {
      // If it's a code element (either string "code" or our Code component), process its children
      const type = node.type;
      const isCodeElement = type === "code" || (typeof type === "function" && (type as React.ComponentType).displayName === "Code");
      
      if (isCodeElement) {
        const element = node as React.ReactElement<{ children: React.ReactNode }>;
        return React.cloneElement(element, {
          children: React.Children.map(element.props.children, child => processContent(child))
        });
      }
    }
    
    return node;
  };

  return (
    <div className="relative group my-4 rounded-lg border border-border overflow-hidden">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md text-zinc-400 hover:text-[#FF914D] bg-zinc-100/80 dark:bg-zinc-950/80 border border-border backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
        title="Copy code"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre
        ref={preRef}
        className="bg-zinc-50 dark:bg-[#111111] p-4 m-0 overflow-x-hidden whitespace-pre-wrap break-words text-sm text-zinc-900 dark:text-zinc-300 shadow-inner"
        {...props}
      >
        {processContent(children)}
      </pre>
    </div>
  );
};
