import { NextRequest, NextResponse } from "next/server";
import { getContentBySlug } from "@/lib/mdx/engine";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
  }

  const slugParts = slug.split("/");
  const content = await getContentBySlug(slugParts);

  if (!content) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  }

  return new NextResponse(content.content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
