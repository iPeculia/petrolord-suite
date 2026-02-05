export class SurfaceCalculationEngine {
    /**
     * Calculates Gross Rock Volume (GRV) between a top surface and base surface (or constant).
     * Uses a simplified column-based integration or bounding-box approximation depending on data density.
     */
    static calculateGRV(method, topSurface, baseSurfaceOrThickness, area) {
        // method: 'surfaces' (Top & Base) or 'hybrid' (Top & Constant Thickness)
        
        if (!topSurface || !topSurface.points || topSurface.points.length === 0) {
            return 0;
        }

        const topZAvg = topSurface.avgZ;
        let thicknessAvg = 0;
        let calcArea = area || topSurface.estimatedArea; // Use provided area override or estimated

        if (method === 'hybrid') {
            // Constant thickness
            thicknessAvg = parseFloat(baseSurfaceOrThickness) || 0;
        } else if (method === 'surfaces') {
            if (!baseSurfaceOrThickness || !baseSurfaceOrThickness.points) {
                return 0; // Missing base surface
            }
            // Simple average difference approximation
            // For high accuracy, we'd grid both to common XY and sum differences.
            // Here we use the difference of averages if grids are roughly aligned, 
            // or just Base_AvgZ - Top_AvgZ.
            // Assuming Z increases with depth (Depth grid): Base > Top. 
            // Thickness = Base - Top.
            thicknessAvg = baseSurfaceOrThickness.avgZ - topZAvg;
        }

        // Ensure positive thickness
        if (thicknessAvg < 0) thicknessAvg = 0;

        // GRV = Area * Thickness
        // If unitSystem is field (Area=Acres, Thick=ft), result is Acre-ft
        // If metric (Area=km2, Thick=m), result is 10^6 m3
        
        return calcArea * thicknessAvg;
    }

    // Helper to check if inputs are valid for surface calc
    static validateInputs(method, inputs) {
        if (method === 'surfaces') {
            return inputs.topSurfaceId && inputs.baseSurfaceId;
        }
        if (method === 'hybrid') {
            return inputs.topSurfaceId && (inputs.thickness !== undefined);
        }
        return true; // 'simple' method
    }
}