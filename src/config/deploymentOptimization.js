/**
 * Deployment Optimization Configuration
 * Strategies for reducing build size and improving load times.
 */

export const deploymentConfig = {
  build: {
    target: 'es2015',
    minify: 'terser', // Aggressive minification
    sourcemap: false, // Disable in production to save generation time/space
    chunkSizeWarningLimit: 1000, // kB
    reportCompressedSize: false, // Speeds up build
  },
  
  assets: {
    imageCompression: {
      enabled: true,
      quality: 80,
    },
    exclude: ['**/*.md', '**/*.txt', '**/docs/**'], // Exclude documentation from build
  },

  codeSplitting: {
    manualChunks: {
      'react-vendor': ['react', 'react-dom', 'react-router-dom'],
      'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'lucide-react'],
      'data-vendor': ['recharts', 'chart.js', 'echarts', 'plotly.js-dist-min'],
      'map-vendor': ['leaflet', 'react-leaflet', 'maplibre-gl', '@deck.gl/core'],
      '3d-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
    }
  }
};

export const reduceBuildSize = (viteConfig) => {
  return {
    ...viteConfig,
    build: {
      ...viteConfig.build,
      ...deploymentConfig.build,
    }
  };
};

export const enableCodeSplitting = (rollupOptions = {}) => {
  return {
    ...rollupOptions,
    output: {
      ...rollupOptions.output,
      manualChunks: (id) => {
        // Custom splitting logic based on node_modules
        if (id.includes('node_modules')) {
          for (const [chunkName, libs] of Object.entries(deploymentConfig.codeSplitting.manualChunks)) {
            if (libs.some(lib => id.includes(lib))) {
              return chunkName;
            }
          }
          return 'vendor'; // Fallback
        }
      }
    }
  };
};