/**
 * Simple K-Means Clustering Implementation
 */
export class DataClusterer {
    
    static cluster(data, k = 3) {
        if (!data || data.length < k) return [];
        
        // Initialize centroids randomly
        let centroids = data.slice(0, k).map(d => ({ ...d }));
        let assignments = new Array(data.length).fill(0);
        let changed = true;
        let iterations = 0;
        const maxIter = 20;

        while (changed && iterations < maxIter) {
            changed = false;
            iterations++;

            // Assign points to nearest centroid
            for (let i = 0; i < data.length; i++) {
                const point = data[i];
                let minDist = Infinity;
                let clusterIdx = 0;

                for (let c = 0; c < k; c++) {
                    const dist = this.euclideanDistance(point, centroids[c]);
                    if (dist < minDist) {
                        minDist = dist;
                        clusterIdx = c;
                    }
                }

                if (assignments[i] !== clusterIdx) {
                    assignments[i] = clusterIdx;
                    changed = true;
                }
            }

            // Update centroids
            for (let c = 0; c < k; c++) {
                const clusterPoints = data.filter((_, i) => assignments[i] === c);
                if (clusterPoints.length > 0) {
                    centroids[c] = this.calculateMean(clusterPoints);
                }
            }
        }

        return data.map((d, i) => ({
            ...d,
            cluster: assignments[i]
        }));
    }

    static euclideanDistance(p1, p2) {
        let sum = 0;
        // Only numeric keys
        const keys = Object.keys(p1).filter(k => typeof p1[k] === 'number' && k !== 'id');
        for (let key of keys) {
            sum += Math.pow(p1[key] - p2[key], 2);
        }
        return Math.sqrt(sum);
    }

    static calculateMean(points) {
        const keys = Object.keys(points[0]).filter(k => typeof points[0][k] === 'number' && k !== 'id');
        const mean = {};
        
        keys.forEach(key => {
            mean[key] = points.reduce((sum, p) => sum + p[key], 0) / points.length;
        });
        return mean;
    }
}