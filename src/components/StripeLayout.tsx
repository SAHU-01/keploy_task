"use client";

import React from "react";
import type { Variants } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { ScrollArea } from "./ui/ScrollArea";
import { useTutorialStore } from "@/features/keploy-tutorial/store/useTutorialStore";
import { Menu, X } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StripeLayoutProps {
  children: React.ReactNode;
  nav?: React.ReactNode;
  code?: React.ReactNode;
  className?: string;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function StripeLayout({
  children,
  nav,
  code,
  className,
}: StripeLayoutProps) {
  const { isSidebarCollapsed, isMobileSidebarOpen, toggleMobileSidebar } = useTutorialStore();

  return (
    <div className={cn(
      "h-screen overflow-hidden bg-background text-foreground",
      className
    )}>
      {/* Mobile Header */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 border-b border-border bg-sidebar z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#FF914D]" />
          <span className="font-bold text-lg tracking-tight">Keploy</span>
        </div>
        <button
          onClick={() => toggleMobileSidebar()}
          className="p-2 rounded-md hover:bg-muted transition-colors"
        >
          {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <div className="flex h-full w-full relative">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => toggleMobileSidebar(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-[280px] bg-background z-[70] md:hidden shadow-2xl overflow-y-auto"
              >
                <div className="p-4 h-full">
                  <div className="flex justify-end mb-4">
                    <button onClick={() => toggleMobileSidebar(false)} className="p-2 text-muted-foreground">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  {nav || <Sidebar />}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar Column */}
        <aside 
          className={cn(
            "hidden md:block h-full border-r border-border bg-sidebar transition-all duration-300 overflow-y-auto",
            isSidebarCollapsed ? "w-[64px]" : "w-[260px]"
          )}
        >
          <div className="p-4 h-full">
            {nav || <Sidebar />}
          </div>
        </aside>

        {/* Main Content Column */}
        <main className="flex-1 h-full relative overflow-hidden flex flex-col bg-background min-w-0">
          <div className="absolute top-6 right-6 z-40 hidden md:block">
            <ThemeToggle />
          </div>
          
          <ScrollArea className="flex-1">
            <div className="flex justify-center p-6 md:p-12 min-h-full pb-24 md:pb-12">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="w-full max-w-[800px] min-w-0"
              >
                {children}
              </motion.div>
            </div>
          </ScrollArea>
        </main>

        {/* Sticky Code Pane */}
        <aside className="hidden lg:flex w-[440px] h-full border-l border-border bg-sidebar overflow-hidden flex flex-col min-w-0 shrink-0">
          <ScrollArea className="flex-1">
            <div className="p-6 min-h-full">
              {code || (
                <div className="glass p-6 min-h-[400px]">
                  {/* ... mock content ... */}
                </div>
              )}
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}
