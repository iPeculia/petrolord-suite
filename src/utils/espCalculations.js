const pumpDatabase = {
      // Data format: { rate: [head_per_stage, efficiency, power_per_stage] }
      "REDADN1000": {
        "data": [
          { "rate": 400, "head": 40.0, "efficiency": 50.0, "power": 0.40 },
          { "rate": 600, "head": 38.0, "efficiency": 65.0, "power": 0.45 },
          { "rate": 800, "head": 35.0, "efficiency": 72.0, "power": 0.50 },
          { "rate": 1000, "head": 31.0, "efficiency": 75.0, "power": 0.53 },
          { "rate": 1200, "head": 26.0, "efficiency": 71.0, "power": 0.55 },
          { "rate": 1400, "head": 20.0, "efficiency": 60.0, "power": 0.58 }
        ],
        "od": 4.00
      },
      "REDADN2600": {
        "data": [
          { "rate": 1500, "head": 32.0, "efficiency": 55.0, "power": 0.90 },
          { "rate": 2000, "head": 30.5, "efficiency": 68.0, "power": 1.05 },
          { "rate": 2500, "head": 28.0, "efficiency": 74.0, "power": 1.15 },
          { "rate": 3000, "head": 24.0, "efficiency": 72.0, "power": 1.25 },
          { "rate": 3500, "head": 19.0, "efficiency": 65.0, "power": 1.30 }
        ],
        "od": 5.13
      },
      "REDADN4000": {
        "data": [
          { "rate": 2500, "head": 25.0, "efficiency": 58.0, "power": 1.20 },
          { "rate": 3000, "head": 24.0, "efficiency": 67.0, "power": 1.35 },
          { "rate": 4000, "head": 21.0, "efficiency": 75.0, "power": 1.50 },
          { "rate": 5000, "head": 17.0, "efficiency": 71.0, "power": 1.65 },
          { "rate": 6000, "head": 12.0, "efficiency": 62.0, "power": 1.75 }
        ],
        "od": 5.38
      }
    };

    export const getPumpData = () => pumpDatabase;

    const interpolate = (x, x0, y0, x1, y1) => {
        if (x1 === x0) return y0;
        return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
    };

    const getPumpPerformance = (model, rate, freq) => {
        const pump = pumpDatabase[model].data;
        const freqRatio = freq / 60;
        const freqRatioSq = freqRatio * freqRatio;

        for (let i = 0; i < pump.length - 1; i++) {
            const p1 = pump[i];
            const p2 = pump[i+1];
            if (rate >= p1.rate * freqRatio && rate <= p2.rate * freqRatio) {
                const baseRate = rate / freqRatio;
                const head = interpolate(baseRate, p1.rate, p1.head, p2.rate, p2.head) * freqRatioSq;
                const efficiency = interpolate(baseRate, p1.rate, p1.efficiency, p2.rate, p2.efficiency); // Efficiency is approx. constant
                const power = interpolate(baseRate, p1.rate, p1.power, p2.rate, p2.power) * freqRatio * freqRatioSq;
                return { head, efficiency, power };
            }
        }
        return { head: 0, efficiency: 0, power: 0 }; // Out of range
    };

    export const calculateEspDesign = (inputs) => {
        const {
            targetRate,
            pumpDepth,
            whp,
            waterCut,
            gor,
            oilApi,
            gasGravity,
            tubingID,
            frequency,
            pumpModel
        } = inputs;

        const oilSpecificGravity = 141.5 / (oilApi + 131.5);
        const waterSpecificGravity = 1.0;
        const mixtureSpecificGravity = ((1 - waterCut/100) * oilSpecificGravity) + ((waterCut/100) * waterSpecificGravity);

        // Simplified friction loss calculation (Hazen-Williams C=100 for old steel)
        const C = 120;
        const frictionHeadLossPer1000ft = 23386 * Math.pow(targetRate / C, 1.852) / Math.pow(tubingID, 4.87);
        const totalFrictionLoss = (frictionHeadLossPer1000ft / 1000) * pumpDepth;

        // Calculate pressure at pump intake (simplified)
        // This ignores gas in annulus, assumes static fluid column above pump
        const fluidGradient = 0.433 * mixtureSpecificGravity;
        const pip = whp + fluidGradient * pumpDepth - totalFrictionLoss; 
        
        // Total Dynamic Head (TDH)
        const dischargePressureHead = (whp / fluidGradient) + totalFrictionLoss;
        const tdh = dischargePressureHead;

        const performanceAtTarget = getPumpPerformance(pumpModel, targetRate, frequency);
        const headPerStage = performanceAtTarget.head;

        let requiredStages = 0;
        if (headPerStage > 0) {
            requiredStages = Math.ceil(tdh / headPerStage);
        }

        const pumpEfficiency = performanceAtTarget.efficiency;
        const hydraulicHP = (targetRate * tdh * mixtureSpecificGravity) / 58800;
        
        let motorHP = 0;
        if (pumpEfficiency > 0) {
            motorHP = hydraulicHP / (pumpEfficiency / 100);
        }

        // Generate performance curve data
        const curveData = pumpDatabase[pumpModel].data.map(p => {
            const freqRatio = frequency / 60;
            const rate = p.rate * freqRatio;
            const perf = getPumpPerformance(pumpModel, rate, frequency);
            return {
                rate: rate,
                head: perf.head * requiredStages,
                efficiency: perf.efficiency,
                power: perf.power * requiredStages
            };
        });

        return {
            tdh,
            requiredStages,
            motorHP,
            pumpEfficiency,
            performanceCurve: curveData,
        };
    };