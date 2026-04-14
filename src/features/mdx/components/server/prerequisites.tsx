import React from "react";

export const Prerequisites = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pl-4 pr-4 py-4 border-l-2 border-[#FF914D] bg-[#FF914D]/8 dark:bg-[#FF914D]/10 my-8 rounded-r-lg shadow-sm shadow-orange-500/5">
      <div className="text-[12px] font-bold text-[#FF914D] uppercase tracking-wider mb-2">
        Pre-requisites
      </div>
      <div className="text-[14px] text-foreground/90 leading-relaxed">
        {children}
      </div>
    </div>
  );
};
