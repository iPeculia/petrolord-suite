export const calculateGasLiftDesign = (inputs) => {
        const {
            tubingID,
            wellDepth,
            whp,
            bhp,
            liquidRate,
            waterCut,
            gor,
            oilApi,
            gasGravity,
            waterSalinity,
            wellheadTemp,
            bottomholeTemp,
            surfaceInjectionPressure,
            injectionGasGravity,
            valveSpacingSafetyFactor
        } = inputs;

        const oilRate = liquidRate * (1 - waterCut / 100);
        const waterRate = liquidRate * (waterCut / 100);

        const oilSpecificGravity = 141.5 / (oilApi + 131.5);
        const waterSpecificGravity = 1.0 + (waterSalinity / 1000000) * 0.6;
        const mixtureSpecificGravity = (oilRate * oilSpecificGravity + waterRate * waterSpecificGravity) / liquidRate;
        const mixtureGradient = 0.433 * mixtureSpecificGravity;

        const tempGradient = (bottomholeTemp - wellheadTemp) / wellDepth;

        const gradientData = [];
        const valveDepths = [];
        let injectionDepth = 0;
        let resultingBhp = bhp;
        let requiredGasRate = 0;

        // Simplified pressure traverse and valve spacing logic
        let currentDepth = 0;
        let flowingPressure = whp;
        let casingPressure = surfaceInjectionPressure;
        const casingTempGradient = (100 - 60) / 1000; // Assume simple temp profile for gas
        
        while (currentDepth < wellDepth && flowingPressure < casingPressure) {
            const step = 100;
            const avgTemp = wellheadTemp + tempGradient * (currentDepth + step / 2);
            const avgP = flowingPressure + mixtureGradient * step / 2;

            // Simplified flowing gradient
            const flowingGradient = mixtureGradient * (1 - gor / (gor + 1200)); // Very basic gradient reduction for formation gas
            flowingPressure += flowingGradient * step;

            const avgCasingTemp = 60 + casingTempGradient * (currentDepth + step / 2);
            // Simplified casing pressure gradient for injection gas
            const z = 0.9; // Assume constant Z-factor
            const R = 10.73;
            const gasDensity = (casingPressure * 29 * injectionGasGravity) / (z * R * (avgCasingTemp + 460));
            const gasGradient = gasDensity / 144;
            casingPressure += gasGradient * step;

            gradientData.push({
                depth: currentDepth + step,
                flowingPressure,
                casingPressure,
                temperature: wellheadTemp + tempGradient * (currentDepth + step),
            });
            currentDepth += step;
        }

        injectionDepth = currentDepth;

        if (valveDepths.length === 0 && injectionDepth > 0) {
            let tempDepth = 0;
            let unloadPressure = whp;
            let valveCount = 0;

            while (tempDepth < injectionDepth && valveCount < 10) {
                const P_valve_close = unloadPressure + valveSpacingSafetyFactor;
                
                let foundDepth = -1;
                for(const point of gradientData) {
                    if (point.casingPressure >= P_valve_close && point.depth > tempDepth) {
                        foundDepth = point.depth;
                        break;
                    }
                }

                if (foundDepth !== -1) {
                    const valvePressure = gradientData.find(p => p.depth === foundDepth).flowingPressure;
                    valveDepths.push({ depth: foundDepth, pressure: valvePressure });
                    tempDepth = foundDepth;
                    unloadPressure = valvePressure;
                    valveCount++;
                } else {
                    break;
                }
            }
             if (valveDepths.length > 0 && valveDepths[valveDepths.length - 1].depth < injectionDepth) {
                const finalValvePressure = gradientData.find(p => p.depth === injectionDepth).flowingPressure;
                valveDepths.push({ depth: injectionDepth, pressure: finalValvePressure });
            }
        }
        
        // Simplified required gas rate and final BHP calculation
        const glr = 500; // Target GLR in scf/bbl
        requiredGasRate = ((liquidRate * glr) - (oilRate * gor)) / 1000000;
        requiredGasRate = Math.max(0, requiredGasRate);

        const lightedGradient = mixtureGradient * 0.4;
        const unlightedGradient = mixtureGradient * 0.8;

        const lightedColumnPressureDrop = injectionDepth * lightedGradient;
        const unlightedColumnPressureDrop = (wellDepth - injectionDepth) * unlightedGradient;
        
        resultingBhp = whp + lightedColumnPressureDrop + unlightedColumnPressureDrop;


        return {
            injectionDepth,
            requiredGasRate,
            resultingBhp,
            valveDepths,
            gradientData,
        };
    };