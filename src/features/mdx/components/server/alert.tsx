import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Alert = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "destructive" | "warning" }) => {
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
