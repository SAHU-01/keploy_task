import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const config = {
  info: {
    bg: "bg-[#FF914D]/[0.06] dark:bg-[#FF914D]/[0.08]",
    icon: "text-[#FF914D]",
    iconPath: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
  },
  warning: {
    bg: "bg-amber-500/[0.06] dark:bg-amber-500/[0.08]",
    icon: "text-amber-500",
    iconPath: "M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z",
  },
  tip: {
    bg: "bg-emerald-500/[0.06] dark:bg-emerald-500/[0.08]",
    icon: "text-emerald-500",
    iconPath: "M10 1a6 6 0 00-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.044a2 2 0 002 2h0a2 2 0 002-2v-.044c0-1.013.762-1.957 1.815-2.825A6 6 0 0010 1zM8 18a2 2 0 104 0H8z",
  },
};

export const Callout = ({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warning" | "tip" }) => {
  const c = config[type];

  return (
    <div className={cn("w-full rounded-lg px-4 py-3.5 my-5 min-w-0", c.bg)}>
      <div className="flex items-start gap-3">
        <svg className={cn("w-[18px] h-[18px] shrink-0 mt-[1px]", c.icon)} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d={c.iconPath} clipRule="evenodd" />
        </svg>
        <div className="text-[13.5px] text-foreground/85 break-words leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
