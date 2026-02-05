export const detectAnomalies = (wells) => {
    const anomalies = [];

    wells.forEach(well => {
        const pp = well.results.pp;
        const fg = well.results.fg;
        
        // 1. Narrow Window Check
        // Sample logic: check every 50th point to save perf
        for (let i = 0; i < pp.length; i+=50) {
            if (fg[i] - pp[i] < 200) { // Assuming PSI, narrow window
                anomalies.push({
                    wellId: well.id,
                    wellName: well.name,
                    depth: well.depths[i],
                    type: 'Narrow Window',
                    severity: (fg[i] - pp[i] < 100) ? 'Critical' : 'Major',
                    details: `Margin: ${(fg[i] - pp[i]).toFixed(0)} psi`
                });
                // Skip ahead further if found to avoid duplicates in same zone
                i += 200; 
            }
        }

        // 2. Pressure Ramp Check (Transition Zone)
        for (let i = 10; i < pp.length; i+=50) {
            if (!well.depths[i] || !well.depths[i-10]) continue;
            
            const gradientChange = (pp[i] - pp[i-10]) / (well.depths[i] - well.depths[i-10]); // psi/ft
            if (gradientChange > 1.0) { // Sudden jump > 1 psi/ft
                anomalies.push({
                    wellId: well.id,
                    wellName: well.name,
                    depth: well.depths[i],
                    type: 'Pressure Ramp',
                    severity: 'Major',
                    details: 'Rapid pressure increase detected'
                });
                i += 200;
            }
        }
    });

    return anomalies;
};