import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Callout = ({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warning" }) => {
  return (
    <div className={cn(
      "relative w-full rounded-lg border border-border p-4 bg-muted/30 backdrop-blur-sm my-6 min-w-0",
      "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-l-lg",
      type === "warning" ? "before:bg-amber-500" : "before:bg-accent"
    )}>
      <div className="text-sm text-foreground break-words font-medium">{children}</div>
    </div>
  );
};
