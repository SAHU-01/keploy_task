"use client";

import { useTutorialStore } from "../store/useTutorialStore";
import { useRef } from "react";

interface StoreInitializerProps {
  files: Record<string, string>;
  headers: Array<{ id: string; title: string; level: number }>;
  rawContent: string;
  title: string;
}

/**
 * Professional-grade store initializer that syncs server-fetched data
 * to the client-side Zustand store during the render phase to avoid
 * flashes of old content.
 */
export function StoreInitializer({ files, headers, rawContent, title }: StoreInitializerProps) {
  const initialized = useRef(false);
  const lastPath = useRef("");
  
  // We use the store's internal state to check if we need an update
  const store = useTutorialStore.getState();

  // If the content or title has changed, we sync the store immediately
  // This runs during render, which is safe for syncing props to state
  if (store.rawContent !== rawContent || store.title !== title) {
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
  }

  return null;
}
