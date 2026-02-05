import { getCompactionParams } from './CompactionModelLibrary';

/**
 * Burial & Compaction Engine
 * Calculates the geometry evolution of the basin over time.
 * Uses standard backstripping / forward modeling concepts.
 */
export class BurialCompactionEngine {
    
    /**
     * Calculate the decompacted thickness of a layer at a given burial depth.
     * This solves the integral: SolidHeight = Thickness * (1 - avg_phi)
     * iteratively to find Thickness.
     * 
     * @param {Object} layer - The stratigraphic layer
     * @param {number} topDepth - Depth to top of layer (m)
     * @returns {Object} - { thickness, porosity, density }
     */
    static calculateLayerProperties(layer, topDepth) {
        const params = getCompactionParams(layer.lithology);
        const phi0 = params.phi0;
        const c = params.c;
        
        // Solid thickness is invariant
        // Hs = H_present * (1 - phi_present_avg)
        // We calculate Hs first based on user input (assuming input is fully compacted or present day)
        // Note: In a real forward model, user inputs usually imply "deposited thickness" or "present thickness".
        // Here we assume input 'thickness' is the PRESENT DAY thickness.
        
        // Wait, for forward modeling, we need to know the solid volume (or mass) deposited.
        // Let's assume the user input 'thickness' corresponds to the thickness AT DEPOSITION (t=0 for layer).
        // OR, more commonly in simple tools, input is PRESENT DAY thickness, and we back-calculate Hs.
        
        // Let's assume Input Thickness = Present Day Thickness (most intuitive for users checking logs)
        // We need to pre-calculate Hs for all layers before simulation loop.
        
        // This function is for the simulation loop: Given Hs and TopDepth, find Thickness.
        
        const Hs = layer.solidThickness; 
        
        // Iterative solution for Thickness (H)
        // Hs = Integral[z_top to z_bottom] (1 - phi(z)) dz
        // Hs = Integral (1 - phi0*exp(-cz)) dz
        // Hs = [z + (phi0/c)*exp(-cz)] from z_top to z_top+H
        // Hs = (z_top+H - z_top) + (phi0/c)(exp(-c(z_top+H)) - exp(-c*z_top))
        // Hs = H + (phi0/c) * exp(-c*z_top) * (exp(-c*H) - 1)
        
        // Solve for H using Newton-Raphson or simple iteration
        let H = Hs * 1.5; // Initial guess (thicker than solid)
        const maxIter = 20;
        const tol = 0.1; // 10 cm tolerance
        
        for(let i=0; i<maxIter; i++) {
            const termExp = Math.exp(-c * H);
            const f = H + (phi0/c) * Math.exp(-c * topDepth) * (termExp - 1) - Hs;
            
            // Derivative df/dH
            // df/dH = 1 + (phi0/c) * exp(-c*topDepth) * (-c * exp(-c*H))
            //       = 1 - phi0 * exp(-c*topDepth) * exp(-c*H)
            //       = 1 - phi(bottom)
            const df = 1 - phi0 * Math.exp(-c * (topDepth + H));
            
            const dH = f / df;
            H = H - dH;
            
            if(Math.abs(dH) < tol) break;
        }
        
        // Calculate average properties
        const bottomDepth = topDepth + H;
        const phiTop = phi0 * Math.exp(-c * topDepth);
        const phiBottom = phi0 * Math.exp(-c * bottomDepth);
        const phiAvg = (phiTop + phiBottom) / 2; // Approximation
        
        // Bulk density
        const rhoM = params.grainDensity;
        const rhoF = 1030; // Fluid density approx
        const rhoBulk = phiAvg * rhoF + (1 - phiAvg) * rhoM;
        
        return {
            thickness: H,
            topDepth: topDepth,
            bottomDepth: bottomDepth,
            phiAvg: phiAvg,
            rhoBulk: rhoBulk
        };
    }

    /**
     * Pre-calculates the Solid Thickness (Hs) for a layer based on its Present Day (Input) properties.
     * Assumes the input thickness is at the calculated "Present Day" burial depth if we knew it.
     * BUT, to simplify for Genesis v1: We assume the input thickness is the DECOMPACTED (Depositional) Thickness
     * if the user is in "Guided Mode" maybe? 
     * NO, standard industry practice: Input is Present Day Thickness.
     * We need a depth model to get present day depths, then calculate Hs.
     * 
     * For V1 simplified: We will assume the layers are entered in stratigraphic order.
     * We calculate depths from top down to get present day depths.
     * Then calculate Hs.
     */
    static initializeSolidThickness(layers) {
        let currentDepth = 0; // Start at surface (or water bottom)
        const initializedLayers = layers.map(layer => {
            const params = getCompactionParams(layer.lithology);
            const top = currentDepth;
            const bottom = top + layer.thickness;
            
            // Calculate Hs from present state
            // Hs = H + (phi0/c) * exp(-c*top) * (exp(-c*H) - 1)
            const term1 = (params.phi0 / params.c) * Math.exp(-params.c * top);
            const term2 = Math.exp(-params.c * layer.thickness) - 1;
            const Hs = layer.thickness + term1 * term2;
            
            currentDepth = bottom;
            
            return {
                ...layer,
                solidThickness: Hs,
                presentTop: top,
                presentBottom: bottom
            };
        });
        
        return initializedLayers;
    }
}