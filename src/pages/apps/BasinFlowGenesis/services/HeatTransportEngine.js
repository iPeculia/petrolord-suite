import { getThermalProps } from './ThermalPropertiesLibrary';
import { tdma } from './PhysicsUtils';

/**
 * Heat Transport Engine
 * 1D Finite Difference Solver for Transient Heat Conduction
 */
export class HeatTransportEngine {

    /**
     * Solve heat equation for one time step
     * @param {Array} nodes - Discretized depth nodes [{z, T, k, rho, Cp, radiogenic}, ...]
     * @param {number} dt - Time step in seconds
     * @param {number} topTemp - Surface temperature boundary condition (C)
     * @param {number} basalHeatFlow - Basal heat flow boundary condition (W/m2)
     * @returns {Array} - Updated temperatures for each node
     */
    static solve(nodes, dt, topTemp, basalHeatFlow) {
        const n = nodes.length;
        if (n < 3) return nodes.map(n => n.T); // Not enough nodes

        // Setup TDMA arrays
        const a = new Array(n - 1).fill(0); // Lower diag
        const b = new Array(n).fill(0);     // Main diag
        const c = new Array(n - 1).fill(0); // Upper diag
        const d = new Array(n).fill(0);     // RHS

        // Using Implicit Scheme (Backward Euler) for stability
        // Equation: rho*Cp * (T_new - T_old)/dt = d/dz (k dT_new/dz) + H
        
        for (let i = 1; i < n - 1; i++) {
            const node = nodes[i];
            const prev = nodes[i-1];
            const next = nodes[i+1];
            
            const dz_up = node.z - prev.z;
            const dz_down = next.z - node.z;
            const dz_avg = (dz_up + dz_down) / 2;
            
            // Harmonic mean conductivities at interfaces
            const k_up = 2 * (node.k * prev.k) / (node.k + prev.k);
            const k_down = 2 * (node.k * next.k) / (node.k + next.k);
            
            const volumetricHeatCap = node.rho * node.Cp; // J/(m3*K)
            
            // Coefficients
            // alpha = k / (rho*Cp) ... but we keep k separate due to heterogeneity
            // discretized:
            // T_i_new * (rho*Cp/dt) = (k_down * (T_{i+1}_new - T_i_new)/dz_down - k_up * (T_i_new - T_{i-1}_new)/dz_up) / dz_avg + H
            
            const term_time = volumetricHeatCap / dt;
            const term_diff_up = k_up / (dz_up * dz_avg);
            const term_diff_down = k_down / (dz_down * dz_avg);
            
            a[i-1] = -term_diff_up;                 // T_{i-1} coeff
            b[i] = term_time + term_diff_up + term_diff_down; // T_i coeff
            c[i] = -term_diff_down;                 // T_{i+1} coeff
            d[i] = term_time * node.T + node.radiogenic; // RHS: Old T + Heat Gen
        }

        // --- Boundary Conditions ---
        
        // Top: Fixed Temperature (Dirichlet)
        b[0] = 1;
        c[0] = 0;
        d[0] = topTemp;
        
        // Bottom: Fixed Heat Flow (Neumann)
        // Q = k * dT/dz -> dT/dz = Q/k
        // (T_n - T_{n-1}) / dz = Q_base / k_base
        // T_n = T_{n-1} + (Q_base * dz) / k_base
        // We can treat last node equation directly or modify TDMA row
        
        // Let's implement it as an equation for node n-1 depending on n-2
        // Or better, extend ghost node concept.
        // Simple approach: Set gradient at bottom boundary in the last regular node equation? 
        // Easier: Just modify the last row of matrix to enforce gradient.
        
        // Row n-1 (Last node)
        const lastNode = nodes[n-1];
        const prevNode = nodes[n-2];
        const dz_last = lastNode.z - prevNode.z;
        
        // T_{n-1} - T_{n-2} = (Q * dz) / k
        // -1 * T_{n-2} + 1 * T_{n-1} = Q*dz/k
        
        a[n-2] = -1;
        b[n-1] = 1;
        d[n-1] = (basalHeatFlow * dz_last) / lastNode.k;

        // Solve
        return tdma(a, b, c, d);
    }
}