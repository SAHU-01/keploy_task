import { getContentBySlug } from "@/lib/mdx/engine";
import { TutorialHeader } from "@/features/keploy-tutorial/components/TutorialHeader";
import { CodePane } from "@/features/keploy-tutorial/components/CodePane";
import StripeLayout from "@/components/StripeLayout";
import { serialize } from "next-mdx-remote/serialize";
import { MdxRenderer } from "@/features/keploy-tutorial/components/MdxRenderer";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function QuickstartPage({ params }: PageProps) {
  const { slug } = await params;
  
  // 1. Fetch MDX content using our engine
  const content = await getContentBySlug(slug);

  if (!content) {
    notFound();
  }

  // 2. Serialize MDX on the server for the Client Component
  const serialized = await serialize(content.content);

  return (
    <StripeLayout code={<CodePane />}>
      {/* 3. TutorialHeader at the top of the main column */}
      <TutorialHeader />
      
      {/* 4. Pass serialized content to Client-Side MdxRenderer */}
      <MdxRenderer serializedSource={serialized} />
    </StripeLayout>
  );
}
