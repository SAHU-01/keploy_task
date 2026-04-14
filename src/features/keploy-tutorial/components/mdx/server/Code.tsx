import React from "react";

export const Code = ({ children }: { children: React.ReactNode }) => <code className="bg-muted dark:bg-zinc-800 rounded px-1.2 py-0.5 text-sm text-accent font-semibold font-mono break-all">{children}</code>;
