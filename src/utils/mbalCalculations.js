const linearRegression = (x, y) => {
        const n = x.length;
        let sx = 0, sy = 0, sxy = 0, sxx = 0, syy = 0;
        for (let i = 0; i < n; i++) {
            sx += x[i];
            sy += y[i];
            sxy += x[i] * y[i];
            sxx += x[i] * x[i];
            syy += y[i] * y[i];
        }
        const m = (n * sxy - sx * sy) / (n * sxx - sx * sx);
        const b = (sy / n) - m * (sx / n);
        const r2 = Math.pow((n * sxy - sx * sy) / Math.sqrt((n * sxx - sx * sx) * (n * syy - sy * sy)), 2);
        return { m, b, r2 };
    };
    
    const interpolate = (x, x0, x1, y0, y1) => {
      if (x1 === x0) return y0;
      return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
    };
    
    const getPvtValue = (pressure, pvtTable, key, allowExtrapolation = false) => {
        if (!pvtTable || pvtTable.length === 0) throw new Error(`PVT table is empty for key ${key}.`);
        
        const sortedTable = [...pvtTable].sort((a, b) => a.Pressure - b.Pressure);

        if (pressure <= sortedTable[0].Pressure) {
            return allowExtrapolation ? sortedTable[0][key] : sortedTable[0][key];
        }
        if (pressure >= sortedTable[sortedTable.length - 1].Pressure) {
            return allowExtrapolation ? sortedTable[sortedTable.length - 1][key] : sortedTable[sortedTable.length - 1][key];
        }
    
        for (let i = 0; i < sortedTable.length - 1; i++) {
            if (pressure >= sortedTable[i].Pressure && pressure <= sortedTable[i + 1].Pressure) {
                return interpolate(pressure, sortedTable[i].Pressure, sortedTable[i+1].Pressure, sortedTable[i][key], sortedTable[i+1][key]);
            }
        }
        throw new Error(`Could not find PVT value for pressure ${pressure} and key ${key}.`);
    };

    const getCumProd = (targetDate, productionTimeline) => {
        if (!productionTimeline || productionTimeline.length === 0) {
            return { cumOil: 0, cumGas: 0, cumWater: 0 };
        }
        const sortedTimeline = [...productionTimeline].sort((a, b) => a.date - b.date);

        if (targetDate < sortedTimeline[0].date) {
            return { cumOil: 0, cumGas: 0, cumWater: 0 };
        }

        if (targetDate >= sortedTimeline[sortedTimeline.length - 1].date) {
             return {
                cumOil: sortedTimeline[sortedTimeline.length - 1].cumOil,
                cumGas: sortedTimeline[sortedTimeline.length - 1].cumGas,
                cumWater: sortedTimeline[sortedTimeline.length - 1].cumWater
            };
        }

        for (let i = 0; i < sortedTimeline.length - 1; i++) {
            if (targetDate >= sortedTimeline[i].date && targetDate <= sortedTimeline[i + 1].date) {
                const date0 = sortedTimeline[i].date.getTime();
                const date1 = sortedTimeline[i + 1].date.getTime();
                return {
                    cumOil: interpolate(targetDate.getTime(), date0, date1, sortedTimeline[i].cumOil, sortedTimeline[i + 1].cumOil),
                    cumGas: interpolate(targetDate.getTime(), date0, date1, sortedTimeline[i].cumGas, sortedTimeline[i + 1].cumGas),
                    cumWater: interpolate(targetDate.getTime(), date0, date1, sortedTimeline[i].cumWater, sortedTimeline[i + 1].cumWater),
                };
            }
        }
        
        return { cumOil: 0, cumGas: 0, cumWater: 0 };
    };

    export const mbalCalculations = ({ productionData, pressureData, pvtData, aquiferResults }) => {
        const warnings = [];

        if (!pvtData || !pvtData.inputs || !pvtData.pvtTable) {
            throw new Error('PVT data, inputs, and table are required for material balance calculations.');
        }

        if (!productionData || productionData.length < 2) {
            throw new Error('Insufficient production data points. At least 2 are required.');
        }
        if (!pressureData || pressureData.length < 2) {
            throw new Error('Insufficient pressure data points. At least 2 are required.');
        }
    
        const { inputs, pvtTable } = pvtData;
        const pi = pressureData.find(p => p.days === 0)?.pressure;
        if (!pi) throw new Error("Initial pressure (at day 0) not found in pressure data.");
    
        const Boi = getPvtValue(pi, pvtTable, 'Bo');
        const Rsi = getPvtValue(pi, pvtTable, 'Rs');
        const Bgi = getPvtValue(pi, pvtTable, 'Bg');
        const cw = inputs.water?.cw || 3e-6;
        const cf = inputs.rock?.cf || 4e-6;
        const m = inputs?.gasCapRatio || 0; // default to 0 for no gas cap unless specified
        const swi = inputs?.swi || 0;
        
        const plotData = pressureData.map(p => {
            const pressure = p.pressure;
            const Np = p['Cum Oil Prod (MMSTB)'] * 1e6;
            const Gp = p['Cum Gas Prod (BSCF)'] * 1e9;
            const Wp = p['Cum Water Prod (MMBBL)'] * 1e6;
            
            if (p.days === 0) {
                return { F: 0, Eo: 0, Eg: 0, Ef: 0, Et: 0, pressure, Np, Gp };
            }

            const Bo = getPvtValue(pressure, pvtTable, 'Bo');
            const Rs = getPvtValue(pressure, pvtTable, 'Rs');
            const Bg = getPvtValue(pressure, pvtTable, 'Bg');
            const Bw = 1.0; 

            const F = Np * (Bo + (Rsi - Rs) * Bg) + (Wp * Bw); 

            const Eo = Bo - Boi;
            const Eg = Boi * ((Bg / Bgi) - 1);
            const dP = pi - pressure;
            const Ef = (Boi / (1 - swi)) * (cf + swi * cw) * dP;
            
            const Et = Eo + m * Eg + Ef;
            
            return { F, Et, Eo, Eg, Ef, pressure, Np, Gp };
        }).filter(p => p.Et > 0); // Filter out the initial data point for regression

        if (plotData.length < 2) {
            throw new Error("Insufficient data points for regression analysis. Check data alignment between production and pressure.");
        }

        const x = plotData.map(p => p.Et);
        const y = plotData.map(p => p.F);
        
        const regression = linearRegression(x, y);
        const ooip = regression.m; // OOIP from Havlena-Odeh plot
        const rSquared = regression.r2;

        if(rSquared < 0.85) warnings.push(`Low R-squared value (${rSquared.toFixed(2)}) suggests poor data quality or incorrect model assumptions.`);
    
        const lastPoint = plotData[plotData.length-1];
        let DDI = 0, GDI = 0, WDI = 0;
        if(lastPoint && lastPoint.F > 0) {
             const We = aquiferResults ? aquiferResults.cumulativeWe : 0;
             DDI = ooip * (lastPoint.Eo + lastPoint.Ef) / lastPoint.F;
             GDI = (ooip * m * lastPoint.Eg) / lastPoint.F;
             WDI = We / lastPoint.F;

             const totalDI = DDI + GDI + WDI;
             if(totalDI > 0){
                DDI /= totalDI;
                GDI /= totalDI;
                WDI /= totalDI;
             }
        }

        const minEt = 0;
        const maxEt = Math.max(...x);
        const regressionLine = {
            x: [minEt, maxEt],
            y: [regression.b + regression.m * minEt, regression.b + regression.m * maxEt]
        };
        
        return {
            ooip: ooip,
            m: m,
            rSquared: rSquared,
            plotData: plotData,
            driveIndices: { DDI, GDI, WDI },
            warnings,
            regressionLine,
        };
    };

    export const validateMbalCSVData = (csvString) => {
        const requiredColumns = ['Date', 'Pressure', 'Cum Oil Prod (MMSTB)', 'Cum Gas Prod (BSCF)', 'Cum Water Prod (MMBBL)'];
        const lines = csvString.split('\n');
        if (lines.length < 2) return { isValid: false, message: 'CSV must have at least one header row and one data row.' };
        const headers = lines[0].split(',').map(h => h.trim());
        const missing = requiredColumns.filter(rc => !headers.includes(rc));
        if (missing.length > 0) return { isValid: false, message: `Missing required columns: ${missing.join(', ')}` };
        return { isValid: true, message: 'Valid' };
    };

    export const validatePvtCSVData = (csvString) => {
        const requiredColumns = ['Pressure', 'Bo', 'Rs', 'Bg'];
        const lines = csvString.split('\n');
        if (lines.length < 2) return { isValid: false, message: 'PVT CSV must have at least one header row and one data row.' };
        const headers = lines[0].split(',').map(h => h.trim());
        const missing = requiredColumns.filter(rc => !headers.includes(rc));
        if (missing.length > 0) return { isValid: false, message: `Missing required PVT columns: ${missing.join(', ')}` };
        return { isValid: true, message: 'Valid' };
    };