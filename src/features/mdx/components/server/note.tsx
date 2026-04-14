import React from "react";

export const Note = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pl-4 border-l-2 border-[#FF914D]/40 my-8">
      <div className="text-[11px] font-semibold text-[#FF914D] uppercase tracking-widest mb-2">
        Note
      </div>
      <div className="text-[14px] text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  );
};
