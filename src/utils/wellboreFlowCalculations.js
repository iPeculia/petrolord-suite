export const generateWellboreFlowData = (inputs) => {
        const { wellDepth, simulationTime, geothermalGradient, surfaceTemp, waterDepth, seabedTemp, inflowRate } = inputs;
        const numDepthSteps = 50;
        const numTimeSteps = simulationTime > 0 ? simulationTime / 2 : 50; // 2 min time steps
    
        const depthInterval = wellDepth / numDepthSteps;
    
        const timeSeriesProfiles = Array.from({ length: numTimeSteps + 1 }, (_, timeIndex) => {
            const time = timeIndex * (simulationTime / numTimeSteps);
            const timeFactor = inputs.simulationType === 'Start-up' ? Math.min(1, time / (simulationTime * 0.5)) : 1;
    
            let pressure = 1500 * timeFactor + 300 * (1 - timeFactor); // Start from hydrostatic
            let temperature = surfaceTemp;
    
            const profile = Array.from({ length: numDepthSteps + 1 }, (_, depthIndex) => {
                const depth = depthIndex * depthInterval;
                
                // Simplified Pressure Gradient
                pressure += depthInterval * (0.15 + (Math.random() - 0.5) * 0.1) * timeFactor;
                
                // Simplified Temperature Gradient (considers geothermal and water depth)
                let geoTemp;
                if (depth <= waterDepth) {
                    geoTemp = seabedTemp;
                } else {
                    const rockDepth = depth - waterDepth;
                    geoTemp = seabedTemp + (rockDepth / 100) * geothermalGradient;
                }
                const flowTemp = temperature + timeFactor * 50 * Math.sin(Math.PI * depth / wellDepth); // simplified flow cooling/heating
                temperature = (flowTemp * 0.2 + geoTemp * 0.8);
    
                // Simplified holdup - increases with depth
                const holdup = 0.2 + 0.5 * (depth / wellDepth) * timeFactor * (1 + 0.1 * Math.sin(time / 10 + depth / 1000));
    
                return {
                    depth,
                    pressure,
                    temperature,
                    holdup,
                };
            });
    
            const wellhead = profile[0];
            return {
                time,
                profile,
                wellhead: {
                    pressure: wellhead.pressure,
                    temperature: wellhead.temperature,
                    holdup: wellhead.holdup,
                },
            };
        });
    
        const finalProfile = timeSeriesProfiles[timeSeriesProfiles.length - 1];
    
        const slugReport = {
            flowRegime: 'Slug Flow',
            avgFrequency: 2 + Math.random(),
            maxSlugVolume: inflowRate / 1000 * (3 + Math.random() * 2),
            maxSlugVelocity: 15 + Math.random() * 5,
        };
    
        const solidsReport = {
            settlingVelocity: 0.5 + Math.random() * 0.2,
            maxDepositionRate: inputs.sandProduction * (0.1 + Math.random() * 0.05),
            maxDepositionDepth: (wellDepth * (0.7 + Math.random() * 0.1)).toFixed(0),
            erosionRisk: 'Moderate at Bends',
        };
    
        return {
            kpis: {
                maxPressure: Math.max(...finalProfile.profile.map(p => p.pressure)),
                minTemp: Math.min(...finalProfile.profile.map(p => p.temperature)),
            },
            timeSeriesProfiles,
            slugReport,
            solidsReport,
        };
    };