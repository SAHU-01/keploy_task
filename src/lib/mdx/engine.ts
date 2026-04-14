import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const BASE_DIR = path.join(process.cwd(), 'src/content/QUICKSTART');

export interface MDXContent {
  data: {
    title: string;
    description?: string;
    upNext?: Array<{
      title: string;
      href: string;
      description: string;
    }>;
    [key: string]: unknown;
  };
  content: string;
  files: Record<string, string>;
  headers: Array<{ id: string; title: string; level: number }>;
}

/**
 * Reads and parses an MDX file based on a slug array.
 * Also reads all other files in the same directory as code files.
 */
export async function getContentBySlug(slug: string[]): Promise<MDXContent | null> {
  const slugPath = path.join(...slug);
  const fullPath = path.join(BASE_DIR, slugPath);
  
  const indexPath = path.join(fullPath, '_index.mdx');

  try {
    const stats = await fs.stat(indexPath);
    if (stats.isFile()) {
      const fileContents = await fs.readFile(indexPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Extract headers and steps on the server
      const extractedHeaders: Array<{ id: string; title: string; level: number }> = [];
      
      // 1. Extract Steps
      const stepRegex = /<Step\s+[^>]*number={(\d+)}\s+[^>]*title="([^"]+)"[^>]*>/g;
      let match;
      while ((match = stepRegex.exec(content)) !== null) {
        extractedHeaders.push({
          id: `step-${match[1]}`,
          title: `Step ${match[1]}: ${match[2]}`,
          level: 2
        });
      }

      // 2. Extract markdown headers
      const headerRegex = /^(#{2,3})\s+(.+)$/gm;
      while ((match = headerRegex.exec(content)) !== null) {
        const level = match[1].length;
        const titleText = match[2].trim();
        const id = titleText.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        extractedHeaders.push({
          id,
          title: titleText,
          level
        });
      }

      // Read files in the 'panel' directory as code snippets
      const panelPath = path.join(fullPath, 'panel');
      const codeFiles: Record<string, string> = {};

      try {
        const panelStats = await fs.stat(panelPath);
        if (panelStats.isDirectory()) {
          const dirFiles = await fs.readdir(panelPath);
          for (const fileName of dirFiles) {
            if (!fileName.startsWith('.')) {
              const filePath = path.join(panelPath, fileName);
              const fileStats = await fs.stat(filePath);
              if (fileStats.isFile()) {
                codeFiles[fileName] = await fs.readFile(filePath, 'utf8');
              }
            }
          }
        }
      } catch {
        // If panel directory doesn't exist, we just have no code files
      }

      return { data, content, files: codeFiles, headers: extractedHeaders };
    }
  } catch {
    return getComingSoonFallback();
  }

  return getComingSoonFallback();
}

async function getComingSoonFallback(): Promise<MDXContent | null> {
  const fallbackPath = path.join(BASE_DIR, 'coming-soon.mdx');
  try {
    const fileContents = await fs.readFile(fallbackPath, 'utf8');
    const { data, content } = matter(fileContents);
    return { data, content, files: {}, headers: [] };
  } catch {
    console.error('Fallback content (coming-soon.mdx) not found in QUICKSTART directory.');
    return null;
  }
}
