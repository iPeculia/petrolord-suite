const pvtData = {
        // Z-factor table (example values, replace with real data or correlations)
        zFactorTable: [
            { p: 0, z: 1.0 }, { p: 500, z: 0.95 }, { p: 1000, z: 0.90 },
            { p: 2000, z: 0.85 }, { p: 3000, z: 0.88 }, { p: 4000, z: 0.92 },
            { p: 5000, z: 1.0 }
        ],
        // Viscosity table (example values)
        viscosityTable: [
            { p: 0, mu: 0.012 }, { p: 1000, mu: 0.015 }, { p: 2000, mu: 0.020 },
            { p: 3000, mu: 0.028 }, { p: 4000, mu: 0.038 }, { p: 5000, mu: 0.050 }
        ]
    };

    function interpolate(table, key, value) {
        if (value <= table[0][key]) return table[0];
        if (value >= table[table.length - 1][key]) return table[table.length - 1];
        
        const index = table.findIndex(item => item[key] > value);
        const lower = table[index-1];
        const upper = table[index];

        const range = upper[key] - lower[key];
        const frac = (value - lower[key]) / range;

        const result = {};
        for(const prop in lower) {
            if (prop !== key && typeof lower[prop] === 'number') {
                result[prop] = lower[prop] + frac * (upper[prop] - lower[prop]);
            }
        }
        return result;
    }

    function calculatePseudoPressure(p, zFactorTable) {
        let integral = 0;
        const sortedTable = [...zFactorTable].sort((a,b) => a.p - b.p);
        
        for (let i = 0; i < sortedTable.length; i++) {
            if (sortedTable[i].p >= p) {
                if (i > 0) {
                    const p_i = sortedTable[i].p;
                    const p_i_minus_1 = sortedTable[i-1].p;
                    const val_i = (2 * p_i) / (interpolate(zFactorTable, 'p', p_i).z * interpolate(pvtData.viscosityTable, 'p', p_i).mu);
                    const val_i_minus_1 = (2 * p_i_minus_1) / (interpolate(zFactorTable, 'p', p_i_minus_1).z * interpolate(pvtData.viscosityTable, 'p', p_i_minus_1).mu);
                    integral += (val_i + val_i_minus_1) / 2 * (p_i - p_i_minus_1);
                }
                break;
            }
            if (i > 0) {
                const p_i = sortedTable[i].p;
                const p_i_minus_1 = sortedTable[i-1].p;
                const val_i = (2 * p_i) / (interpolate(zFactorTable, 'p', p_i).z * interpolate(pvtData.viscosityTable, 'p', p_i).mu);
                const val_i_minus_1 = (2 * p_i_minus_1) / (interpolate(zFactorTable, 'p', p_i_minus_1).z * interpolate(pvtData.viscosityTable, 'p', p_i_minus_1).mu);
                integral += (val_i + val_i_minus_1) / 2 * (p_i - p_i_minus_1);
            }
        }
        return integral;
    }

    onmessage = (e) => {
        const { data, params } = e.data;
        const { initialPressure } = params;

        const transformedData = data.map(point => {
            const p_pseudo = calculatePseudoPressure(point.pressure, pvtData.zFactorTable);
            const p_initial_pseudo = calculatePseudoPressure(initialPressure, pvtData.zFactorTable);

            // Pseudo-time calculation requires compressibility, which is a constant for now
            // A more rigorous approach would vary ct with pressure
            const ct_avg = 1.5e-5; // Example average compressibility
            const t_pseudo = point.time * (interpolate(pvtData.viscosityTable, 'p', initialPressure).mu * ct_avg) / (interpolate(pvtData.viscosityTable, 'p', point.pressure).mu * ct_avg);
            
            return {
                ...point,
                pressure: p_pseudo, 
                originalPressure: point.pressure,
                time: t_pseudo,
                originalTime: point.time,
            };
        });

        postMessage({ transformedData });
    };