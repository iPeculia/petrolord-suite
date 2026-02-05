const generateTrajectory = (inputs) => {
    const { kop, bur, targetInclination, tangentLength, targetMD } = inputs;
    const trajectory = [];
    const step = 100;
    let currentMD = 0, currentInc = 0, currentTVD = 0, currentDisp = 0;

    while (currentMD < targetMD) {
        trajectory.push({ md: currentMD, inc: currentInc, tvd: currentTVD, disp: currentDisp });
        
        let deltaTVD, deltaDisp;
        
        if (currentMD < kop) { // Vertical section
            deltaTVD = step;
            deltaDisp = 0;
            currentInc = 0;
        } else { // Build section
            const newInc = Math.min(targetInclination, currentInc + (bur / 100) * step);
            const avgIncRad = ((currentInc + newInc) / 2) * (Math.PI / 180);
            deltaTVD = step * Math.cos(avgIncRad);
            deltaDisp = step * Math.sin(avgIncRad);
            currentInc = newInc;
        }
        
        currentMD += step;
        currentTVD += deltaTVD;
        currentDisp += deltaDisp;
    }
    return trajectory;
};

const calculateForces = (trajectory, stringWeight, mudWeight, cof) => {
    return trajectory.map(point => {
        const weightInMud = stringWeight * (1 - mudWeight / 65.5);
        const normalForce = weightInMud * Math.sin(point.inc * Math.PI / 180);
        const drag = normalForce * cof;
        const axialForce = weightInMud * Math.cos(point.inc * Math.PI / 180);
        
        return { md: point.md, drag, axialForce };
    });
};

export const runTorqueDragSimulation = async (inputs) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { drillPipe, bha, fluidParams, scenarios } = inputs;

    const totalStringWeight = drillPipe.reduce((sum, dp) => sum + (dp.length * 19.5), 0) + bha.reduce((sum, b) => sum + (b.length * b.weight), 0);
    const totalStringLength = drillPipe.reduce((sum, dp) => sum + parseFloat(dp.length), 0) + bha.reduce((sum, b) => sum + parseFloat(b.length), 0);
    const avgStringWeight = totalStringWeight / totalStringLength;

    const trajectory = generateTrajectory(inputs);

    const results = {};
    if (scenarios.rotaryDrilling) {
        const forces = calculateForces(trajectory, avgStringWeight, fluidParams.mudWeight, fluidParams.cof_d);
        results.rotaryDrilling = trajectory.map((p, i) => ({
            md: p.md,
            pickup: (forces[i].axialForce + forces[i].drag) / 1000 * 1.1,
            slackoff: (forces[i].axialForce - forces[i].drag) / 1000 * 0.9,
            torque: (forces[i].drag * 5 / 2 / 12) / 1000 * 1.2,
        }));
    }
    if (scenarios.slideDrilling) {
        const forces = calculateForces(trajectory, avgStringWeight, fluidParams.mudWeight, fluidParams.cof_d * 1.5);
        results.slideDrilling = trajectory.map((p, i) => ({
            md: p.md,
            pickup: (forces[i].axialForce + forces[i].drag) / 1000 * 1.2,
            slackoff: (forces[i].axialForce - forces[i].drag) / 1000 * 0.8,
            torque: 0,
        }));
    }
    if (scenarios.trippingIn) {
        const forces = calculateForces(trajectory, avgStringWeight, fluidParams.mudWeight, fluidParams.cof_d);
        results.trippingIn = trajectory.map((p, i) => ({
            md: p.md,
            pickup: (forces[i].axialForce + forces[i].drag) / 1000,
            slackoff: (forces[i].axialForce - forces[i].drag) / 1000,
            torque: 0,
        }));
    }
    if (scenarios.trippingOut) {
        const forces = calculateForces(trajectory, avgStringWeight, fluidParams.mudWeight, fluidParams.cof_s);
        results.trippingOut = trajectory.map((p, i) => ({
            md: p.md,
            pickup: (forces[i].axialForce + forces[i].drag) / 1000 * 1.3,
            slackoff: (forces[i].axialForce - forces[i].drag) / 1000 * 0.7,
            torque: 0,
        }));
    }

    const allPickups = Object.values(results).flatMap(scen => scen.map(p => p.pickup));
    const allTorques = Object.values(results).flatMap(scen => scen.map(p => p.torque));
    const allDrags = Object.values(results).flatMap(scen => scen.map(p => p.pickup - p.slackoff));

    return {
        summary: {
            maxHookload: Math.max(...allPickups),
            maxTorque: Math.max(...allTorques),
            maxDrag: Math.max(...allDrags),
            limitsExceeded: Math.max(...allPickups) > 400,
            warnings: Math.max(...allPickups) > 400 ? ["Maximum predicted hookload exceeds typical rig limit (400 klbs)."] : [],
        },
        scenarios: results,
    };
};