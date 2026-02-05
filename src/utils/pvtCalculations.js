export const pvtCalcs = {
        /**
         * Calculate bubble point pressure using Standing's correlation.
         * @param {number} rs - Solution GOR (scf/STB)
         * @param {number} api - Oil gravity (°API)
         * @param {number} gasGravity - Gas specific gravity
         * @param {number} temp - Reservoir temperature (°F)
         * @returns {number} Bubble point pressure (psia)
         */
        standing_pb: (rs, api, gasGravity, temp) => {
            const yo = 141.5 / (api + 131.5);
            const F = Math.pow(rs / gasGravity, 0.83) * Math.pow(10, 0.00091 * temp - 0.0125 * api);
            return 18.2 * (F - 1.4);
        },
    
        /**
         * Calculate solution GOR using Standing's correlation.
         * @param {number} p - Pressure (psia)
         * @param {number} api - Oil gravity (°API)
         * @param {number} gasGravity - Gas specific gravity
         * @param {number} temp - Reservoir temperature (°F)
         * @returns {number} Solution GOR (scf/STB)
         */
        standing_rs: (p, api, gasGravity, temp) => {
            const F = (p / 18.2) + 1.4;
            const exponent = 1 / 0.83;
            const term1 = Math.pow(F * Math.pow(10, 0.0125 * api - 0.00091 * temp), exponent);
            return gasGravity * term1;
        },
    
        /**
         * Calculate oil FVF using Standing's correlation.
         * @param {number} rs - Solution GOR (scf/STB)
         * @param {number} api - Oil gravity (°API)
         * @param {number} gasGravity - Gas specific gravity
         * @param {number} temp - Reservoir temperature (°F)
         * @returns {number} Oil FVF (bbl/STB)
         */
        standing_bo: (rs, api, gasGravity, temp) => {
            const yo = 141.5 / (api + 131.5);
            const F = rs * Math.sqrt(gasGravity / yo) + 1.25 * temp;
            return 0.9759 + 0.000120 * Math.pow(F, 1.2);
        },

        vasquez_beggs_rs: (p, api, gasGravity, temp, separator_p = 100) => {
            const C1 = (api <= 30) ? 0.0362 : 0.0178;
            const C2 = (api <= 30) ? 1.0937 : 1.1870;
            const C3 = (api <= 30) ? 25.724 : 23.931;

            const yh_28_96 = gasGravity * (1 + 5.912e-5 * api * temp * Math.log10(separator_p/114.7));

            return C1 * yh_28_96 * Math.pow(p, C2) * Math.exp(C3 * (api / (temp + 460)));
        },

        vasquez_beggs_bo: (rs, api, gasGravity, temp, separator_p = 100) => {
            const C1 = (api <= 30) ? 4.677e-4 : 4.670e-4;
            const C2 = (api <= 30) ? 1.751e-5 : 1.100e-5;
            const C3 = (api <= 30) ? -1.811e-8 : 1.337e-9;
            const yh_28_96 = gasGravity * (1 + 5.912e-5 * api * temp * Math.log10(separator_p/114.7));
            
            return 1 + C1*rs + C2*(temp-60)*(api/yh_28_96) + C3*rs*(temp-60)*(api/yh_28_96);
        },

        glaso_rs: (p, api, gasGravity, temp) => {
            const F = Math.pow(p, 1.1856) * Math.pow(10, -0.00396*temp) * Math.pow(api, 0.2855);
            return gasGravity * Math.pow( F / (Math.pow(10, 2.8869) * Math.pow(gasGravity, -1.0544)), 1/0.89);
        },

        glaso_bo: (rs, api, gasGravity, temp) => {
            const yo = 141.5 / (api + 131.5);
            const B_ob = rs * Math.pow(gasGravity/yo, 0.526) + 0.968 * temp;
            const log_Bo_star = -6.58511 + 2.91329*Math.log10(B_ob) - 0.27683*Math.pow(Math.log10(B_ob),2);
            return Math.pow(10, log_Bo_star) + 1;
        },

        beal_cook_spillman_viscosity: (api, temp, isSaturated, gasFreeVisc, rs) => {
            // Dead oil viscosity
            const a = Math.pow(10, 0.43 + (8.33/api));
            const dead_oil_visc = (0.32 + (1.8e7 / Math.pow(api, 4.53))) * Math.pow( (360/(temp + 200)), a );

            if (!isSaturated) {
                return dead_oil_visc;
            }
            
            // Saturated oil viscosity
            const b = 5.44 * Math.pow(rs + 150, -0.338) + 0.38;
            return 1.08 * Math.pow(10,b) * Math.pow(dead_oil_visc, 0.62 * Math.pow(10, -2.45*b));
        },
    
        beggs_robinson_viscosity: (api, temp, isSaturated, rs) => {
            // Dead oil viscosity
            const z = 3.0324 - 0.02023 * api;
            const y = Math.pow(10, z);
            const x = y * Math.pow(temp, -1.163);
            const dead_oil_visc = Math.pow(10, x) - 1;
            
            if (!isSaturated) {
                return dead_oil_visc;
            }
            
            // Saturated oil viscosity
            const a = 10.715 * Math.pow(rs + 100, -0.515);
            const b = 5.44 * Math.pow(rs + 150, -0.338);
            
            return a * Math.pow(dead_oil_visc, b);
        },
    
        /**
         * Generate a full PVT table based on input parameters and correlations.
         * @param {object} inputs - The input parameters object.
         * @returns {array} An array of PVT data points.
         */
        generatePvtTable: function(inputs) {
            const { api, gasGravity, temp, pb, correlations } = inputs;
            const pvtTable = [];
            const pressureSteps = [5000, 4500, 4000, 3500, 3000, 2500, 2000, 1500, 1000, 500, 14.7];
    
            for (const p of pressureSteps) {
                let rs, bo, muo;
                const isSaturated = p <= pb;
    
                // --- Rs and Bo Calculations ---
                if (correlations.pb_rs_bo === 'standing') {
                    rs = isSaturated ? this.standing_rs(p, api, gasGravity, temp) : this.standing_rs(pb, api, gasGravity, temp);
                    bo = this.standing_bo(rs, api, gasGravity, temp);
                } else if (correlations.pb_rs_bo === 'vasquez_beggs') {
                    rs = isSaturated ? this.vasquez_beggs_rs(p, api, gasGravity, temp) : this.vasquez_beggs_rs(pb, api, gasGravity, temp);
                    bo = this.vasquez_beggs_bo(rs, api, gasGravity, temp);
                } else { // glaso
                    rs = isSaturated ? this.glaso_rs(p, api, gasGravity, temp) : this.glaso_rs(pb, api, gasGravity, temp);
                    bo = this.glaso_bo(rs, api, gasGravity, temp);
                }
    
                // --- Oil Viscosity Calculation ---
                if (correlations.viscosity === 'beal_cook_spillman') {
                    muo = this.beal_cook_spillman_viscosity(api, temp, isSaturated, null, rs);
                } else { // beggs_robinson
                    muo = this.beggs_robinson_viscosity(api, temp, isSaturated, rs);
                }

                // Simplified Gas FVF
                const Z = 0.9; // Assume constant Z-factor for simplicity
                const bg = 0.02827 * Z * (temp + 460) / p;

                pvtTable.push({
                    pressure: p,
                    Rs: rs,
                    Bo: bo,
                    Bg: bg,
                    oil_viscosity: muo,
                });
            }
    
            return pvtTable.sort((a,b) => b.pressure - a.pressure);
        },
    };