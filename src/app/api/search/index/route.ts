import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "src/content/QUICKSTART");

async function getAllMdxFiles(dir: string, fileList: string[] = []) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      await getAllMdxFiles(filePath, fileList);
    } else if (file.endsWith(".mdx")) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

interface SearchResult {
  id: string;
  title: string;
  content: string;
  url: string;
  type: "quickstart" | "doc";
}

export async function GET() {
  try {
    const files = await getAllMdxFiles(CONTENT_DIR);
    const searchData: SearchResult[] = [];

    await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(file, "utf8");
        const { data, content: textContent } = matter(content);
        
        let relativePath = path.relative(CONTENT_DIR, file).replace(/\/_index\.mdx$/, "").replace(/\.mdx$/, "");
        if (relativePath === "") relativePath = "/";
        
        // Index the page itself
        searchData.push({
          id: relativePath,
          title: data.title || "Untitled",
          content: textContent,
          url: `/quickstart/${relativePath}`,
          type: 'page'
        });

        // Index sections (Steps)
        const stepRegex = /<Step[^>]*number={(\d+)}[^>]*title="([^"]+)"[^>]*>/g;
        let match;
        while ((match = stepRegex.exec(textContent)) !== null) {
          const stepNumber = match[1];
          const stepTitle = match[2];
          
          searchData.push({
            id: `${relativePath}-step-${stepNumber}`,
            title: `${data.title} > ${stepTitle}`,
            content: stepTitle,
            url: `/quickstart/${relativePath}#step-${stepNumber}`,
            type: 'section'
          });
        }

        // Index Markdown Headers (## and ###)
        const headerRegex = /^(#{2,3})\s+(.+)$/gm;
        let headerMatch;
        while ((headerMatch = headerRegex.exec(textContent)) !== null) {
          const title = headerMatch[2].trim();
          // Generate a slug-like ID for the header
          const headerId = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          
          searchData.push({
            id: `${relativePath}-header-${headerId}`,
            title: `${data.title} > ${title}`,
            content: title,
            url: `/quickstart/${relativePath}#${headerId}`,
            type: 'header'
          });
        }
      })
    );

    return NextResponse.json(searchData);
  } catch (error) {
    console.error("Search index error:", error);
    return NextResponse.json({ error: "Failed to generate search index" }, { status: 500 });
  }
}
