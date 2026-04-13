"use client";

import React, { useState, useEffect } from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { useMDXComponents } from "@/mdx-components";
import { useTutorialStore } from "../store/useTutorialStore";

interface MdxRendererProps {
  serializedSource: MDXRemoteSerializeResult;
  rawContent?: string;
  title?: string;
}

export const MdxRenderer = ({ serializedSource, rawContent, title }: MdxRendererProps) => {
  const [mounted, setMounted] = useState(false);
  const components = useMDXComponents({});
  const setRawContent = useTutorialStore(state => state.setRawContent);

  useEffect(() => {
    setMounted(true);
    if (rawContent && title) {
      setRawContent(rawContent, title);
    }
  }, [rawContent, title, setRawContent]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="mt-8 prose prose-zinc dark:prose-invert max-w-none">
      <MDXRemote 
        {...serializedSource} 
        components={components} 
      />
    </div>
  );
};
