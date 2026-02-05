import React, { Suspense } from 'react';

/**
 * Lazy Loading Configuration Strategy
 * Centralizes the logic for code splitting and prefetching.
 */

// Loading Component (Tiny fallback)
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4 w-full h-full min-h-[200px]">
    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

/**
 * optimizedLazy
 * Wraps React.lazy with a Suspense boundary automatically.
 * 
 * @param {Function} importFn - Dynamic import function
 * @param {React.Component} Fallback - Optional fallback component
 */
export const optimizedLazy = (importFn, Fallback = LoadingSpinner) => {
  const LazyComponent = React.lazy(importFn);

  return (props) => (
    <Suspense fallback={<Fallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * prefetchRoute
 * Helper to prefetch a route's code when the user hovers a link or is likely to navigate.
 * 
 * @param {Function} importFn - The dynamic import function to trigger
 */
export const prefetchRoute = (importFn) => {
  const componentPromise = importFn();
  return componentPromise;
};

export const LAZY_LOAD_CONFIG = {
  timeout: 10000, // Timeout for lazy loading chunks
  errorBoundary: true, // Whether to wrap in error boundary
};

export default {
  optimizedLazy,
  prefetchRoute,
  LAZY_LOAD_CONFIG
};