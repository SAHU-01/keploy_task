"use client";

import React, { useState } from "react";
import { useTutorialStore } from "@/features/tutorial-core/store/use-tutorial-store";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Check, Sparkles, FileText, FileCode, ChevronRight } from "lucide-react";

export const HeaderSection = ({ title: propsTitle }: { title: string }) => {
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
  const pathSegments = (pathname || "").split("/").filter(Boolean);
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
