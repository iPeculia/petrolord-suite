export const runFracSimulation = (inputs) => {
    const {
        pumpRate,
        totalFluidVolume,
        proppantConcentration,
    } = inputs;
    
    const jobDuration = totalFluidVolume / pumpRate;

    const summary = {
        fracHalfLength: 450 + Math.random() * 100, // ft
        avgConductivity: 1500 + Math.random() * 500, // mD-ft
        ip30: 800 + Math.random() * 400, // bbl/d
        totalProppant: (totalFluidVolume * 42 * proppantConcentration) / 1000000, // M lbs
    };

    const treatmentPlot = [];
    for (let time = 0; time <= jobDuration; time += jobDuration / 50) {
        const pressure = 8000 + 1000 * Math.sin(time / (jobDuration/4)) + (Math.random() - 0.5) * 300;
        const rate = pumpRate * (1 - Math.exp(-time / 5)); // Ramp up
        treatmentPlot.push({
            time: time.toFixed(1),
            pressure: pressure.toFixed(0),
            rate: rate.toFixed(1),
        });
    }

    return { summary, treatmentPlot };
};