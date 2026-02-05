export const generateFlowAssuranceData = (inputs) => {
    const {
        pipelineLength,
        inletPressure,
        inletTemperature,
        ambientTemperature,
        apiGravity,
        gor,
        waterCut,
        co2,
        h2s
    } = inputs;

    const numSegments = 50;
    const segmentLength = pipelineLength / numSegments;

    let ptProfile = [];
    let riskProfile = [];
    let currentPressure = inletPressure;
    let currentTemperature = inletTemperature;

    // Simplified Thermal-Hydraulic Model
    const overallHeatTransferCoeff = 2.0; // Btu/hr-ft2-F
    const pressureGradientFactor = 0.02; // psi/ft
    
    for (let i = 0; i <= numSegments; i++) {
        const distance = i * segmentLength;
        
        // Simplified P & T calculation
        currentPressure = inletPressure - (pressureGradientFactor * distance);
        const deltaT = currentTemperature - ambientTemperature;
        currentTemperature -= deltaT * 0.05 * (segmentLength / 1000); // Cooling effect

        // Simplified Risk Models
        // Hydrate Curve (Katz-like simplified)
        const hydrateTemp = 18 * Math.log(currentPressure) - 100 + (gor / 1000);
        // Wax Appearance Temperature (WAT)
        const waxTemp = -0.5 * apiGravity + 0.0001 * currentPressure + 95;
        // Corrosion risk (based on CO2, H2S, and water)
        const corrosionRisk = (co2 > 1 && waterCut > 5) ? Math.min(1, (co2 * 0.1 + h2s * 0.01) * (waterCut / 100)) : 0;
        
        const hydrateRisk = currentTemperature < hydrateTemp ? Math.min(1, (hydrateTemp - currentTemperature) / 10) : 0;
        const waxRisk = currentTemperature < waxTemp ? Math.min(1, (waxTemp - currentTemperature) / 15) : 0;
        
        ptProfile.push({
            distance: distance,
            pressure: currentPressure,
            temperature: currentTemperature,
            hydrateTemp: hydrateTemp,
            waxTemp: waxTemp
        });

        const totalRisk = Math.max(hydrateRisk, waxRisk, corrosionRisk);
        riskProfile.push({
            distance: distance,
            hydrateRisk,
            waxRisk,
            corrosionRisk,
            totalRisk
        });
    }

    const highestRiskSegment = riskProfile.reduce((max, segment) => segment.totalRisk > max.totalRisk ? segment : max, riskProfile[0]);
    
    let highestRiskFactor = "None";
    if (highestRiskSegment.totalRisk > 0) {
        if (highestRiskSegment.hydrateRisk === highestRiskSegment.totalRisk) highestRiskFactor = 'Hydrate Formation';
        else if (highestRiskSegment.waxRisk === highestRiskSegment.totalRisk) highestRiskFactor = 'Wax Deposition';
        else highestRiskFactor = 'Corrosion';
    }

    const overallRiskScore = highestRiskSegment.totalRisk;
    const overallRisk = overallRiskScore > 0.75 ? 'High' : (overallRiskScore > 0.5 ? 'Medium' : (overallRiskScore > 0.1 ? 'Low' : 'None'));

    const kpis = {
        overallRisk: overallRisk,
        highestRiskFactor: highestRiskFactor,
        mitigationCost: (overallRiskScore * 1500 + Math.random() * 100).toFixed(0),
    };

    const recommendations = {
        inhibitorType: highestRiskFactor === 'Hydrate Formation' ? 'MEG' : (highestRiskFactor === 'Wax Deposition' ? 'PPD' : 'Corrosion Inhibitor'),
        dosage: (overallRiskScore * 2000 + 100).toFixed(0),
        action: `Inject ${highestRiskFactor === 'Hydrate Formation' ? 'MEG' : 'inhibitor'} at wellhead`,
    };
    
    const alerts = riskProfile.filter(r => r.totalRisk > 0.75).map(r => ({
        timestamp: new Date().toLocaleTimeString(),
        location: `${(r.distance / 1000).toFixed(1)} kft`,
        riskType: r.hydrateRisk > r.waxRisk ? 'Hydrate' : 'Wax',
        severity: 'Critical',
        action: `Increase ${r.hydrateRisk > r.waxRisk ? 'MEG' : 'PPD'} injection`,
    }));

    if(alerts.length === 0 && overallRiskScore > 0.5) {
        alerts.push({
            timestamp: new Date().toLocaleTimeString(),
            location: `${(highestRiskSegment.distance / 1000).toFixed(1)} kft`,
            riskType: highestRiskFactor,
            severity: 'High',
            action: 'Monitor operating envelope',
        })
    }


    return {
        kpis,
        profiles: { ptProfile, riskProfile },
        recommendations,
        alerts,
    };
};