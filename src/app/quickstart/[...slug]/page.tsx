import React from "react";
import { getContentBySlug } from "@/lib/mdx/engine";
import { TutorialHeader } from "@/features/tutorial-navigation/components/tutorial-header";
import { UpNext } from "@/features/tutorial-navigation/components/up-next";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  Step,
  CodeGroup,
  CodeTrigger,
  HeaderSection,
  Pre,
  H2,
  H3,
  Alert,
  Callout,
  Note,
  Prerequisites,
  Badge,
  CodeBlock,
  H1,
  P,
  Code,
  Wrapper,
  Info,
  Celebrate
} from "@/features/mdx";
import { StoreInitializer } from "@/features/tutorial-core/components/store-initializer";
import { notFound } from "next/navigation";

const mdxComponents = {
  // Client Components
  Step,
  CodeGroup,
  CodeTrigger,
  HeaderSection,
  Celebrate,
  Info,
  pre: Pre,
  h2: H2,
  h3: H3,

  // Server Components
  Alert,
  Callout,
  Note,
  Prerequisites,
  Badge,
  CodeBlock,
  h1: H1,
  p: P,
  code: Code,
  wrapper: Wrapper,
};

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function QuickstartPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Fetch MDX content using our engine (now includes headers)
  const content = await getContentBySlug(slug);

  if (!content) {
    notFound();
  }

  return (
    <>
      {/* 0. Initialize store with server data to prevent flickering */}
      <StoreInitializer 
        rawContent={content.content}
        title={content.data.title}
        files={content.files}
        headers={content.headers}
      />

      {/* 3. TutorialHeader at the top of the main column */}
      <TutorialHeader />
      
      {/* 4. Render MDX Content */}
      <div className="mt-8 prose prose-zinc dark:prose-invert max-w-none">
        <MDXRemote 
          source={content.content} 
          components={mdxComponents}
          options={{
            parseFrontmatter: true,
          }}
        />
      </div>

      {/* 5. Up Next Section & Feedback */}
      <UpNext links={content.data.upNext} />
    </>
  );
}
