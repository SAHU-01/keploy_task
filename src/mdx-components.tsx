"use client";

import type { MDXComponents } from "mdx/types";
import React, { useEffect, useRef, useState } from "react";
import { useTutorialStore } from "./features/keploy-tutorial/store/useTutorialStore";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Copy, Check, Info, Sparkles, FileText, FileCode, ChevronRight } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { CodeTrigger } from "./features/keploy-tutorial/components/CodeTrigger";
import { Badge } from "./components/ui/Badge";

const HeaderSection = ({ title: propsTitle }: { title: string }) => {
  const rawContent = useTutorialStore(state => state.rawContent);
  const storeTitle = useTutorialStore(state => state.title);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

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

  // Generate dynamic breadcrumbs
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    const isLast = index === pathSegments.length - 1;

    return { label, href, isLast };
  });

  return (
    <div className="mb-12 min-w-0">
      <nav className="flex items-center gap-2 text-[13px] text-zinc-500 mb-4 font-medium overflow-x-auto no-scrollbar whitespace-nowrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        {breadcrumbs.map((crumb) => (
          <React.Fragment key={crumb.href}>
            <ChevronRight className="h-3 w-3 text-zinc-300 dark:text-zinc-700 shrink-0" />
            {crumb.isLast ? (
              <span className="text-zinc-900 dark:text-zinc-100 font-bold">{propsTitle || crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-foreground transition-colors">{crumb.label}</Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      <h1 className="text-4xl font-extrabold tracking-tight text-foreground truncate-none break-words mb-4 leading-tight">{propsTitle}</h1>
      
      <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 mb-6">
        <div className="relative group/tooltip flex items-center">
          <button 
            disabled
            className="flex items-center gap-2 text-[13px] font-medium opacity-50 cursor-not-allowed transition-colors"
          >
            <Sparkles className="h-4 w-4 text-zinc-400" />
            Ask about this page
          </button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Coming soon
          </div>
        </div>
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
      <div className="border-b border-border" />
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
    const childrenString = React.Children.toArray(children).join("").toLowerCase();
    if (childrenString.includes(query)) return true;
    
    return false;
  }, [searchQuery, title, children]);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // On mobile, we need a higher threshold and a more stable condition
        // to prevent flickering as the user scrolls
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
      {/* Stripe-style active line highlight */}
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

const CodeBlock = ({ children, filename }: { children: React.ReactNode; label?: string; filename?: string }) => {
  return (
    <div className="[&_>_div]:my-0 [&_>_div]:rounded-none [&_>_div]:border-0 min-w-0">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ filename?: string }>, { filename });
        }
        return child;
      })}
    </div>
  );
};

const Pre = ({ children, ...props }: React.HTMLAttributes<HTMLPreElement> & { filename?: string }) => {
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

          // If a filename is provided as a prop, also update active file
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
    
    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{ children: React.ReactNode }>;
      if (element.props.children) {
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

const H2 = ({ children }: { children: React.ReactNode }) => {
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

const H3 = ({ children }: { children: React.ReactNode }) => {
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

  return <h3 id={id} ref={ref} className="text-xl font-bold text-foreground mb-2 mt-6 break-words scroll-mt-20">{children}</h3>;
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
    h2: H2,
    h3: H3,
    p: ({ children }) => <p className="text-foreground/90 leading-7 mb-4 break-words">{children}</p>,
    code: ({ children }) => <code className="bg-muted dark:bg-zinc-800 rounded px-1.2 py-0.5 text-sm text-accent font-semibold font-mono break-all">{children}</code>,
    wrapper: ({ children }) => (
      <div className="prose prose-zinc dark:prose-invert max-w-none min-w-0 overflow-hidden text-foreground">
        {children}
      </div>
    ),
  };
}
