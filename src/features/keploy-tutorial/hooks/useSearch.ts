import { useState, useEffect, useCallback } from "react";
import { create, insert, search, type AnyOrama } from "@orama/orama";

interface SearchResult {
  id: string;
  title: string;
  url: string;
}

export function useSearch(query: string) {
  const [db, setDb] = useState<AnyOrama | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize and index data
  useEffect(() => {
    async function initOrama() {
      setIsLoading(true);
      try {
        const oramaDb = await create({
          schema: {
            title: "string",
            content: "string",
            url: "string",
          },
        });

        // Fetch data from API
        const response = await fetch("/api/search/index");
        const data = await response.json();

        if (Array.isArray(data)) {
          for (const item of data) {
            await insert(oramaDb, {
              title: item.title,
              content: item.content,
              url: item.url,
            });
          }
        }

        setDb(oramaDb);
      } catch (e) {
        console.error("Failed to init Orama:", e);
      } finally {
        setIsLoading(false);
      }
    }

    initOrama();
  }, []);

  // Perform search
  useEffect(() => {
    async function performSearch() {
      if (!db || !query) {
        setResults([]);
        return;
      }

      const searchResults = await search(db, {
        term: query,
        properties: ["title", "content"],
        limit: 5,
      });

      const formattedResults = searchResults.hits.map((hit) => ({
        id: hit.id,
        title: (hit.document as any).title,
        url: (hit.document as any).url,
      }));

      setResults(formattedResults);
    }

    const timeout = setTimeout(performSearch, 150);
    return () => clearTimeout(timeout);
  }, [db, query]);

  return { results, isLoading };
}
