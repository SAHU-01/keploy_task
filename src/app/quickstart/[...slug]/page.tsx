import { getContentBySlug } from "@/lib/mdx/engine";
import { TutorialHeader } from "@/features/keploy-tutorial/components/TutorialHeader";
import { UpNext } from "@/features/keploy-tutorial/components/UpNext";
import { MDXRemote } from "next-mdx-remote/rsc";
import { 
  Step, 
  CodeGroup, 
  CodeTrigger, 
  HeaderSection, 
  Pre, 
  H2, 
  H3,
  Info,
  Alert,
  Callout,
  Note,
  Prerequisites,
  Badge,
  CodeBlock,
  H1,
  P,
  Code,
  Wrapper
} from "@/features/keploy-tutorial/components/mdx";
import { StoreInitializer } from "@/features/keploy-tutorial/components/StoreInitializer";
import { notFound } from "next/navigation";

const mdxComponents = {
  // Client Components
  Step,
  CodeGroup,
  CodeTrigger,
  HeaderSection,
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
  searchParams: Promise<{
    format?: string;
  }>;
}

export default async function QuickstartPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { format } = await searchParams;
  
  // 1. Fetch MDX content using our engine (now includes headers)
  const content = await getContentBySlug(slug);

  if (!content) {
    notFound();
  }

  // Handle raw format request
  if (format === "raw") {
    return (
      <pre className="p-8 font-mono text-sm whitespace-pre-wrap bg-background text-foreground">
        {content.content}
      </pre>
    );
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
      
      {/* 4. Render MDX Content using RSC-compatible MDXRemote */}
      <div className="mt-8 prose prose-zinc dark:prose-invert max-w-none">
        <MDXRemote 
          source={content.content} 
          components={mdxComponents}
        />
      </div>

      {/* 5. Up Next Section & Feedback */}
      <UpNext links={content.data.upNext} />
    </>
  );
}
