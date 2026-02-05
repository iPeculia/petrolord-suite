/**
 * EarthModel Pro - Core Utilities
 * Consolidated math, interpolation, and grid algorithms for Phase 1
 */

// --- Math & Statistics ---
export const statistics = {
  mean: (data) => data.reduce((a, b) => a + b, 0) / data.length,
  min: (data) => Math.min(...data),
  max: (data) => Math.max(...data),
  stdDev: (data) => {
    const m = data.reduce((a, b) => a + b, 0) / data.length;
    return Math.sqrt(data.reduce((sq, n) => sq + Math.pow(n - m, 2), 0) / data.length);
  },
  percentile: (data, p) => {
    const sorted = [...data].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
  }
};

// --- Interpolation Algorithms ---
export const interpolation = {
  // Simple IDW implementation for frontend preview
  idw: (points, width, height, power = 2) => {
    const grid = new Float32Array(width * height);
    const xMin = Math.min(...points.map(p => p.x));
    const xMax = Math.max(...points.map(p => p.x));
    const yMin = Math.min(...points.map(p => p.y));
    const yMax = Math.max(...points.map(p => p.y));
    
    const dx = (xMax - xMin) / (width - 1);
    const dy = (yMax - yMin) / (height - 1);

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const gx = xMin + i * dx;
        const gy = yMin + j * dy;
        
        let num = 0;
        let den = 0;
        
        for (const p of points) {
          const d = Math.sqrt(Math.pow(gx - p.x, 2) + Math.pow(gy - p.y, 2));
          if (d === 0) {
            num = p.z;
            den = 1;
            break; // Exact match
          }
          const w = 1 / Math.pow(d, power);
          num += w * p.z;
          den += w;
        }
        
        grid[j * width + i] = den === 0 ? 0 : num / den;
      }
    }
    return { grid, xMin, xMax, yMin, yMax, dx, dy };
  }
};

// --- Grid Generation ---
export const gridGenerator = {
  generateCornerPointGrid: (nx, ny, nz, horizons) => {
    // Mock generation of a corner point grid structure
    const cells = [];
    const count = nx * ny * nz;
    
    // Generate simple blocky cells for visualization
    for(let i=0; i<nx; i++) {
        for(let j=0; j<ny; j++) {
            for(let k=0; k<nz; k++) {
                cells.push({
                    i, j, k,
                    active: Math.random() > 0.1, // 10% inactive
                    phi: 0.1 + Math.random() * 0.25,
                    perm: Math.exp(Math.random() * 5),
                    sw: Math.random()
                });
            }
        }
    }
    return { nx, ny, nz, cells, type: 'corner_point' };
  }
};

// --- Volume Calculation ---
export const volumeCalc = {
    compute: (grid, properties) => {
        // Simple accumulation
        let grv = 0;
        let nrv = 0;
        let pv = 0;
        let hc = 0;
        const cellVol = 100 * 100 * 10; // Mock cell volume 100x100x10m
        
        grid.cells.forEach(cell => {
            if(cell.active) {
                grv += cellVol;
                if(cell.phi > properties.phiCutoff) {
                    nrv += cellVol;
                    pv += cellVol * cell.phi;
                    hc += cellVol * cell.phi * (1 - cell.sw);
                }
            }
        });
        
        return { grv, nrv, pv, hc };
    }
};