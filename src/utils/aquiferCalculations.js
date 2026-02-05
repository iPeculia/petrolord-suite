// Simplified aquifer calculation models for demonstration.
    // These do not represent rigorous, production-quality engineering calculations.

    const fetkovichModel = ({ params, pressureData, pvtData }) => {
        const { wei, raReRatio, theta, aquiferPerm } = params;
        const { cw, muw } = pvtData.inputs.water;
        const ct = cw + pvtData.inputs.rock.cf; // Total compressibility
        const pi = parseFloat(pressureData[0].pressure);

        const J = (0.00708 * aquiferPerm * (theta / 360) / muw) / (Math.log(raReRatio) - 0.75);
        
        const influxData = [];
        let We = 0;
        let prevPbar = pi;

        for (let i = 1; i < pressureData.length; i++) {
            const dt = 30; // Assume monthly data for simplicity
            const p = parseFloat(pressureData[i].pressure);
            const pbar = (prevPbar + p) / 2;

            const dWe = (wei * ct / dt) * (1 - Math.exp(-J * dt / (wei * ct))) * (pi - pbar);
            We += dWe;

            influxData.push({ days: i * dt, We });
            prevPbar = p;
        }

        return {
            influxData,
            cumulativeWe: We,
            modelType: 'fetkovich',
        };
    };

    const carterTracyModel = ({ params, pressureData, pvtData }) => {
        // Carter-Tracy is more complex involving superposition and dimensionless time functions.
        // This is a placeholder demonstrating a similar output structure.
        const { raReRatio, theta, aquiferPerm, aquiferThickness, aquiferPorosity } = params;
        const { cw, muw } = pvtData.inputs.water;
        const pi = parseFloat(pressureData[0].pressure);
        
        const influxData = [];
        let We = 0;
        
        for (let i = 1; i < pressureData.length; i++) {
            const dt = 30; // Assume monthly data
            const p = parseFloat(pressureData[i].pressure);
            const dp = pi - p;

            // Simplified influx calculation for demonstration
            const U = (0.00708 * aquiferPerm * aquiferThickness * (theta / 360)) / muw;
            const We_i = U * dp * Math.sqrt(i * dt) * 0.1; // Highly simplified
            We = We_i;
            influxData.push({ days: i * dt, We });
        }

        return {
            influxData,
            cumulativeWe: We,
            modelType: 'carter-tracy',
        };
    };


    export const aquiferCalculations = ({ modelType, params, pressureData, pvtData }) => {
        if (!pvtData || !pvtData.inputs || !pvtData.inputs.water || !pvtData.inputs.rock) {
            throw new Error("Water or Rock properties are missing in the PVT input data.");
        }

        if (modelType === 'fetkovich') {
            return fetkovichModel({ params, pressureData, pvtData });
        } else if (modelType === 'carter-tracy') {
            return carterTracyModel({ params, pressureData, pvtData });
        } else {
            throw new Error("Unknown aquifer model type.");
        }
    };