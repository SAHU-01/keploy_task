"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UpNextLink {
  title: string;
  href: string;
  description: string;
}

interface UpNextProps {
  links?: UpNextLink[];
}

export const UpNext = ({ links = [] }: UpNextProps) => {
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);

  if (!links || links.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-zinc-200 dark:border-zinc-800">
      <h3 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-8">
        Up Next
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-20">
        {links.map((link, idx) => (
          <div key={idx} className="flex flex-col gap-2 group">
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF914D] hover:opacity-80 font-bold text-base transition-all leading-snug underline-offset-4 hover:underline"
            >
              {link.title}
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {link.description}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 border-t border-zinc-100 dark:border-zinc-900">
        <span className="text-sm font-medium text-muted-foreground">
          Was this page helpful?
        </span>
        
        <div className="flex items-center gap-3">
          {feedback ? (
            <div className="flex items-center gap-2 text-[#FF914D] font-bold text-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Check className="h-4 w-4" />
              Thanks for the feedback!
            </div>
          ) : (
            <>
              <button
                onClick={() => setFeedback("yes")}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all active:scale-95"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                Yes
              </button>
              <button
                onClick={() => setFeedback("no")}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all active:scale-95"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
                No
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
