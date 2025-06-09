// hooks/useMediaQuery.ts

import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { z } from 'zod';

// Media Query Configuration Schema
const MediaQueryConfigSchema = z.object({
  breakpoints: z.record(z.string()),
  defaultMatches: z.boolean().optional(),
  ssrMatchMedia: z.function().optional(),
  debounceTime: z.number().optional(),
});

interface MediaQueryOptions {
  breakpoints?: Record<string, string>;
  defaultMatches?: boolean;
  ssrMatchMedia?: (query: string) => { matches: boolean };
  debounceTime?: number;
}

type BreakpointKeys = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Default breakpoints (following Tailwind CSS conventions)
const DEFAULT_BREAKPOINTS: Record<BreakpointKeys, string> = {
  xs: '(min-width: 320px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
};

export function useMediaQuery(
  query?: string,
  options: MediaQueryOptions = {}
) {
  const {
    breakpoints = DEFAULT_BREAKPOINTS,
    defaultMatches = false,
    ssrMatchMedia,
    debounceTime = 100,
  } = options;

  // Validate configuration
  try {
    MediaQueryConfigSchema.parse({
      breakpoints,
      defaultMatches,
      ssrMatchMedia,
      debounceTime,
    });
  } catch (error) {
    console.error('Invalid media query configuration:', error);
  }

  // State for media query matches
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return ssrMatchMedia ? ssrMatchMedia(query || '').matches : defaultMatches;
    }

    return query ? window.matchMedia(query).matches : defaultMatches;
  });

  // State for all breakpoint matches
  const [breakpointMatches, setBreakpointMatches] = useState<Record<string, boolean>>(() => {
    const initialMatches: Record<string, boolean> = {};
    
    if (typeof window === 'undefined') {
      Object.keys(breakpoints).forEach(key => {
        initialMatches[key] = ssrMatchMedia 
          ? ssrMatchMedia(breakpoints[key]).matches 
          : defaultMatches;
      });
    } else {
      Object.keys(breakpoints).forEach(key => {
        initialMatches[key] = window.matchMedia(breakpoints[key]).matches;
      });
    }

    return initialMatches;
  });

  // Debounce function
  const debounce = useCallback((fn: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(), delay);
    };
  }, []);

  // Media query change handler
  const handleChange = useCallback((e: MediaQueryListEvent) => {
    setMatches(e.matches);
    
    // Log media query change
    logMediaQueryChange({
      query: e.media,
      matches: e.matches,
    });
  }, []);

  // Breakpoint change handler
  const handleBreakpointChange = useCallback((key: string, e: MediaQueryListEvent) => {
    setBreakpointMatches(prev => ({
      ...prev,
      [key]: e.matches,
    }));

    // Log breakpoint change
    logMediaQueryChange({
      breakpoint: key,
      query: e.media,
      matches: e.matches,
    });
  }, []);

  // Effect for handling media query changes
  useEffect(() => {
    if (!query || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const debouncedHandler = debounce(
      () => handleChange(new MediaQueryListEvent('change', { matches: mediaQuery.matches, media: query })),
      debounceTime
    );

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', debouncedHandler);
    }
    // Legacy browsers
    else {
      mediaQuery.addListener(debouncedHandler);
    }

    // Initial check
    setMatches(mediaQuery.matches);

    return () => {
      if (mediaQuery.addEventListener) {
        mediaQuery.removeEventListener('change', debouncedHandler);
      } else {
        mediaQuery.removeListener(debouncedHandler);
      }
    };
  }, [query, handleChange, debounce, debounceTime]);

  // Effect for handling breakpoint changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueries = new Map<string, MediaQueryList>();
    const debouncedHandlers = new Map<string, () => void>();

    Object.entries(breakpoints).forEach(([key, mediaQuery]) => {
      const mql = window.matchMedia(mediaQuery);
      const debouncedHandler = debounce(
        () => handleBreakpointChange(key, new MediaQueryListEvent('change', { matches: mql.matches, media: mediaQuery })),
        debounceTime
      );

      mediaQueries.set(key, mql);
      debouncedHandlers.set(key, debouncedHandler);

      if (mql.addEventListener) {
        mql.addEventListener('change', debouncedHandler);
      } else {
        mql.addListener(debouncedHandler);
      }
    });

    return () => {
      mediaQueries.forEach((mql, key) => {
        const handler = debouncedHandlers.get(key);
        if (handler) {
          if (mql.addEventListener) {
            mql.removeEventListener('change', handler);
          } else {
            mql.removeListener(handler);
          }
        }
      });
    };
  }, [breakpoints, handleBreakpointChange, debounce, debounceTime]);

  // Computed properties
  const isXs = useMemo(() => breakpointMatches.xs, [breakpointMatches]);
  const isSm = useMemo(() => breakpointMatches.sm, [breakpointMatches]);
  const isMd = useMemo(() => breakpointMatches.md, [breakpointMatches]);
  const isLg = useMemo(() => breakpointMatches.lg, [breakpointMatches]);
  const isXl = useMemo(() => breakpointMatches.xl, [breakpointMatches]);
  const is2Xl = useMemo(() => breakpointMatches['2xl'], [breakpointMatches]);

  // Current breakpoint
  const currentBreakpoint = useMemo(() => {
    const sortedBreakpoints = Object.entries(breakpointMatches)
      .filter(([_, matches]) => matches)
      .sort(([a], [b]) => {
        const aValue = parseInt(breakpoints[a].match(/\d+/)?.[0] || '0');
        const bValue = parseInt(breakpoints[b].match(/\d+/)?.[0] || '0');
        return bValue - aValue;
      });

    return sortedBreakpoints[0]?.[0] || 'xs';
  }, [breakpointMatches, breakpoints]);

  return {
    matches,
    breakpointMatches,
    currentBreakpoint,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
  };
}

// Helper function to log media query changes
async function logMediaQueryChange(metadata: {
  query: string;
  matches: boolean;
  breakpoint?: string;
}) {
  try {
    await fetch('/api/activity-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'MEDIA_QUERY_CHANGE',
        description: `Media query change: ${metadata.breakpoint || 'custom'} - ${metadata.matches ? 'matched' : 'unmatched'}`,
        metadata,
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-08 07:18:58',
      }),
    });
  } catch (error) {
    console.error('Error logging media query change:', error);
  }
            }
