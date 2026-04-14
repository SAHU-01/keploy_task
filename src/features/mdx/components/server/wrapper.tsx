import React from "react";

export const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="prose prose-zinc dark:prose-invert max-w-none min-w-0 overflow-hidden text-foreground">
    {children}
  </div>
);
