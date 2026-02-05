export const runCementingSimulation = (inputs) => {
    const {
        casingOD,
        holeDiameter,
        shoeDepth,
        slurries,
        spacers,
        pumpRate,
    } = inputs;

    const annularCapacity = (holeDiameter ** 2 - casingOD ** 2) / 1029.4; // bbl/ft
    const casingCapacity = (casingOD - 0.25*2) ** 2 / 1029.4; // Assuming 0.25" wall thickness, bbl/ft

    let totalSlurryVolume = 0;
    if (slurries && Array.isArray(slurries)) {
        totalSlurryVolume = slurries.reduce((acc, s) => acc + parseFloat(s.volume), 0);
    }

    let totalSpacerVolume = 0;
    if (spacers && Array.isArray(spacers)) {
        totalSpacerVolume = spacers.reduce((acc, s) => acc + parseFloat(s.volume), 0);
    }
    
    const displacementVolume = (shoeDepth * casingCapacity) - totalSlurryVolume - totalSpacerVolume;
    const totalJobTime = (totalSlurryVolume + totalSpacerVolume + displacementVolume) / pumpRate;

    const summary = {
        displacementEfficiency: 95 + Math.random() * 4.9, // 95-99.9%
        maxPressure: 1500 + Math.random() * 1000,
        totalSlurryVolume,
        freeFallDuration: Math.random() * 5,
        fracGradient: 0.8 + Math.random() * 0.2, // ppg/ft * shoeDepth
    };

    const ecdProfile = [];
    for (let depth = 0; depth <= shoeDepth; depth += 500) {
        const hydrostatic = (slurries[0].density * 0.052 * depth);
        const annularPressureLoss = Math.random() * 200;
        const ecd = (hydrostatic + annularPressureLoss) / (0.052 * depth);
        ecdProfile.push({ depth, ecd });
    }
    // ensure final point is at shoe depth
    if (ecdProfile[ecdProfile.length -1].depth < shoeDepth) {
         const hydrostatic = (slurries[0].density * 0.052 * shoeDepth);
        const annularPressureLoss = Math.random() * 200;
        const ecd = (hydrostatic + annularPressureLoss) / (0.052 * shoeDepth);
        ecdProfile.push({ depth: shoeDepth, ecd });
    }

    const pressureProfile = [];
    for (let time = 0; time <= totalJobTime; time += totalJobTime/20) {
        let pressure = 0;
        if (time < totalJobTime * 0.8) {
             pressure = 200 + 2000 * (time/totalJobTime) + (Math.random() - 0.5) * 100;
        } else {
            pressure = summary.maxPressure * (1 - (time - totalJobTime * 0.8)/(totalJobTime*0.2)) + (Math.random() - 0.5) * 50;
        }
        pressureProfile.push({time: time.toFixed(1), pressure: Math.max(0, pressure) });
    }
    
    return { summary, ecdProfile, pressureProfile };
};