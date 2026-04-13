"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTutorialStore } from "@/features/keploy-tutorial/store/useTutorialStore";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavItem {
  title: string;
  href?: string;
  items?: NavItem[];
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Getting Started",
    href: "/docs/getting-started",
  },
  {
    title: "Quickstarts",
    items: [
      { title: "Go", href: "/quickstart/go/docker/mux-sql" },
      { title: "Python", href: "/quickstart/python/docker/fastapi" },
    ],
  },
  {
    title: "Reference",
    href: "/docs/reference",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useTutorialStore();

  if (isSidebarCollapsed) {
    return (
      <div className="flex flex-col items-center py-6 h-full">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-zinc-400 hover:text-[#FF914D] hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all mb-8 active:scale-90"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
        <div className="w-[2px] h-32 bg-gradient-to-b from-[#FF914D] to-transparent rounded-full opacity-30" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-10 flex items-center justify-end px-2">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md text-zinc-400 hover:text-[#FF914D] hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-90"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex flex-col gap-9 w-full p-0">
        {navItems.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            <h4 className="px-3 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
              {section.title}
            </h4>
            <div className="flex flex-col gap-0.5">
              {section.href ? (
                <SidebarLink href={section.href} active={pathname === section.href}>
                  {section.title}
                </SidebarLink>
              ) : (
                section.items?.map((item, i) => (
                  <SidebarLink
                    key={i}
                    href={item.href!}
                    active={pathname === item.href}
                    className="pl-6"
                  >
                    {item.title}
                  </SidebarLink>
                ))
              )}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

function SidebarLink({
  href,
  children,
  active,
  className,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative group flex items-center px-3 py-2 text-sm transition-all duration-200 rounded-lg mx-1",
        active
          ? "text-[#FF914D] font-semibold bg-orange-500/5"
          : "text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-muted/50",
        className
      )}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-[-4px] w-[3px] h-3/5 rounded-full bg-[#FF914D]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      <span className="flex-1">{children}</span>
      {!active && (
        <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-zinc-400" />
      )}
    </Link>
  );
}
