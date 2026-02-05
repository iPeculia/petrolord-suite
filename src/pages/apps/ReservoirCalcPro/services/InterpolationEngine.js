/**
 * Engine for spatial interpolation using Inverse Distance Weighting (IDW).
 * Includes spatial binning for performance optimization.
 */
export class InterpolationEngine {
    constructor(points) {
        this.points = points || [];
        this.bins = new Map();
        this.binSize = 0;
        this.bounds = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
        
        if (this.points.length > 0) {
            this._calculateBounds();
            this._buildSpatialIndex();
        }
    }

    _calculateBounds() {
        this.points.forEach(p => {
            if (p.x < this.bounds.minX) this.bounds.minX = p.x;
            if (p.x > this.bounds.maxX) this.bounds.maxX = p.x;
            if (p.y < this.bounds.minY) this.bounds.minY = p.y;
            if (p.y > this.bounds.maxY) this.bounds.maxY = p.y;
        });
    }

    _buildSpatialIndex() {
        // Heuristic: target ~50-100 points per bin for balance
        const width = this.bounds.maxX - this.bounds.minX;
        const height = this.bounds.maxY - this.bounds.minY;
        
        // If points are very sparse or few, just use one bin (brute force)
        if (this.points.length < 200) {
            this.binSize = Math.max(width, height) * 2; // Effectively infinite
        } else {
            // Sqrt(N) bins per axis roughly
            const axisDivs = Math.ceil(Math.sqrt(this.points.length / 20)); 
            this.binSize = Math.max(width, height) / axisDivs;
        }

        this.points.forEach(p => {
            const key = this._getBinKey(p.x, p.y);
            if (!this.bins.has(key)) {
                this.bins.set(key, []);
            }
            this.bins.get(key).push(p);
        });
    }

    _getBinKey(x, y) {
        const bx = Math.floor(x / this.binSize);
        const by = Math.floor(y / this.binSize);
        return `${bx},${by}`;
    }

    /**
     * Finds k-nearest neighbors to a point (x, y).
     * Uses spatial binning to avoid O(N) scan.
     */
    findNearest(x, y, k = 8) {
        const neighbors = [];
        
        // Start with the bin containing the point
        const bx = Math.floor(x / this.binSize);
        const by = Math.floor(y / this.binSize);
        
        // Check current bin and adjacent bins (3x3 grid)
        // For robustness with small k, we might need to expand search if not enough points found
        // Simple implementation: Check immediate neighbors. If not enough, assume sparse data or edge.
        const searchRadius = 2; // Check 5x5 grid of bins to be safe
        
        for (let i = -searchRadius; i <= searchRadius; i++) {
            for (let j = -searchRadius; j <= searchRadius; j++) {
                const key = `${bx + i},${by + j}`;
                if (this.bins.has(key)) {
                    const binPoints = this.bins.get(key);
                    for (const p of binPoints) {
                        const distSq = (p.x - x)**2 + (p.y - y)**2;
                        neighbors.push({ point: p, distSq });
                    }
                }
            }
        }

        // Sort by distance and take top k
        // Optimization: Partial sort or heap would be better for huge datasets, 
        // but JS array sort is highly optimized V8.
        neighbors.sort((a, b) => a.distSq - b.distSq);
        
        // Fallback: If spatial index failed to find enough points (e.g. point far outside bounds),
        // scan all points (slow path)
        if (neighbors.length < k && this.points.length > 0) {
             // Brute force fallback
             const allNeighbors = this.points.map(p => ({
                 point: p,
                 distSq: (p.x - x)**2 + (p.y - y)**2
             })).sort((a, b) => a.distSq - b.distSq);
             return allNeighbors.slice(0, k);
        }

        return neighbors.slice(0, k);
    }

    /**
     * Predict value at (x, y) using IDW
     * @param {number} x 
     * @param {number} y 
     * @param {number} power - Power parameter (usually 2)
     * @param {number} k - Number of neighbors
     * @returns {number} Interpolated value (Z)
     */
    predict(x, y, power = 2, k = 12) {
        const nearest = this.findNearest(x, y, k);
        
        if (nearest.length === 0) return 0;

        let numerator = 0;
        let denominator = 0;

        for (const item of nearest) {
            const dist = Math.sqrt(item.distSq);
            
            // Exact match check
            if (dist < 0.0001) return item.point.z;

            const weight = 1 / Math.pow(dist, power);
            numerator += weight * item.point.z;
            denominator += weight;
        }

        if (denominator === 0) return 0;
        return numerator / denominator;
    }
}