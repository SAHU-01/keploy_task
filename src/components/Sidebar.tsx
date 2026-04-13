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
          className="p-2 rounded-md text-zinc-400 hover:text-[#FF914D] hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all mb-8"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
        <div className="w-[2px] h-32 bg-[#FF914D] rounded-full opacity-50" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8 flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#FF914D]" />
          <span className="font-bold text-xl tracking-tight">Keploy</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md text-zinc-400 hover:text-[#FF914D] hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex flex-col gap-8 w-full p-0">
        {navItems.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <h4 className="px-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              {section.title}
            </h4>
            <div className="flex flex-col gap-1">
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
        "relative group flex items-center px-3 py-1.5 text-sm transition-colors duration-200",
        active
          ? "text-[#FF914D] font-medium"
          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200",
        className
      )}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 w-[2px] h-full bg-[#FF914D]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      <span className="flex-1">{children}</span>
      {!active && (
        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </Link>
  );
}
