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

export async function GET() {
  try {
    const files = await getAllMdxFiles(CONTENT_DIR);
    const searchData = await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(file, "utf8");
        const { data, content: textContent } = matter(content);
        
        // Relative path for the URL
        let relativePath = path.relative(CONTENT_DIR, file).replace(/\/_index\.mdx$/, "").replace(/\.mdx$/, "");
        if (relativePath === "") relativePath = "/"; // For root level files if any
        
        return {
          id: relativePath,
          title: data.title || "Untitled",
          content: textContent, // Send full content for indexing
          url: `/quickstart/${relativePath}`,
        };
      })
    );

    return NextResponse.json(searchData);
  } catch (error) {
    console.error("Search index error:", error);
    return NextResponse.json({ error: "Failed to generate search index" }, { status: 500 });
  }
}
