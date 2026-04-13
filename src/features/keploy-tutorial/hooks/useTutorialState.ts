"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Hook to manage and listen to the tutorial state via URL parameters
 * and local component state.
 */
export const useTutorialState = () => {
  const searchParams = useSearchParams();

  // 1. Listen to URL params to derive content path
  // Defaults match the TutorialHeader defaults
  const lang = searchParams.get("lang") || "go";
  const env = searchParams.get("env") || "docker";
  const quickstart = searchParams.get("quickstart") || "echo-sql";

  /**
   * Returns the slug array for getContentBySlug.
   * Format: [language, environment, quickstart]
   * Example: ['go', 'docker', 'echo-sql']
   */
  const contentSlug = useMemo(() => [lang, env, quickstart], [lang, env, quickstart]);

  /**
   * Returns the absolute-like string path for MDX files if needed.
   * Example: "src/content/go/docker/echo-sql/"
   */
  const basePath = useMemo(() => `src/content/${lang}/${env}/${quickstart}/`, [lang, env, quickstart]);

  // 2. State for active code snippet (to be updated by CodeGroup on scroll)
  const [activeCodeSnippet, setActiveCodeSnippet] = useState<string | null>(null);

  return {
    // URL Derived State
    lang,
    env,
    quickstart,
    contentSlug,
    basePath,

    // Component State
    activeCodeSnippet,
    setActiveCodeSnippet,
  };
};
