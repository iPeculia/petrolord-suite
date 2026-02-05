export const supportArticles = [
  {
    id: 'tr-1',
    title: 'Common Issues & Fixes',
    category: 'Troubleshooting',
    content: `
# Common Issues

## 3D Viewer is Black or Blank
**Cause:** WebGL context loss or outdated GPU drivers.
**Fix:** 
1. Refresh the page.
2. Update your browser and graphics drivers.
3. Check if "Hardware Acceleration" is enabled in browser settings.

## Import Fails for CSV
**Cause:** Incorrect header mapping or delimiter.
**Fix:** 
1. Ensure the file is comma-delimited (or check the preview settings).
2. Verify that numeric columns don't contain text characters.
3. Ensure depth columns (MD/TVD) are present.

## Simulation is Slow
**Cause:** Grid resolution is too high.
**Fix:** 
1. Reduce the number of cells (Upscale).
2. Use a Region of Interest (ROI) to simulate only a sector.
    `,
    tags: ['errors', 'bugs', 'help'],
    difficulty: 'Beginner',
    lastUpdated: '2025-12-05'
  },
  {
    id: 'bp-1',
    title: 'Modeling Best Practices',
    category: 'Best Practices',
    content: `
# Modeling Best Practices

- **QC Input Data:** Garbage in, garbage out. Always visualize and check well tops and logs before modeling.
- **Start Simple:** Build a coarse grid first to test the structural framework before refining for property modeling.
- **Version Control:** Save major milestones (e.g., "Structural Framework Complete", "Facies Modeled") as separate project versions or backups.
- **Document Assumptions:** Use the "Notes" feature in the project settings to record parameters like variogram ranges and trends.
    `,
    tags: ['tips', 'workflow', 'optimization'],
    difficulty: 'Intermediate',
    lastUpdated: '2025-10-01'
  },
  {
    id: 'gl-1',
    title: 'Geological Terms Glossary',
    category: 'Glossary',
    content: `
# Glossary

**Anticline:** A fold of rock layers that slopes downward on both sides of a common crest.
**Facies:** The sum of the lithological and paleontological characteristics of a deposit.
**Horizon:** An interface in the subsurface, often interpreted from seismic or well tops.
**Kriging:** A geostatistical interpolation method that minimizes the estimated error variance.
**Porosity:** The percentage of void space in a rock.
**Permeability:** The ability of a rock to transmit fluids.
**Variogram:** A function describing the degree of spatial dependence of a spatial random field.
    `,
    tags: ['dictionary', 'terms', 'definitions'],
    difficulty: 'Beginner',
    lastUpdated: '2025-08-20'
  }
];