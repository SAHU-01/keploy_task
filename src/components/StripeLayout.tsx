"use client";

import React from "react";
import type { Variants } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { Navbar } from "./Navbar";
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
      "h-screen flex flex-col bg-background text-foreground",
      className
    )}>
      <Navbar />

      <div className="flex flex-1 w-full relative overflow-hidden">
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
            isSidebarCollapsed ? "w-[64px]" : "w-[240px]"
          )}
        >
          <div className="p-4 h-full">
            {nav || <Sidebar />}
          </div>
        </aside>

        {/* Main Content Column */}
        <main className="flex-1 h-full relative overflow-hidden flex flex-col bg-background min-w-0">
          <ScrollArea className="flex-1">
            <div className="flex justify-center p-6 md:p-12 lg:p-16 min-h-full pb-24 md:pb-12">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="w-full max-w-[1000px] min-w-0"
              >
                {children}
              </motion.div>
            </div>
          </ScrollArea>
        </main>

        {/* Sticky Code Pane */}
        <aside className="hidden lg:flex w-[480px] h-full border-l border-border bg-sidebar/30 backdrop-blur-[2px] overflow-hidden flex flex-col min-w-0 shrink-0">
          <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-border to-transparent opacity-30" />
          <ScrollArea className="flex-1">
            <div className="p-0 h-full">
              {code || (
                <div className="glass m-6 p-6 min-h-[400px]">
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
