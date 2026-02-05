/**
 * VectorizedSolver
 * Performance optimized math utilities for simulation engine.
 * Uses TypedArrays (Float64Array) for efficient memory usage and computation.
 */
export class VectorizedSolver {
    
    /**
     * Create a typed array initialized with a value
     */
    static createArray(length, initialValue = 0) {
        const arr = new Float64Array(length);
        if (initialValue !== 0) arr.fill(initialValue);
        return arr;
    }

    /**
     * Tridiagonal Matrix Algorithm (Thomas Algorithm) optimized for TypedArrays
     * Solves Ax = d for x
     * All inputs should be Float64Arrays of length n (except diagonals size n-1 conceptually, but passed as n sized arrays for simplicity)
     * Warning: Modifies input arrays 'c' and 'd' in place for performance (scratch space)
     */
    static tdma(a, b, c, d, x) {
        const n = d.length;
        
        // Forward sweep
        // We use c as c_prime and d as d_prime to save allocation
        // c[0] = c[0] / b[0]
        c[0] = c[0] / b[0];
        d[0] = d[0] / b[0];

        for (let i = 1; i < n; i++) {
            const temp = 1.0 / (b[i] - a[i-1] * c[i-1]);
            c[i] = c[i] * temp;
            d[i] = (d[i] - a[i-1] * d[i-1]) * temp;
        }

        // Back substitution
        x[n-1] = d[n-1];
        for (let i = n - 2; i >= 0; i--) {
            x[i] = d[i] - c[i] * x[i+1];
        }
        
        return x;
    }

    /**
     * Calculate Arrhenius Equation Vectorized
     * k = A * exp(-E / RT)
     * @param {Float64Array} E - Activation energies array
     * @param {number} T_kelvin - Temperature
     * @param {number} A - Frequency factor
     * @param {Float64Array} output - Output array for rates
     */
    static calculateArrhenius(E, T_kelvin, A, output) {
        const RT_inv = 1.0 / (0.001987 * T_kelvin); // R in kcal/mol*K
        const len = E.length;
        for(let i=0; i<len; i++) {
            output[i] = A * Math.exp(-E[i] * RT_inv);
        }
    }

    /**
     * Batch Update Fractions
     * new_x = old_x * exp(-k * dt)
     */
    static decayFractions(fractions, rates, dt, output) {
        const len = fractions.length;
        for(let i=0; i<len; i++) {
            output[i] = fractions[i] * Math.exp(-rates[i] * dt);
        }
    }

    /**
     * Sum array elements
     */
    static sum(arr) {
        let sum = 0;
        const len = arr.length;
        for(let i=0; i<len; i++) sum += arr[i];
        return sum;
    }
}