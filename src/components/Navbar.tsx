"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Slack, Search, Command, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useTutorialStore } from "@/features/keploy-tutorial/store/useTutorialStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Navbar() {
  const { toggleMobileSidebar } = useTutorialStore();

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
          {/* Professional Search Bar */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-muted-foreground hover:bg-muted hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer w-40 md:w-64 group">
            <Search className="h-4 w-4 group-hover:text-foreground transition-colors" />
            <span className="text-sm flex-1">Search docs...</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-background text-[10px] font-medium shadow-sm">
              <Command className="h-2.5 w-2.5" />
              <span>K</span>
            </div>
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
