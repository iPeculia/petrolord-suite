// Simplified simulation of drilling fluid properties
// This is a placeholder for a complex backend model.

const ADDITIVE_PROPERTIES = {
    'Bentonite': { density: 2.6, pv: 0.8, yp: 1.5, costPerSack: 50 },
    'Barite': { density: 4.2, pv: 0.1, yp: 0.2, costPerSack: 80 },
    'Xanthan Gum': { density: 1.5, pv: 0.2, yp: 2.5, costPerSack: 200 },
    'PAC': { density: 1.6, pv: 0.3, yp: 0.5, costPerSack: 150 },
    'Lignosulfonate': { density: 1.4, pv: -0.2, yp: -0.3, costPerSack: 120 },
};

const BASE_FLUID_DENSITY = {
    'Fresh Water': 8.34, // ppg
    'Brine (NaCl)': 8.5,
    'Diesel Oil': 7.2,
    'Synthetic Oil': 6.8,
};

// Sack weight in lbs
const SACK_WEIGHT = 100;

export const runDrillingFluidsSimulation = async (inputs) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { projectInfo, baseFluid, additives, totalVolume } = inputs;
    
    let totalWeight = 0;
    let totalVolumeGal = 0;
    let predictedPV = 5; // Start with base fluid PV
    let predictedYP = 3; // Start with base fluid YP

    // Base fluid contribution
    const baseDensity = BASE_FLUID_DENSITY[baseFluid.type] || 8.34;
    totalWeight += baseDensity;
    totalVolumeGal += 1;

    // Additives contribution
    additives.forEach(additive => {
        const props = ADDITIVE_PROPERTIES[additive.name] || {};
        const volumeOfAdditiveGal = (additive.concentration / props.density) / 8.34;
        totalWeight += (additive.concentration / 42) * (props.density / 8.34);
        totalVolumeGal += volumeOfAdditiveGal / 42;
        predictedPV += (additive.concentration / 10) * props.pv;
        predictedYP += (additive.concentration / 10) * props.yp;
    });

    const predictedDensity = totalWeight / totalVolumeGal;

    const costBreakdown = additives.map(additive => ({
        name: additive.name,
        cost: (additive.concentration * additive.cost) / SACK_WEIGHT,
    }));
    const perBarrelCost = costBreakdown.reduce((sum, item) => sum + item.cost, 0);

    const rheologyCurve = [
        { shearRate: 3, shearStress: predictedYP * 0.8 },
        { shearRate: 6, shearStress: predictedYP * 1.1 },
        { shearRate: 100, shearStress: predictedYP + predictedPV * (100/300) },
        { shearRate: 200, shearStress: predictedYP + predictedPV * (200/300) },
        { shearRate: 300, shearStress: predictedYP + predictedPV },
        { shearRate: 600, shearStress: predictedYP + predictedPV * 2 },
    ];
    
    const mixingInstructionsRecipe = additives.map(additive => ({
        name: additive.name,
        quantity: (additive.concentration * totalVolume) / SACK_WEIGHT,
        unit: 'sacks'
    }));

    return {
        summary: {
            density: predictedDensity,
            pv: predictedPV,
            yp: predictedYP,
            fluidLoss: Math.max(5, 20 - (additives.find(a => a.name === 'PAC')?.concentration || 0) / 2),
            densityStatus: Math.abs(predictedDensity - projectInfo.targetDensity) < 0.2 ? 'OK' : 'Warning',
            pvStatus: Math.abs(predictedPV - projectInfo.targetPV) < 3 ? 'OK' : 'Warning',
        },
        targets: {
            density: projectInfo.targetDensity,
            pv: projectInfo.targetPV,
        },
        rheologyCurve,
        cost: {
            perBarrel: perBarrelCost,
            total: perBarrelCost * totalVolume,
            breakdown: costBreakdown,
        },
        mixingInstructions: {
            totalVolume: totalVolume,
            recipe: [
                { name: baseFluid.type, quantity: totalVolume, unit: 'bbl' },
                ...mixingInstructionsRecipe
            ]
        }
    };
};