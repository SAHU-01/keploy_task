"use client";

import React, { useState, useEffect } from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { useMDXComponents } from "@/mdx-components";

interface MdxRendererProps {
  serializedSource: MDXRemoteSerializeResult;
}

export const MdxRenderer = ({ serializedSource }: MdxRendererProps) => {
  const [mounted, setMounted] = useState(false);
  const components = useMDXComponents({});

  useEffect(() => {
    setMounted(true);
  }, []);

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
