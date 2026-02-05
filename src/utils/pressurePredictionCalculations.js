const PPG_TO_SG = 1 / 8.345;
const SG_TO_PPG = 8.345;
const G_H = 0.433; // Hydrostatic gradient in psi/ft

export const runPressureSimulation = async (inputs) => {
    // Simulate async backend call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { 
        maxDepth, rho_c, rho_max, k, depth_nct, nct_val, 
        eaton_exp_pp, eaton_exp_fg, poisson_ratio 
    } = inputs;
    
    const plotData = [];
    const hazardLog = [];
    const depthIntervals = 100;
    const depthStep = maxDepth / depthIntervals;

    let max_ppg_val = 0;
    let max_ppg_depth = 0;

    for (let i = 0; i <= depthIntervals; i++) {
        const currentDepth = i * depthStep;

        // 1. Overburden Stress (Lithostatic Gradient)
        const rho_z = rho_max - (rho_max - rho_c) * Math.exp(-k * currentDepth);
        const Sv = rho_z * SG_TO_PPG; // Overburden in ppg

        // 2. Pore Pressure Prediction
        // Normal Compaction Trend (NCT)
        let nct_resistivity = nct_val * Math.pow(currentDepth / depth_nct, 0.2); // Simplified NCT
        if (currentDepth < depth_nct) nct_resistivity = nct_val;
        
        // Observed "log" value (simulated)
        let obs_resistivity = nct_resistivity;
        if (currentDepth > 8000) {
            const overpressure_factor = (currentDepth - 8000) / 4000;
            obs_resistivity *= (1 - 0.4 * Math.min(1, overpressure_factor)); // Decrease resistivity in overpressure zone
        }

        // Eaton's Method for Pore Pressure
        const p_normal_psi = G_H * currentDepth;
        const Sv_psi = (Sv / SG_TO_PPG) * G_H * currentDepth;
        const pore_pressure_psi = Sv_psi - (Sv_psi - p_normal_psi) * Math.pow(obs_resistivity / nct_resistivity, eaton_exp_pp);
        const pore_pressure_ppg = (pore_pressure_psi / currentDepth) / G_H * SG_TO_PPG;

        // 3. Fracture Gradient
        // Eaton's Method for Fracture Gradient
        const frac_grad_psi_ft = (Sv_psi / currentDepth - pore_pressure_psi / currentDepth) * (poisson_ratio / (1 - poisson_ratio)) + (pore_pressure_psi / currentDepth);
        const frac_grad_ppg = frac_grad_psi_ft / G_H * SG_TO_PPG;

        if(pore_pressure_ppg > max_ppg_val) {
            max_ppg_val = pore_pressure_ppg;
            max_ppg_depth = currentDepth;
        }

        const drillingWindow = frac_grad_ppg - pore_pressure_ppg;
        if (drillingWindow < 1.0 && currentDepth > 1000) {
             hazardLog.push(`Narrow drilling window (${drillingWindow.toFixed(2)} ppg) identified at ${currentDepth.toFixed(0)} ft.`);
        }

        plotData.push({
            depth: currentDepth,
            overburden: Sv,
            pore_pressure: pore_pressure_ppg,
            frac_grad: frac_grad_ppg,
        });
    }

    return {
        summary: {
            max_pore_pressure: max_ppg_val.toFixed(2),
            max_pp_depth: max_ppg_depth.toFixed(0),
        },
        plotData,
        hazardLog: [...new Set(hazardLog.slice(0, 5))], // Unique and limited hazards
    };
};