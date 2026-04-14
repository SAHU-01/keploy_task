import React from "react";

export const CodeBlock = ({ children, filename }: { children: React.ReactNode; label?: string; filename?: string }) => {
  return (
    <div className="[&_>_div]:my-0 [&_>_div]:rounded-none [&_>_div]:border-0 min-w-0">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ filename?: string }>, { filename });
        }
        return child;
      })}
    </div>
  );
};
