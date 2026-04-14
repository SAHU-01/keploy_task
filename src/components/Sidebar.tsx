"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
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
  disabled?: boolean;
}

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  
  const isSidebarCollapsed = useTutorialStore(state => state.isSidebarCollapsed);
  const toggleSidebar = useTutorialStore(state => state.toggleSidebar);
  const headers = useTutorialStore(state => state.headers);
  const activeSection = useTutorialStore(state => state.activeSection);
  const expandedSlugs = useTutorialStore(state => state.expandedSlugs);
  const toggleExpandedSlug = useTutorialStore(state => state.toggleExpandedSlug);

  const slug = params?.slug as string[] | undefined;
  const slugString = React.useMemo(() => (slug || []).join("/"), [slug]);
  
  // Expand active slugs only when navigation occurs (slugString changes)
  React.useEffect(() => {
    if (slug) {
      slug.forEach((_, index) => {
        const fullSlug = slug.slice(0, index + 1).join("/");
        if (!expandedSlugs.includes(fullSlug)) {
          toggleExpandedSlug(fullSlug);
        }
      });
    }
    // We only want this to run when the actual URL slug changes, not when expandedSlugs changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugString, toggleExpandedSlug]);

  const dynamicNavItems: NavItem[] = [
    {
      title: "Getting Started",
      href: "/docs/getting-started",
      disabled: true,
    },
    {
      title: "Quickstarts",
      items: [
        {
          title: "Go",
          href: "/quickstart/go",
          items: [
            {
              title: "Docker",
              href: "/quickstart/go/docker",
              items: [
                {
                  title: "Mux sql",
                  href: "/quickstart/go/docker/mux-sql",
                }
              ]
            }
          ]
        },
        {
          title: "Python",
          href: "/quickstart/python/docker/fastapi",
          disabled: true,
        }
      ],
    },
    {
      title: "Reference",
      href: "/docs/reference",
      disabled: true,
    },
  ];

  if (isSidebarCollapsed) {
    return (
      <div className="flex flex-col items-center py-6 h-full font-sans">
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

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderNavItems = (items: NavItem[], depth = 0) => {
    return items.map((item, i) => {
      const isQuickstartPath = pathname.startsWith(item.href || "___");
      const isExactActive = pathname === item.href;
      const hasChildren = item.items && item.items.length > 0;
      
      const itemSlug = item.href?.replace("/quickstart/", "") || "";
      const isExpanded = expandedSlugs.includes(itemSlug);
      const showHeaders = isExactActive && headers.length > 0 && isExpanded;
      
      const isAnySubSectionActive = isExactActive && headers.some(h => h.id === activeSection);

      return (
        <React.Fragment key={i}>
          <SidebarLink
            href={item.href!}
            active={isExactActive || (hasChildren && isQuickstartPath)}
            showIndicator={isExactActive ? !isAnySubSectionActive : (hasChildren && isQuickstartPath)}
            disabled={item.disabled}
            className={cn(depth === 1 && "ml-4", depth === 2 && "ml-8")}
            hasChildren={hasChildren}
            isExpanded={isExpanded}
            onToggle={() => toggleExpandedSlug(itemSlug)}
          >
            {item.title}
          </SidebarLink>
          
          <AnimatePresence initial={false}>
            {hasChildren && isExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex flex-col gap-0.5 overflow-hidden"
              >
                {renderNavItems(item.items!, depth + 1)}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {showHeaders && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={cn(
                  "flex flex-col gap-1 mt-1 mb-2 border-l border-zinc-200 dark:border-zinc-800",
                  depth === 0 && "ml-8",
                  depth === 1 && "ml-12",
                  depth === 2 && "ml-16"
                )}
              >
                {headers.map((header) => {
                  const isSectionActive = activeSection === header.id;
                  return (
                    <button
                      key={header.id}
                      onClick={() => handleScrollToSection(header.id)}
                      className={cn(
                        "text-[12px] text-left px-4 py-1.5 rounded-md transition-all relative group/header flex items-start gap-2",
                        isSectionActive 
                          ? "text-[#FF914D] font-bold bg-[#FF914D]/5" 
                          : "text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300",
                        header.level === 3 && "pl-8 text-[11px]"
                      )}
                    >
                      {isSectionActive && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute left-[-2px] top-0 bottom-0 w-[3px] rounded-full bg-[#FF914D]"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <span className="whitespace-normal leading-tight py-0.5">{header.title}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </React.Fragment>
      );
    });
  };

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="mb-10 flex items-center justify-end px-2">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md text-zinc-400 hover:text-[#FF914D] hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-90"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex flex-col gap-9 w-full p-0">
        {dynamicNavItems.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            <h4 className="px-3 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
              {section.title}
            </h4>
            <div className="flex flex-col gap-0.5">
              {section.href ? (
                <SidebarLink 
                  href={section.href} 
                  active={pathname === section.href}
                  disabled={section.disabled}
                >
                  {section.title}
                </SidebarLink>
              ) : (
                renderNavItems(section.items || [])
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
  showIndicator,
  disabled,
  className,
  hasChildren,
  isExpanded,
  onToggle
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  showIndicator?: boolean;
  disabled?: boolean;
  className?: string;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}) {
  if (disabled) {
    return (
      <div
        className={cn(
          "relative flex items-center px-3 py-2 text-sm text-zinc-300 dark:text-zinc-600 cursor-not-allowed mx-1",
          className
        )}
      >
        <span className="flex-1">{children}</span>
        <span className="text-[9px] font-bold uppercase tracking-tighter opacity-40 ml-2 border border-zinc-200 dark:border-zinc-800 px-1 rounded">Soon</span>
      </div>
    );
  }

  const actualShowIndicator = showIndicator ?? active;

  return (
    <div className="relative group flex items-start gap-1 mx-1">
      <Link
        href={href}
        onClick={(e) => {
          if (hasChildren || active) {
            onToggle?.();
          }
        }}
        className={cn(
          "relative flex-1 flex items-start px-3 py-2 text-sm transition-all duration-200 rounded-lg",
          active
            ? "text-[#FF914D] font-bold bg-orange-500/5"
            : "text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-muted/50",
          className
        )}
      >
        {actualShowIndicator && (
          <motion.div
            layoutId="active-indicator"
            className="absolute left-[-4px] top-0 bottom-0 w-[3px] rounded-full bg-[#FF914D]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        <span className="flex-1 whitespace-normal leading-tight py-0.5">{children}</span>
        {!active && !hasChildren && (
          <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-zinc-400 shrink-0 mt-1" />
        )}
      </Link>
      {hasChildren && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle?.();
          }}
          className="p-1 rounded-md hover:bg-muted/50 text-zinc-400 transition-colors mr-1 mt-1"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="h-4 w-4" />
          </motion.div>
        </button>
      )}
    </div>
  );
}