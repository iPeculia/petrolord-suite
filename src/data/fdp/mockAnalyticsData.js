/**
 * Mock Data for Analytics Module
 */

export const mockCorrelationData = {
    matrix: {
        porosity: { porosity: 1, permeability: 0.85, sw: -0.6, density: -0.7 },
        permeability: { porosity: 0.85, permeability: 1, sw: -0.5, density: -0.6 },
        sw: { porosity: -0.6, permeability: -0.5, sw: 1, density: 0.4 },
        density: { porosity: -0.7, permeability: -0.6, sw: 0.4, density: 1 }
    }
};

export const mockRegressionResults = {
    r2: 0.92,
    equation: "Permeability = 10^(12.5 * Porosity - 1.2)",
    p_value: 0.001
};