// hooks/useSearch.ts

import { default as indexImport } from '@/pages/help/index';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';

// NOTE: Renamed to avoid conflict with local declarations:
// index → indexImport
import useLocalStorage from '@/hooks/useLocalStorage';
import useDebounce from '@/hooks/useDebounce';
import useSearch from '@/hooks/useSearch';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { useLocalStorage } from './useLocalStorage';
import { z } from 'zod';

// Search configuration schema
const SearchConfigSchema = z.object({
  minLength: z.number().min(1).max(50),
  debounceTime: z.number().min(0),
  maxHistory: z.number().min(0),
  fuzzyMatch: z.boolean(),
  caseSensitive: z.boolean(),
  searchFields: z.array(z.string()),
  weightedFields: z.record(z.number()).optional(),
});

type SearchConfig = z.infer<typeof SearchConfigSchema>;

interface SearchOptions<T> extends Partial<SearchConfig> {
  initialQuery?: string;
  onSearch?: (results: T[], query: string) => void;
  onError?: (error: Error) => void;
  transformResults?: (results: T[]) => T[];
  filterResults?: (item: T, query: string) => boolean;
}

interface SearchMetrics {
  totalResults: number;
  searchTime: number;
  lastQuery: string;
  timestamp: string;
}

export function useSearch<T>(
  data: T[],
  {
    minLength = 2,
    debounceTime = 300,
    maxHistory = 10,
    fuzzyMatch = true,
    caseSensitive = false,
    searchFields = [],
    weightedFields = {},
    initialQuery = '',
    onSearch,
    onError,
    transformResults,
    filterResults,
  }: SearchOptions<T> = {}
) {
  // State management
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [metrics, setMetrics] = useState<SearchMetrics>({
    totalResults: 0,
    searchTime: 0,
    lastQuery: '',
    timestamp: new Date().toISOString(),
  });

  // Search history management
  const { storedValue: searchHistory, setValue: setSearchHistory } = useLocalStorage({
    key: 'search_history',
    initialValue: [] as string[],
    validator: z.array(z.string()),
    maxItems: maxHistory,
  });

  // Refs for search state
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchIndexRef = useRef<Map<string, Set<number>>>(new Map());

  // Build search index
  useEffect(() => {
    const index = new Map<string, Set<number>>();
    
    data.forEach((item, idx) => {
      searchFields.forEach(field => {
        const value = String(getNestedValue(item, field));
        const terms = tokenizeString(value);
        
        terms.forEach(term => {
          if (!index.has(term)) {
            index.set(term, new Set());
          }
          index.get(term)?.add(idx);
        });
      });
    });

    searchIndexRef.current = index;
  }, [data, searchFields]);

  // Debounced search function
  const { debouncedCallback: debouncedSearch } = useDebounce({
    delay: debounceTime,
    onError: (error) => {
      setError(error as Error);
      onError?.(error as Error);
    },
  });

  // Main search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < minLength) {
      setResults([]);
      setMetrics(prev => ({
        ...prev,
        totalResults: 0,
        lastQuery: searchQuery,
      }));
      return;
    }

    try {
      // Cancel previous search if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsSearching(true);
      setError(null);
      const startTime = performance.now();

      // Get matching indices from index
      const matchingIndices = new Set<number>();
      const searchTerms = tokenizeString(searchQuery);

      searchTerms.forEach(term => {
        const normalizedTerm = caseSensitive ? term : term.toLowerCase();
        
        searchIndexRef.current.forEach((indices, indexTerm) => {
          const normalizedIndexTerm = caseSensitive ? indexTerm : indexTerm.toLowerCase();
          
          if (fuzzyMatch ? fuzzyMatch(normalizedTerm, normalizedIndexTerm) : normalizedIndexTerm.includes(normalizedTerm)) {
            indices.forEach(idx => matchingIndices.add(idx));
          }
        });
      });

      // Get results from matching indices
      let searchResults = Array.from(matchingIndices).map(idx => data[idx]);

      // Apply custom filter if provided
      if (filterResults) {
        searchResults = searchResults.filter(item => filterResults(item, searchQuery));
      }

      // Apply result transformation if provided
      if (transformResults) {
        searchResults = transformResults(searchResults);
      }

      // Sort results by relevance
      searchResults.sort((a, b) => 
        calculateRelevance(b, searchQuery) - calculateRelevance(a, searchQuery)
      );

      const endTime = performance.now();

      // Update metrics
      const newMetrics: SearchMetrics = {
        totalResults: searchResults.length,
        searchTime: endTime - startTime,
        lastQuery: searchQuery,
        timestamp: new Date().toISOString(),
      };

      setResults(searchResults);
      setMetrics(newMetrics);
      onSearch?.(searchResults, searchQuery);

      // Update search history
      if (searchQuery.trim() && searchResults.length > 0) {
        updateSearchHistory(searchQuery);
      }

      // Log search activity
      await logSearchActivity({
        query: searchQuery,
        resultCount: searchResults.length,
        searchTime: newMetrics.searchTime,
      });

    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setError(error);
        onError?.(error);
      }
    } finally {
      setIsSearching(false);
    }
  }, [
    data,
    minLength,
    fuzzyMatch,
    caseSensitive,
    filterResults,
    transformResults,
    onSearch,
    onError,
  ]);

  // Handle search query updates
  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery);
    debouncedSearch(newQuery);
  }, [debouncedSearch]);

  // Update search history
  const updateSearchHistory = useCallback((searchQuery: string) => {
    setSearchHistory(prev => {
      const newHistory = [
        searchQuery,
        ...prev.filter(q => q !== searchQuery),
      ].slice(0, maxHistory);
      return newHistory;
    });
  }, [setSearchHistory, maxHistory]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setMetrics(prev => ({
      ...prev,
      totalResults: 0,
      lastQuery: '',
    }));
  }, []);

  // Helper functions
  function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  function tokenizeString(str: string): string[] {
    return str.split(/\s+/).filter(Boolean);
  }

  function fuzzyMatch(query: string, target: string): boolean {
    let queryIdx = 0;
    let targetIdx = 0;

    while (queryIdx < query.length && targetIdx < target.length) {
      if (query[queryIdx] === target[targetIdx]) {
        queryIdx++;
      }
      targetIdx++;
    }

    return queryIdx === query.length;
  }

  function calculateRelevance(item: T, searchQuery: string): number {
    let score = 0;

    searchFields.forEach(field => {
      const value = String(getNestedValue(item, field));
      const weight = weightedFields?.[field] || 1;

      if (value.toLowerCase().includes(searchQuery.toLowerCase())) {
        score += weight;
      }
    });

    return score;
  }

  return {
    query,
    results,
    isSearching,
    error,
    metrics,
    searchHistory,
    handleSearch,
    clearSearch,
  };
}

// Helper function to log search activity
async function logSearchActivity(metadata: {
  query: string;
  resultCount: number;
  searchTime: number;
}) {
  try {
    await fetch('/api/activity-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'SEARCH_PERFORMED',
        description: `Search performed: "${metadata.query}"`,
        metadata,
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-08 07:16:58',
      }),
    });
  } catch (error) {
    console.error('Error logging search activity:', error);
  }
        }
