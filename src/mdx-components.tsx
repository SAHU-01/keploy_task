"use client";

import type { MDXComponents } from "mdx/types";
import React, { useEffect, useRef, useState } from "react";
import { useTutorialStore } from "./features/keploy-tutorial/store/useTutorialStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Copy, Check, Info, Sparkles, FileText, FileCode } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { CodeTrigger } from "./features/keploy-tutorial/components/CodeTrigger";
import { Badge } from "./components/ui/Badge";

const HeaderSection = ({ title: propsTitle }: { title: string }) => {
  const { rawContent, title: storeTitle } = useTutorialStore();
  const [copied, setCopied] = useState(false);

  const handleCopyForLLM = () => {
    const title = propsTitle || storeTitle;
    const prompt = `Act as a Senior Keploy Engineer. Use the following context to answer user queries about ${title}:\n\n${rawContent}`;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewAsMarkdown = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("format", "raw");
    window.open(url.toString(), "_blank");
  };

  return (
    <div className="mb-10 border-b border-border pb-6 min-w-0">
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground truncate-none break-words mb-6">{propsTitle}</h1>
      
      <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 mb-2">
        <button className="flex items-center gap-2 text-[13px] font-medium hover:text-[#FF914D] transition-colors group">
          <Sparkles className="h-4 w-4 text-zinc-400 group-hover:text-[#FF914D] transition-colors" />
          Ask about this page
        </button>
        <span className="text-border/60">|</span>
        <button 
          onClick={handleCopyForLLM}
          className="flex items-center gap-2 text-[13px] font-medium hover:text-[#FF914D] transition-colors group"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-[#FF914D]" /> : <FileText className="h-3.5 w-3.5 text-zinc-400 group-hover:text-[#FF914D] transition-colors" />}
          {copied ? "Copied!" : "Copy for LLM"}
        </button>
        <span className="text-border/60">|</span>
        <button 
          onClick={handleViewAsMarkdown}
          className="flex items-center gap-2 text-[13px] font-medium hover:text-[#FF914D] transition-colors group"
        >
          <FileCode className="h-4 w-4 text-zinc-400 group-hover:text-[#FF914D] transition-colors" />
          View as Markdown
        </button>
      </div>
    </div>
  );
};

const Step = ({ 
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
  const { activeStep, setActiveStep, setActiveCode } = useTutorialStore();
  const stepRef = useRef<HTMLDivElement>(null);
  const isActive = activeStep === number;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveStep(number);
          if (file) {
            setActiveCode(file, lines);
          }
        }
      },
      { 
        threshold: 0,
        // Trigger precisely when the step crosses a line 20% from the top of the screen
        rootMargin: "-20% 0px -79% 0px"
      }
    );

    if (stepRef.current) {
      observer.observe(stepRef.current);
    }

    return () => observer.disconnect();
  }, [number, setActiveStep, setActiveCode, file, JSON.stringify(lines)]);

  return (
    <div ref={stepRef} className="flex gap-6 mb-12 relative group min-w-0 overflow-visible">
      {/* Stripe-style active line highlight */}
      <div className={cn(
        "absolute -left-[32px] top-0 bottom-0 w-[2px] transition-all duration-300",
        isActive ? "bg-[#FF914D] opacity-100" : "bg-transparent opacity-0"
      )} />

      <div className="flex flex-col items-center shrink-0 w-10 overflow-visible">
        <div className={cn(
          "w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-sm z-10 transition-all duration-300",
          isActive 
            ? "border-[#FF914D] bg-[#FF914D] text-white shadow-[0_0_20px_rgba(255,145,77,0.4)] scale-110" 
            : "border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 bg-background group-hover:border-zinc-300 dark:group-hover:border-zinc-700"
        )}>
          {number}
        </div>
        <div className="w-[1px] h-full bg-border absolute top-9 group-last:hidden" />
      </div>
      <div className={cn(
        "flex-1 pb-4 min-w-0 transition-all duration-300",
        isActive ? "opacity-100" : "opacity-30"
      )}>
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

const Note = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pl-4 border-l-2 border-orange-500/30 dark:border-orange-500/20 my-8">
      <div className="text-[12px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
        Note
      </div>
      <div className="text-[14px] text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  );
};

const Prerequisites = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pl-4 pr-4 py-4 border-l-2 border-[#FF914D] bg-[#FF914D]/8 dark:bg-[#FF914D]/10 my-8 rounded-r-lg shadow-sm shadow-orange-500/5">
      <div className="text-[12px] font-bold text-[#FF914D] uppercase tracking-wider mb-2">
        Pre-requisites
      </div>
      <div className="text-[14px] text-foreground/90 leading-relaxed">
        {children}
      </div>
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
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const code = preRef.current?.innerText || "";
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
  }, [setCode, setActiveCode, props.filename]);

  // Process children to identify and style diff lines
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
    
    if (React.isValidElement(node) && node.props.children) {
      return React.cloneElement(node as React.ReactElement<any>, {
        children: React.Children.map(node.props.children, child => processContent(child))
      });
    }
    
    return node;
  };

  return (
    <div className="relative group/pre my-4">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-md text-zinc-400 hover:text-[#FF914D] bg-zinc-100/80 dark:bg-zinc-950/80 border border-border backdrop-blur-sm transition-all opacity-0 group-hover/pre:opacity-100 z-10"
        title="Copy code"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre
        ref={preRef}
        className="bg-zinc-50 dark:bg-[#111111] p-4 overflow-x-hidden whitespace-pre-wrap break-words rounded-lg border border-border text-sm text-zinc-900 dark:text-zinc-300 shadow-inner"
        {...props}
      >
        {processContent(children)}
      </pre>
    </div>
  );
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Step,
    Badge: BadgeMDX,
    Callout,
    Alert,
    Note,
    Prerequisites,
    CodeGroup,
    CodeBlock,
    CodeTrigger,
    HeaderSection,
    Info,
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
