import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const BASE_DIR = path.join(process.cwd(), 'src/content/QUICKSTART');

export interface MDXContent {
  data: Record<string, any>;
  content: string;
}

/**
 * Reads and parses an MDX file based on a slug array.
 * Path structure: src/content/QUICKSTART/[lang]/[env]/[sample]/_index.mdx
 */
export async function getContentBySlug(slug: string[]): Promise<MDXContent | null> {
  const slugPath = path.join(...slug);
  const fullPath = path.join(BASE_DIR, slugPath);
  
  // Target: [path]/_index.mdx
  const indexPath = path.join(fullPath, '_index.mdx');

  try {
    const stats = await fs.stat(indexPath);
    if (stats.isFile()) {
      const fileContents = await fs.readFile(indexPath, 'utf8');
      const { data, content } = matter(fileContents);
      return { data, content };
    }
  } catch (e) {
    // Path doesn't exist or _index.mdx missing, try fallback
    return getComingSoonFallback();
  }

  return getComingSoonFallback();
}

/**
 * Fallback to coming-soon.mdx if the requested quickstart is not yet available.
 */
async function getComingSoonFallback(): Promise<MDXContent | null> {
  const fallbackPath = path.join(BASE_DIR, 'coming-soon.mdx');
  try {
    const fileContents = await fs.readFile(fallbackPath, 'utf8');
    const { data, content } = matter(fileContents);
    return { data, content };
  } catch (e) {
    console.error('Fallback content (coming-soon.mdx) not found in QUICKSTART directory.');
    return null;
  }
}
