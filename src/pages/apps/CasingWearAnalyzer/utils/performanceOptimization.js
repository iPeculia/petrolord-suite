/**
 * Performance Optimization Utilities
 */

// Simple vector addition for demonstration
const addVectors = (a, b) => {
    const len = Math.min(a.length, b.length);
    const result = new Float32Array(len);
    for (let i = 0; i < len; i++) {
        result[i] = a[i] + b[i];
    }
    return result;
};

// Vectorized wear calculation simulation
// Real implementation would use TypedArrays throughout the app for max speed
export const vectorizedWearCalculation = (contactForces, distances, wearFactor) => {
    // In a real high-perf scenario, contactForces and distances should already be TypedArrays
    const len = contactForces.length;
    const wearDepths = new Float32Array(len);
    
    // Unrolling loop slightly or just standard iteration
    for (let i = 0; i < len; i++) {
        wearDepths[i] = contactForces[i] * distances[i] * wearFactor;
    }
    return wearDepths;
};

// Async wrapper to prevent UI blocking
export const asyncWearProfileCalculation = async (calculationFn, params) => {
    return new Promise((resolve, reject) => {
        // Use setTimeout to push to next tick, allowing UI to render loading state
        setTimeout(() => {
            try {
                const start = performance.now();
                const result = calculationFn(params);
                const end = performance.now();
                console.debug(`Calculation took ${(end - start).toFixed(2)}ms`);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        }, 0);
    });
};

// Caching mechanism
const profileCache = new Map();

export const getCachedWearProfile = (cacheKey) => {
    return profileCache.get(cacheKey);
};

export const cacheWearProfile = (cacheKey, profile) => {
    // Limit cache size
    if (profileCache.size > 10) {
        const firstKey = profileCache.keys().next().value;
        profileCache.delete(firstKey);
    }
    profileCache.set(cacheKey, profile);
};