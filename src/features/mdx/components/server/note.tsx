import React from "react";

export const Note = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pl-4 border-l-2 border-orange-500/30 dark:border-orange-500/20 my-8">
      <div className="text-[12px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
        Note
      </div>
      <div className="text-[14px] text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  );
};
