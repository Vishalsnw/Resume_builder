// hooks/usePagination.ts

import usePagination from '@/hooks/usePagination';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { z } from 'zod';

interface PaginationOptions<T> {
  data: T[];
  pageSize?: number;
  initialPage?: number;
  syncWithUrl?: boolean;
  urlParam?: string;
  sortKey?: keyof T;
  sortDir?: 'asc' | 'desc';
  filters?: Record<string, any>;
  infiniteScroll?: boolean;
  onPageChange?: (page: number) => void;
}

interface PaginationMetrics {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  startIndex: number;
  endIndex: number;
}

// Validation schema for pagination parameters
const PaginationParamsSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(100),
  sortKey: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
  filters: z.record(z.unknown()).optional(),
});

export function usePagination<T>({
  data,
  pageSize = 10,
  initialPage = 1,
  syncWithUrl = false,
  urlParam = 'page',
  sortKey,
  sortDir = 'asc',
  filters = {},
  infiniteScroll = false,
  onPageChange,
}: PaginationOptions<T>) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [currentSortKey, setCurrentSortKey] = useState<keyof T | undefined>(sortKey);
  const [currentSortDir, setCurrentSortDir] = useState(sortDir);
  const [currentFilters, setCurrentFilters] = useState(filters);
  const [loadedPages, setLoadedPages] = useState<number[]>([initialPage]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate pagination metrics
  const metrics = useMemo<PaginationMetrics>(() => {
    const filteredData = applyFilters(data, currentFilters);
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / currentPageSize);
    const startIndex = (currentPage - 1) * currentPageSize;
    const endIndex = Math.min(startIndex + currentPageSize, totalItems);

    return {
      totalPages,
      totalItems,
      currentPage,
      pageSize: currentPageSize,
      startIndex,
      endIndex,
    };
  }, [data, currentPage, currentPageSize, currentFilters]);

  // Filter data based on current filters
  const applyFilters = useCallback((items: T[], filters: Record<string, any>): T[] => {
    return items.filter(item =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = (item as any)[key];
        return Array.isArray(value)
          ? value.includes(itemValue)
          : itemValue === value;
      })
    );
  }, []);

  // Sort data based on current sort parameters
  const sortData = useCallback((items: T[]): T[] => {
    if (!currentSortKey) return items;

    return [...items].sort((a, b) => {
      const aVal = a[currentSortKey];
      const bVal = b[currentSortKey];
      
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return currentSortDir === 'asc' ? comparison : -comparison;
    });
  }, [currentSortKey, currentSortDir]);

  // Get current page data
  const paginatedData = useMemo(() => {
    const filteredData = applyFilters(data, currentFilters);
    const sortedData = sortData(filteredData);
    
    if (infiniteScroll) {
      return sortedData.slice(0, currentPage * currentPageSize);
    }

    return sortedData.slice(
      (currentPage - 1) * currentPageSize,
      currentPage * currentPageSize
    );
  }, [
    data,
    currentPage,
    currentPageSize,
    currentFilters,
    infiniteScroll,
    applyFilters,
    sortData,
  ]);

  // Sync with URL if enabled
  useEffect(() => {
    if (syncWithUrl && router.isReady) {
      const queryPage = Number(router.query[urlParam]) || initialPage;
      if (queryPage !== currentPage) {
        setCurrentPage(queryPage);
      }
    }
  }, [router.query, router.isReady, syncWithUrl, urlParam, initialPage, currentPage]);

  // Page navigation handlers
  const goToPage = useCallback(async (page: number) => {
    try {
      setIsLoading(true);

      // Validate page number
      const validatedParams = PaginationParamsSchema.parse({
        page,
        pageSize: currentPageSize,
        sortKey: currentSortKey,
        sortDir: currentSortDir,
      });

      if (syncWithUrl) {
        await router.push({
          query: {
            ...router.query,
            [urlParam]: validatedParams.page,
          },
        });
      }

      setCurrentPage(validatedParams.page);
      
      if (infiniteScroll) {
        setLoadedPages(prev => [...prev, validatedParams.page]);
      }

      onPageChange?.(validatedParams.page);

      // Log page change
      await logPaginationActivity('PAGE_CHANGE', {
        page: validatedParams.page,
        pageSize: currentPageSize,
      });

    } catch (error) {
      console.error('Pagination error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [
    router,
    syncWithUrl,
    urlParam,
    currentPageSize,
    currentSortKey,
    currentSortDir,
    infiniteScroll,
    onPageChange,
  ]);

  const nextPage = useCallback(() => {
    if (currentPage < metrics.totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, metrics.totalPages, goToPage]);

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  // Update sort parameters
  const updateSort = useCallback(async (key: keyof T) => {
    const newSortDir = key === currentSortKey && currentSortDir === 'asc' ? 'desc' : 'asc';
    setCurrentSortKey(key);
    setCurrentSortDir(newSortDir);

    await logPaginationActivity('SORT_CHANGE', {
      sortKey: key,
      sortDir: newSortDir,
    });
  }, [currentSortKey, currentSortDir]);

  // Update filters
  const updateFilters = useCallback(async (newFilters: Record<string, any>) => {
    setCurrentFilters(newFilters);
    setCurrentPage(1);

    await logPaginationActivity('FILTER_CHANGE', {
      filters: newFilters,
    });
  }, []);

  // Update page size
  const updatePageSize = useCallback(async (newSize: number) => {
    try {
      const validatedParams = PaginationParamsSchema.parse({
        page: 1,
        pageSize: newSize,
      });

      setCurrentPageSize(validatedParams.pageSize);
      setCurrentPage(1);

      await logPaginationActivity('PAGE_SIZE_CHANGE', {
        pageSize: validatedParams.pageSize,
      });

    } catch (error) {
      console.error('Page size update error:', error);
    }
  }, []);

  return {
    data: paginatedData,
    metrics,
    currentPage,
    pageSize: currentPageSize,
    isLoading,
    goToPage,
    nextPage,
    previousPage,
    updateSort,
    updateFilters,
    updatePageSize,
    sortKey: currentSortKey,
    sortDir: currentSortDir,
    filters: currentFilters,
    loadedPages,
  };
}

// Helper function to log pagination activity
async function logPaginationActivity(
  actionType: 'PAGE_CHANGE' | 'SORT_CHANGE' | 'FILTER_CHANGE' | 'PAGE_SIZE_CHANGE',
  metadata: Record<string, any>
) {
  try {
    await fetch('/api/activity-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: `PAGINATION_${actionType}`,
        description: `Pagination ${actionType.toLowerCase().replace('_', ' ')}`,
        metadata,
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-08 07:14:47',
      }),
    });
  } catch (error) {
    console.error('Error logging pagination activity:', error);
  }
}
