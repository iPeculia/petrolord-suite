// Simplified simulation of wellbore stability
// This is a placeholder for a complex backend geomechanical model.

const toEMW = (gradient) => gradient / 0.052;

export const runWellboreStabilitySimulation = async (inputs) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { tvd, porePressureGradient, fractureGradient, ucs, shmin, shmax, poisson } = inputs;
    
    const plotData = [];
    const depthIntervals = 20;
    const depthStep = tvd / depthIntervals;

    let narrowestWindow = 100;
    let criticalDepth = 0;

    for (let i = 0; i <= depthIntervals; i++) {
        const currentDepth = i * depthStep;
        
        const p_p = porePressureGradient * currentDepth;
        const s_hmin = shmin * currentDepth;
        const s_hmax = shmax * currentDepth;

        // Simplified Kirsch equation for collapse pressure
        const collapse_pressure = (3 * s_hmax - s_hmin - ucs) / 2;
        
        const collapse_gradient = Math.max(p_p, collapse_pressure) / currentDepth;
        const fracture_gradient_val = fractureGradient;

        const collapse_emw = toEMW(collapse_gradient);
        const fracture_emw = toEMW(fracture_gradient_val);
        const pore_emw = toEMW(porePressureGradient);

        const window = fracture_emw - collapse_emw;
        if (window < narrowestWindow) {
            narrowestWindow = window;
            criticalDepth = currentDepth;
        }

        plotData.push({
            depth: currentDepth,
            porePressure: pore_emw,
            collapse: collapse_emw,
            fracture: fracture_emw,
        });
    }

    const recommendations = [];
    if (narrowestWindow < 0.5) {
        recommendations.push(`Extremely narrow mud window (${narrowestWindow.toFixed(2)} ppg) at ${criticalDepth.toFixed(0)} ft. High risk of simultaneous collapse and fracture.`);
    } else if (narrowestWindow < 1.0) {
        recommendations.push(`Narrow mud window (${narrowestWindow.toFixed(2)} ppg) near ${criticalDepth.toFixed(0)} ft. Careful mud weight management is required.`);
    }

    return {
        summary: {
            narrowestWindow: narrowestWindow,
            criticalDepth: criticalDepth.toFixed(0),
            primaryRisk: narrowestWindow < 1.0 ? 'Breakout & Losses' : 'Stable',
        },
        plotData,
        recommendations,
    };
};