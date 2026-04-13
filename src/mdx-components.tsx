"use client";

import type { MDXComponents } from "mdx/types";
import React, { useEffect, useRef } from "react";
import { useTutorialStore } from "./features/keploy-tutorial/store/useTutorialStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { CodeTrigger } from "./features/keploy-tutorial/components/CodeTrigger";
import { Badge } from "./components/ui/Badge";

const HeaderSection = ({ title }: { title: string }) => {
  return (
    <div className="mb-12 border-b border-border pb-8 min-w-0">
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground truncate-none break-words">{title}</h1>
    </div>
  );
};

const Step = ({ number, title, children }: { number: number; title: string; children: React.ReactNode }) => {
  return (
    <div className="flex gap-6 mb-12 relative group min-w-0">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-8 h-8 rounded-full border-2 border-accent flex items-center justify-center text-accent font-bold text-sm bg-background z-10 shadow-[0_0_15px_rgba(139,92,246,0.2)] dark:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
          {number}
        </div>
        <div className="w-[1px] h-full bg-border absolute top-8 group-last:hidden" />
      </div>
      <div className="flex-1 pb-4 min-w-0">
        <h2 className="text-xl font-bold text-foreground mb-4 mt-0 break-words">{title}</h2>
        <div className="text-muted-foreground leading-relaxed break-words">{children}</div>
      </div>
    </div>
  );
};

const BadgeMDX = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "secondary" | "destructive" | "outline" | "orange" }) => {
  return (
    <Badge variant={variant}>
      {children}
    </Badge>
  );
};

const Callout = ({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warning" }) => {
  return (
    <div className={cn(
      "relative w-full rounded-lg border border-border p-4 bg-muted/30 backdrop-blur-sm my-6 min-w-0",
      "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-l-lg",
      type === "warning" ? "before:bg-amber-500" : "before:bg-accent"
    )}>
      <div className="text-sm text-foreground break-words font-medium">{children}</div>
    </div>
  );
};

const Alert = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "destructive" | "warning" }) => {
  const colors = {
    default: "border-border bg-muted/50 text-foreground",
    destructive: "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200",
    warning: "border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200"
  };

  return (
    <div className={cn("p-4 rounded-lg border flex gap-3 my-6", colors[variant])}>
      <div className="flex-1 text-sm break-words font-medium">{children}</div>
    </div>
  );
};

const CodeGroup = ({ children }: { children: React.ReactNode }) => {
  const childrenArray = React.Children.toArray(children);
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <div className="my-6 rounded-xl border border-border bg-muted/30 backdrop-blur-md overflow-hidden shadow-sm min-w-0">
      <div className="flex border-b border-border bg-muted/50 overflow-x-auto custom-scrollbar no-scrollbar">
        {childrenArray.map((child: any, i) => (
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
            {child.props.label || child.props.filename}
          </button>
        ))}
      </div>
      <div className="p-0 min-w-0">
        {childrenArray[activeIndex]}
      </div>
    </div>
  );
};

const CodeBlock = ({ children, filename }: { children: React.ReactNode; label?: string; filename?: string }) => {
  return (
    <div className="[&_pre]:my-0 [&_pre]:rounded-none [&_pre]:border-0 min-w-0">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { filename });
        }
        return child;
      })}
    </div>
  );
};

const Pre = ({ children, ...props }: React.HTMLAttributes<HTMLPreElement> & { filename?: string }) => {
  const preRef = useRef<HTMLPreElement>(null);
  const { setCode, setActiveCode } = useTutorialStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const code = preRef.current?.innerText || "";
          setCode(code);
          
          // If a filename is provided as a prop, also update active file
          if (props.filename && props.filename !== "terminal") {
            setActiveCode(props.filename);
          }
        }
      },
      { threshold: 0.5 }
    );

    if (preRef.current) {
      observer.observe(preRef.current);
    }

    return () => observer.disconnect();
  }, [setCode]);

  return (
    <pre
      ref={preRef}
      className="bg-zinc-50 dark:bg-[#111111] p-4 overflow-x-hidden whitespace-pre-wrap break-words rounded-lg border border-border text-sm text-zinc-900 dark:text-zinc-300 my-4 shadow-inner"
      {...props}
    >
      {children}
    </pre>
  );
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Step,
    Badge: BadgeMDX,
    Callout,
    Alert,
    CodeGroup,
    CodeBlock,
    CodeTrigger,
    HeaderSection,
    pre: Pre,
    h1: ({ children }) => <h1 className="text-4xl font-extrabold tracking-tight text-foreground mt-0 mb-6 break-words">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold text-foreground mb-4 mt-8 break-words">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold text-foreground mb-2 mt-6 break-words">{children}</h3>,
    p: ({ children }) => <p className="text-foreground/90 leading-7 mb-4 break-words">{children}</p>,
    code: ({ children }) => <code className="bg-muted dark:bg-zinc-800 rounded px-1.2 py-0.5 text-sm text-accent font-semibold font-mono break-all">{children}</code>,
    wrapper: ({ children }) => (
      <div className="prose prose-zinc dark:prose-invert max-w-none min-w-0 overflow-hidden text-foreground">
        {children}
      </div>
    ),
  };
}
