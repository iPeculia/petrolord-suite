# Performance Guide

## Frontend Optimization
*   **Code Splitting**: Route-based lazy loading reduces initial bundle size. Heavy libraries (Three.js, ECharts) are loaded only when needed.
*   **Tree Shaking**: Unused exports are removed during the Vite build process.
*   **Asset Optimization**: Images use WebP format; Icons are SVGs.

## Rendering Optimization
*   **3D LOD**: The 3D Viewer implements Level-of-Detail strategies, reducing geometry complexity for distant objects.
*   **Canvas Virtualization**: The Well Correlation view uses virtualization for logs with high sampling rates to maintain 60fps scrolling.
*   **WebGL Instance Rendering**: Used for rendering thousands of seismic points or well markers efficiently.

## Data Optimization
*   **Pagination**: All list APIs (Projects, Wells) are paginated.
*   **Decimation**: Large datasets (well logs) are downsampled for display based on zoom level.
*   **Edge Caching**: Static assets and public tiles are cached at the Edge (CDN).

## Monitoring
*   **Performance Profiler**: Accessible in Admin Center > Engineering. Tracks FCP, LCP, and TTI metrics.