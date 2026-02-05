import React, { memo, lazy, Suspense } from 'react';
import { memoizeSimple, withPerformanceTracking } from '@/utils/memoization';
import { useMemoizedCalculation } from '@/hooks/useMemoizedCalculation';
import { useMemoizedCallback } from '@/hooks/useMemoizedCallback';

/**
 * React Component Optimization Configuration & Utilities
 * Refactored to separate hooks from pure JS utilities to fix React rules violations.
 */

// --- React Hooks (Re-exported) ---
// Use these INSIDE components only
export { useMemoizedCalculation as useCalculation };
export { useMemoizedCallback as useCallbackWrapper };

// --- HOCs (Higher Order Components) ---

/**
 * Higher Order Component for memoization with display name
 */
export const memoizeComponent = (Component, arePropsEqual) => {
  const Memoized = memo(Component, arePropsEqual);
  Memoized.displayName = `Memoized(${Component.displayName || Component.name || 'Component'})`;
  return Memoized;
};

// --- Pure JS Utilities (Safe for config files) ---

/**
 * Legacy wrapper for backward compatibility or pure JS usage.
 * WARNING: Does NOT use React hooks. Uses simple closure caching.
 */
export const memoizeCalculation = (fn) => {
  return memoizeSimple(fn);
};

/**
 * Legacy wrapper for callback.
 * Simply wraps with error handling/perf tracking in pure JS context.
 */
export const memoizeCallback = (fn) => {
  return withPerformanceTracking(fn, 'Callback');
};

// --- Routing Optimization ---

export const splitCodeByRoute = (importFn) => {
  const LazyComponent = lazy(importFn);
  return (props) => (
    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground animate-pulse">Loading route...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export const lazyLoadComponent = (importFn, Fallback) => {
  const LazyComponent = lazy(importFn);
  return (props) => (
    <Suspense fallback={Fallback || <div className="h-32 w-full bg-muted/20 animate-pulse rounded-md" />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};