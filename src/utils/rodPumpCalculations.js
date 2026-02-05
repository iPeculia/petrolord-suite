const ROD_WEIGHTS = { // lbs/ft
        "1/2": 0.79,
        "5/8": 1.12,
        "3/4": 1.63,
        "7/8": 2.22,
        "1": 2.90
    };
    const ROD_ELASTICITY = 29e6; // psi

    const parseRodString = (rodString, rodPercentages, pumpDepth) => {
        const sizes = rodString.split(',').map(s => s.trim());
        const percentages = rodPercentages.split(',').map(p => parseFloat(p.trim()) / 100);

        let totalWeight = 0;
        let totalStretchCoeff = 0;
        
        if(sizes.length !== percentages.length || sizes.some(s => !ROD_WEIGHTS[s])) {
            return { weightInAir: 0, stretchCoeff: 0 };
        }

        for (let i = 0; i < sizes.length; i++) {
            const size = sizes[i];
            const length = pumpDepth * percentages[i];
            const area = Math.PI * Math.pow(parseFloat(size.replace('/', '.')) / 2, 2);
            
            totalWeight += ROD_WEIGHTS[size] * length;
            totalStretchCoeff += length / (ROD_ELASTICITY * area);
        }

        return { weightInAir: totalWeight, stretchCoeff: totalStretchCoeff };
    };

    export const calculateRodPumpDesign = (inputs) => {
        const {
            strokeLength,
            pumpingSpeed,
            pumpDepth,
            pumpDiameter,
            tubingPressure,
            casingPressure,
            liquidRate,
            waterCut,
            oilApi,
            rodString,
            rodPercentages
        } = inputs;

        // 1. Fluid properties
        const oilSpecificGravity = 141.5 / (oilApi + 131.5);
        const waterSpecificGravity = 1.0;
        const mixtureSpecificGravity = ((1 - waterCut/100) * oilSpecificGravity) + ((waterCut/100) * waterSpecificGravity);
        const buoyancyFactor = 1 - (1.2 * mixtureSpecificGravity / 7.85); // 7.85 is steel SG

        // 2. Rod String Properties
        const { weightInAir, stretchCoeff } = parseRodString(rodString, rodPercentages, pumpDepth);
        const weightInFluid = weightInAir * buoyancyFactor;

        // 3. Pump loads and displacement
        const pumpArea = Math.PI * Math.pow(pumpDiameter / 2, 2);
        const fluidLoad = pumpArea * (0.433 * mixtureSpecificGravity * pumpDepth - tubingPressure);
        
        const plungerDisplacement = 0.1166 * pumpArea * strokeLength * pumpingSpeed;
        const pumpFillage = (liquidRate / plungerDisplacement) * 100;
        
        // 4. Simplified Wave Equation (Mills Method) for dynamic loads
        const Fo = fluidLoad;
        const Wr = weightInFluid;
        const N = pumpingSpeed;
        const S = strokeLength;
        const L = pumpDepth;
        
        // Simplified dynamic factors
        const dynamicFactor = 1 + (N * N * S * L / 70500 / 1000); 
        const peakLoad = (Wr + Fo) * dynamicFactor;
        const minLoad = Wr * (dynamicFactor - 2 * Fo / Wr);

        // 5. Gearbox Torque
        const counterbalanceEffect = Wr + Fo / 2; // Ideal counterbalance
        const torqueFactor = 0.25 + N*N*S/1.5e6;
        const gearboxTorque = (peakLoad - counterbalanceEffect) * (S / 2) * torqueFactor * 1000;

        // 6. Generate Dyno Cards (simplified sinusoidal motion)
        const surfaceCard = [];
        const downholeCard = [];
        const numPoints = 100;

        for (let i = 0; i <= numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI;
            const pos = (S / 2) * (1 - Math.cos(angle));
            
            // Surface Card (simplified)
            const surfaceLoad = minLoad + (peakLoad - minLoad) * Math.pow(Math.sin(angle/2), 2);
            surfaceCard.push({ position: pos, load: surfaceLoad });

            // Downhole Card (idealized)
            const isUpstroke = i <= numPoints / 2;
            let dhLoad = pumpArea * casingPressure;
            if (isUpstroke) {
                 dhLoad = fluidLoad;
            } else {
                 dhLoad = 0; // Simplified transfer
            }
            downholeCard.push({ position: pos - (S * 0.1), load: dhLoad }); // Add some lag
        }
        // Close the downhole card loop
        downholeCard.push({ position: 0, load: 0 });
        downholeCard.push({ position: 0, load: fluidLoad });


        return {
            peakLoad: isNaN(peakLoad) ? 0 : peakLoad,
            minLoad: isNaN(minLoad) ? 0 : minLoad,
            gearboxTorque: isNaN(gearboxTorque) ? 0 : gearboxTorque,
            pumpFillage: isNaN(pumpFillage) ? 0 : Math.min(100, pumpFillage),
            surfaceCard,
            downholeCard,
        };
    };