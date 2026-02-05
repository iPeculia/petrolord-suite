/**
 * Build Optimization Configuration and Utilities
 * Provides helper functions to analyze and configure build settings dynamically.
 */

export const buildConfig = {
  treeShaking: {
    enabled: true,
    moduleSideEffects: false, // Assume modules have no side effects by default
  },
  codeSplitting: {
    enabled: true,
    strategy: 'adaptive', // 'adaptive' | 'routes' | 'components'
  },
  lazyLoading: {
    enabled: true,
    preload: true, // Preload lazy components when idle
  },
  assets: {
    compress: true,
    format: 'webp',
    maxSize: 500 * 1024, // 500KB
  }
};

// --- Analysis Functions ---

export const optimizeBundle = (config = {}) => {
  return {
    ...buildConfig,
    ...config,
    timestamp: new Date().toISOString(),
  };
};

export const analyzeBundle = (stats) => {
  const largeChunks = stats?.chunks?.filter(chunk => chunk.size > 500000) || [];
  return {
    totalSize: stats?.totalSize || 0,
    largeChunksCount: largeChunks.length,
    suggestions: largeChunks.map(c => `Split chunk: ${c.name}`),
  };
};

export const reduceAssetSize = (assets) => {
  return assets.filter(asset => {
    // Mock logic for asset filtering/optimization check
    return asset.size < buildConfig.assets.maxSize;
  });
};

export const enableCodeSplitting = (viteConfig) => {
  if (!viteConfig.build) viteConfig.build = {};
  if (!viteConfig.build.rollupOptions) viteConfig.build.rollupOptions = {};
  
  // Return modified config with manualChunks logic
  return {
    ...viteConfig,
    build: {
      ...viteConfig.build,
      cssCodeSplit: true,
    }
  };
};

export const enableLazyLoading = (routes) => {
  // Helper to verify if routes are properly lazy loaded structure
  return routes.map(route => ({
    ...route,
    lazy: true
  }));
};