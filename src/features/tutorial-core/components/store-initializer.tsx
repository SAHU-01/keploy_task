"use client";

import { useEffect } from "react";
import { useTutorialStore } from "@/features/tutorial-core/store/use-tutorial-store";

interface StoreInitializerProps {
  files: Record<string, string>;
  headers: Array<{ id: string; title: string; level: number }>;
  rawContent: string;
  title: string;
}

/**
 * Professional-grade store initializer that syncs server-fetched data
 * to the client-side Zustand store using useEffect to avoid
 * updating other components during the render phase.
 */
export function StoreInitializer({ files, headers, rawContent, title }: StoreInitializerProps) {
  useEffect(() => {
    // We update the store in useEffect to avoid the "Cannot update a component while rendering a different component" error.
    // This handles both initial load and subsequent navigation between tutorials.
    
    useTutorialStore.setState({
      rawContent,
      title,
      headers,
      files,
      // Reset active step/section when content changes
      activeStep: 1,
      activeSection: headers.length > 0 ? headers[0].id : null,
      activeFile: Object.keys(files)[0] || "",
    });
  }, [files, headers, rawContent, title]);

  return null;
}
