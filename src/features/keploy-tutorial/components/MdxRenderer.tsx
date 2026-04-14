"use client";

import React from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { useMDXComponents } from "@/mdx-components";

interface MdxRendererProps {
  serializedSource: MDXRemoteSerializeResult;
}

export const MdxRenderer = ({ serializedSource }: MdxRendererProps) => {
  const components = useMDXComponents({});

  return (
    <div className="mt-8 prose prose-zinc dark:prose-invert max-w-none">
      <MDXRemote 
        {...serializedSource} 
        components={components} 
      />
    </div>
  );
};
