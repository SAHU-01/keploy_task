import React from "react";
import { Badge as UiBadge } from "../../../../components/ui/badge";

export const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "secondary" | "destructive" | "outline" | "orange" }) => {
  return (
    <UiBadge variant={variant}>
      {children}
    </UiBadge>
  );
};
