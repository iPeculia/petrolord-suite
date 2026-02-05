export class SurfaceInterpolator {
    constructor(points) {
        this.points = points; 
        this.bounds = this.calculateBounds();
        // Spatial Indexing Parameters
        this.buckets = new Map();
        this.bucketSize = 0;
        this.cols = 0;
        this.rows = 0;
        
        if (this.points && this.points.length > 50) {
            this.buildSpatialIndex();
        }
    }

    calculateBounds() {
        if (!this.points || this.points.length === 0) return { minX: 0, maxX: 100, minY: 0, maxY: 100, minZ: 0, maxZ: 0 };
        
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
        for (const p of this.points) {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
            if (p.z < minZ) minZ = p.z;
            if (p.z > maxZ) maxZ = p.z;
        }
        return { minX, maxX, minY, maxY, minZ, maxZ };
    }

    buildSpatialIndex() {
        const { minX, maxX, minY, maxY } = this.bounds;
        const count = this.points.length;
        
        // Heuristic for bucket size: aim for ~10-20 points per bucket
        // Total Area / (Count / 15) -> Bucket Area
        const width = Math.max(maxX - minX, 1);
        const height = Math.max(maxY - minY, 1);
        
        // Divide space into a grid
        const gridDim = Math.ceil(Math.sqrt(count / 10)); // e.g., 1000 points -> 10x10 grid
        this.cols = gridDim;
        this.rows = gridDim;
        
        this.bucketWidth = width / this.cols;
        this.bucketHeight = height / this.rows;

        // Fill buckets
        for (const p of this.points) {
            const col = Math.min(Math.floor((p.x - minX) / this.bucketWidth), this.cols - 1);
            const row = Math.min(Math.floor((p.y - minY) / this.bucketHeight), this.rows - 1);
            const key = `${col},${row}`;
            
            if (!this.buckets.has(key)) {
                this.buckets.set(key, []);
            }
            this.buckets.get(key).push(p);
        }
    }

    getNeighbors(x, y, radius) {
        if (!this.buckets.size) return this.points; // Fallback to all points if small dataset

        const { minX, minY } = this.bounds;
        const col = Math.min(Math.floor((x - minX) / this.bucketWidth), this.cols - 1);
        const row = Math.min(Math.floor((y - minY) / this.bucketHeight), this.rows - 1);
        
        // Search current and adjacent buckets (3x3 grid)
        let neighbors = [];
        
        // Determine search range based on radius if provided, else just immediate neighbors
        // For IDW, simple 3x3 usually suffices if bucket size is reasonable
        const range = 1; 

        for (let i = -range; i <= range; i++) {
            for (let j = -range; j <= range; j++) {
                const c = col + i;
                const r = row + j;
                if (c >= 0 && c < this.cols && r >= 0 && r < this.rows) {
                    const key = `${c},${r}`;
                    const bucket = this.buckets.get(key);
                    if (bucket) {
                        neighbors = neighbors.concat(bucket);
                    }
                }
            }
        }
        
        // If we found too few neighbors, expand search (edge case)
        if (neighbors.length < 5) {
             return this.points; // Fallback to full search if sparse
        }

        return neighbors;
    }

    predict(x, y, power = 2, radius = Infinity) {
        const pointsToCheck = this.getNeighbors(x, y, radius);
        
        let numerator = 0;
        let denominator = 0;
        let minDist = Infinity;
        let closestZ = 0;

        for (const p of pointsToCheck) {
            const distSq = Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2);
            const dist = Math.sqrt(distSq);
            
            if (dist < 0.0001) return p.z; 
            
            // Optimization: If radius is defined, skip
            if (radius !== Infinity && dist > radius) continue;

            // IDW Calculation
            const weight = 1 / Math.pow(dist, power);
            numerator += weight * p.z;
            denominator += weight;

            if (dist < minDist) {
                minDist = dist;
                closestZ = p.z;
            }
        }

        if (denominator === 0) return closestZ; 
        return numerator / denominator;
    }

    generateGrid(nx = 60, ny) {
        const { minX, maxX, minY, maxY } = this.bounds;
        const width = Math.max(maxX - minX, 1);
        const height = Math.max(maxY - minY, 1);
        
        // Auto-calculate NY if not provided to maintain aspect ratio
        if (!ny) {
            const aspectRatio = width / height;
            ny = Math.round(nx / aspectRatio) || 50;
        }
        
        const dx = width / (nx - 1 || 1);
        const dy = height / (ny - 1 || 1);

        const gridZ = [];
        const gridX = [];
        const gridY = [];

        for (let i = 0; i < nx; i++) gridX.push(minX + i * dx);
        for (let j = 0; j < ny; j++) gridY.push(minY + j * dy);

        for (let j = 0; j < ny; j++) {
            const row = [];
            const y = gridY[j];
            for (let i = 0; i < nx; i++) {
                const x = gridX[i];
                row.push(this.predict(x, y));
            }
            gridZ.push(row);
        }

        return { x: gridX, y: gridY, z: gridZ, cellWidth: dx, cellHeight: dy };
    }
}