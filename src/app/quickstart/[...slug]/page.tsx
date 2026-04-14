import { getContentBySlug } from "@/lib/mdx/engine";
import { TutorialHeader } from "@/features/keploy-tutorial/components/TutorialHeader";
import { UpNext } from "@/features/keploy-tutorial/components/UpNext";
import { serialize } from "next-mdx-remote/serialize";
import { MdxRenderer } from "@/features/keploy-tutorial/components/MdxRenderer";
import { StoreInitializer } from "@/features/keploy-tutorial/components/StoreInitializer";
import { notFound } from "next/navigation";

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

  // 2. Serialize MDX on the server for the Client Component
  const serialized = await serialize(content.content);

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
      
      {/* 4. Pass serialized content to Client-Side MdxRenderer */}
      <MdxRenderer 
        serializedSource={serialized} 
      />

      {/* 5. Up Next Section & Feedback */}
      <UpNext links={content.data.upNext} />
    </>
  );
}
