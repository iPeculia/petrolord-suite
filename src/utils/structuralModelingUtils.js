import * as THREE from 'three';

// --- Grid Generation Utilities ---

export const generateStructuralGrid = (horizons, faults, params) => {
    // Mock grid generation
    // In a real app, this would involve pillar gridding or similar complex algorithms
    const { origin, dimI, dimJ, cellSize } = params;
    const gridPoints = [];
    
    for (let i = 0; i < dimI; i++) {
        for (let j = 0; j < dimJ; j++) {
            const x = origin.x + i * cellSize;
            const y = origin.y + j * cellSize;
            // Simple surface func: z = sin(x/100) * cos(y/100) * 50 - 1000
            const z = Math.sin(x / 500) * Math.cos(y / 500) * 200 - 1500;
            gridPoints.push({ x, y, z, i, j });
        }
    }
    return {
        id: crypto.randomUUID(),
        type: 'structural_grid',
        points: gridPoints,
        params,
        timestamp: Date.now()
    };
};

// --- Property Modeling ---

export const distributeProperty = (grid, propertyType, method) => {
    // Mock property distribution (e.g., Porosity, Permeability)
    if (!grid || !grid.points) return [];
    
    return grid.points.map(pt => {
        let val = 0;
        if (propertyType === 'porosity') {
            // Noise based porosity 0.05 - 0.25
            val = 0.15 + (Math.random() - 0.5) * 0.1 + (Math.sin(pt.x / 1000) * 0.05);
        } else if (propertyType === 'permeability') {
            // Log-normal related to porosity
            val = Math.exp(10 * (0.15 + (Math.random() - 0.5) * 0.1)) * 0.1; 
        } else if (propertyType === 'saturation') {
            // Higher water saturation lower down (below -1550m)
            val = pt.z < -1550 ? 0.8 + Math.random()*0.2 : 0.2 + Math.random()*0.1; 
        }
        return val;
    });
};

// --- Structural Statistics ---

export const calculateDipAndStrike = (points) => {
    // Simplified plane fitting for a set of points
    // Returns mock dip/strike for visualization
    if (points.length < 3) return { dip: 0, strike: 0, azimuth: 0 };
    
    // Mock calculation
    return {
        dip: Math.random() * 15, // degrees
        strike: Math.random() * 360, // degrees
        azimuth: Math.random() * 360
    };
};

export const calculateFaultThrow = (faultLine) => {
    // Mock throw calculation
    return Math.random() * 50 + 10; // meters
};