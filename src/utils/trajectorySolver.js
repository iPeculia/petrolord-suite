/**
 * Trajectory Solver Utilities for Well Planning
 * Implements geometric solving for common well profiles (2D Vertical Section Plane)
 */

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

/**
 * Solves a Build-Hold (J-Type) profile to hit a target
 * @param {Object} start - { vs, tvd, inc }
 * @param {Object} target - { vs, tvd }
 * @param {number} buildRate - deg/length (e.g. deg/30m)
 * @param {number} courseLength - Unit length for rate (e.g. 30m or 100ft)
 * @returns {Object} { buildLength, holdLength, maxInc, success }
 */
export const solveBuildHold = (start, target, buildRate, courseLength = 30) => {
    // Radius of curvature
    const R = courseLength / (buildRate * D2R);
    
    const dVS = target.vs - start.vs;
    const dTVD = target.tvd - start.tvd;
    
    // Check if target is reachable
    if (dTVD <= 0) return { success: false, error: "Target is above or at start depth" };

    // Geometric solution for tangent angle alpha
    // Using vector algebra on the centers of curvature
    
    // Center of first build curve (assuming starting vertical for simplicity or projecting)
    // If start inc is 0:
    // Center is at (start.vs + R, start.tvd) if building "right" in VS plane
    
    // Simplified calculating for start Inc = 0
    if (Math.abs(start.inc) < 0.1) {
        // Center of curvature circle
        const Cx = start.vs + R;
        const Cy = start.tvd;
        
        // Distance from Center to Target
        const distCT = Math.sqrt(Math.pow(target.vs - Cx, 2) + Math.pow(target.tvd - Cy, 2));
        
        // Tangent point touch condition: The tangent line is tangent to circle C and passes through Target
        // Angle from C to T
        const angleCT = Math.atan2(target.tvd - Cy, target.vs - Cx);
        
        // Angle offset to tangent point
        // triangle C-Tangent-Target is right angled at Tangent
        // sin(offset) = R / distCT
        if (R > distCT) return { success: false, error: "Build rate too low / Target too close" };
        
        const angleOffset = Math.asin(R / distCT);
        
        // Tangent angle (Inc of hold section)
        // Note: Geometry specific, depends on build direction
        // For Build-Right: Tangent angle is perpendicular to radius at tangent point
        const holdIncRad = Math.PI/2 - (angleCT + angleOffset); // Approximate derivation
        
        // Let's use a more robust standard 2D well path formula for Type I (Build-Hold)
        // Total VS distance to target
        const D = target.vs - start.vs;
        const K = target.tvd - start.tvd;
        
        // If D < R, logic changes, but assuming standard deviation:
        if (D < R) {
             // Calculate max inc required
             // This simplifies to geometry: R * (1 - cos(I)) + (K - R*sin(I)) / tan(I) ... complex
             // Using vector method is better usually.
        }

        // Standard J-well formula from vertical
        // Alpha = 2 * atan( D / (K + sqrt(D^2 + K^2 - R^2)) ) ?? No, check standard derivations.
        // Let's use the explicit coordinate derivation for center (R, 0) relative to start.
        
        // The tangent line equation: x*cos(a) + y*sin(a) = R + x_start*cos(a) ...
        // Easier:
        // 1. Center of curvature (R, 0) relative to start point
        // 2. Target point (D, K) relative to start
        // 3. Line from (D,K) tangent to circle at (R,0)
        
        const dx = D - R; // Shift X by radius
        const dy = K;
        const H = Math.sqrt(dx*dx + dy*dy); // dist from shifted target to center
        
        if (H < R) return { success: false, error: "Cannot reach target with given build rate" };
        
        // Length of tangent section
        const L_hold = Math.sqrt(H*H - R*R);
        
        // Angle of hold section
        // angle to center of shifted system
        const beta = Math.atan2(dy, dx);
        const gamma = Math.asin(R/H);
        
        // Hold inclination
        let incHold = Math.PI/2 - (beta + gamma); // For D > R case
        if (D < R) incHold = Math.PI/2 - (beta - gamma); // Build and drop back or similar? No, standard build.
        
        // Usually J profile:
        const maxInc = 2 * Math.atan((D)/(K + Math.sqrt(D*D + K*K - (2*R*D)))); // Approx for R << D
        
        // Let's fallback to specific J-Type logic
        // Calculate Inc required to hit target
        // Arc Length = R * Inc
        // Tangent Length = (TargetTVD - StartTVD - R*sin(Inc)) / cos(Inc)
        
        // We iterate or solve numerically if analytic is unstable
        // Simple numeric solver for Inc:
        let bestInc = 0;
        let minErr = 1e9;
        
        for(let i=0.1; i<90; i+=0.1) {
            const rad = i * D2R;
            const arcVS = R * (1 - Math.cos(rad));
            const arcTVD = R * Math.sin(rad);
            
            const remVS = dVS - arcVS;
            const remTVD = dTVD - arcTVD;
            
            // Check alignment
            const tanAngle = Math.atan2(remVS, remTVD); // angle from vertical
            const diff = Math.abs(tanAngle - rad);
            
            if (diff < minErr) {
                minErr = diff;
                bestInc = i;
            }
        }
        
        const I_rad = bestInc * D2R;
        const arcLen = R * I_rad;
        const arcTVD = R * Math.sin(I_rad);
        const holdLen = (dTVD - arcTVD) / Math.cos(I_rad);
        
        return {
            buildLength: arcLen,
            holdLength: holdLen,
            maxInc: bestInc,
            success: true
        };
    }
    
    return { success: false, error: "Non-vertical start not yet supported in auto-solver" };
};