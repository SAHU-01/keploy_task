"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Slack, Search, Menu, Loader2, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/features/theme/components/theme-toggle";
import { useTutorialStore } from "@/features/tutorial-core/store/use-tutorial-store";
import { useSearch } from "@/features/search/hooks/use-search";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Navbar() {
  const toggleMobileSidebar = useTutorialStore(state => state.toggleMobileSidebar);
  const setSearchQuery = useTutorialStore(state => state.setSearchQuery);
  const searchQuery = useTutorialStore(state => state.searchQuery);
  const { results, isLoading } = useSearch(searchQuery);
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Handle Command+K shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleResultClick = (url: string) => {
    setSearchQuery("");
    setIsFocused(false);
    
    if (url.includes("#")) {
      const [path, hash] = url.split("#");
      const currentPath = window.location.pathname;
      
      if (currentPath === path) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          
          if (hash.startsWith("step-")) {
            const stepNum = parseInt(hash.replace("step-", ""));
            useTutorialStore.getState().setActiveStep(stepNum);
          }
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          <button
            onClick={() => toggleMobileSidebar()}
            className="p-2 mr-2 rounded-md hover:bg-muted transition-colors md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-7 h-7 rounded bg-[#FF914D] flex items-center justify-center shadow-lg shadow-orange-500/20"
            >
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20" />
            </motion.div>
            <span className="font-bold text-lg tracking-tight text-foreground group-hover:text-[#FF914D] transition-colors hidden sm:inline-block">
              Keploy <span className="text-zinc-500 font-medium ml-1 text-sm">DOCS</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Pill Search Bar */}
          <div className="relative">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-400 focus-within:border-accent dark:focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20 transition-all w-40 md:w-64 group shadow-sm">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
              ) : (
                <Search className="h-4 w-4 group-hover:text-zinc-500 dark:group-hover:text-zinc-300 transition-colors" />
              )}
              <input 
                ref={inputRef}
                type="text"
                placeholder="Search"
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm flex-1 font-medium text-foreground placeholder:text-zinc-400"
              />
              <div className={cn(
                "flex items-center gap-1 transition-opacity",
                searchQuery ? "opacity-0" : "opacity-60 group-focus-within:opacity-0"
              )}>
                <div className="flex items-center justify-center h-5 w-5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[10px] font-bold shadow-sm">
                  ⌘
                </div>
                <div className="flex items-center justify-center h-5 w-5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[10px] font-bold shadow-sm">
                  K
                </div>
              </div>
            </div>

            {/* Search Dropdown */}
            <AnimatePresence>
              {isFocused && (searchQuery || results.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[100] overflow-hidden"
                >
                  <div className="p-2">
                    <div className="px-3 py-2 text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] border-b border-zinc-100 dark:border-zinc-800 mb-1">
                      {results.length > 0 ? "Search Results" : "Quick Actions"}
                    </div>
                    
                    {results.length > 0 ? (
                      <div className="flex flex-col gap-0.5">
                        {results.map((result) => (
                          <Link
                            key={result.id}
                            href={result.url}
                            onClick={() => handleResultClick(result.url)}
                            className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group/item"
                          >
                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover/item:text-accent transition-colors truncate">
                              {result.title}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5 text-zinc-400 opacity-0 group-hover/item:opacity-100 transition-all" />
                          </Link>
                        ))}
                      </div>
                    ) : searchQuery ? (
                      <div className="px-3 py-10 text-center">
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">No results found</p>
                        <p className="text-xs text-zinc-500">We couldn&apos;t find anything matching &quot;{searchQuery}&quot;</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1 px-3 py-4">
                        <p className="text-xs font-medium text-zinc-500 italic">Try searching for:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-bold text-zinc-600 dark:text-zinc-400">Docker</span>
                          <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-bold text-zinc-600 dark:text-zinc-400">Go</span>
                          <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-bold text-zinc-600 dark:text-zinc-400">CI/CD</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <ThemeToggle />
            
            <a 
              href="https://github.com/keploy/keploy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>

            <a 
              href="https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <Slack className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      {/* Stitch Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
    </header>
  );
}
