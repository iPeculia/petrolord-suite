import { quantile } from 'simple-statistics';

export const calculatePercentiles = (simulationResults) => {
    // simulationResults.pp is [depthIndex][iterations]
    const depths = simulationResults.depths;
    const p10_pp = [], p50_pp = [], p90_pp = [];
    const p10_fg = [], p50_fg = [], p90_fg = [];

    for (let i = 0; i < depths.length; i++) {
        // Need regular array for simple-statistics, Float32Array might work or need conversion
        const pp_vals = Array.from(simulationResults.pp[i]).sort((a, b) => a - b);
        const fg_vals = Array.from(simulationResults.fg[i]).sort((a, b) => a - b);

        p10_pp.push(quantile(pp_vals, 0.1));
        p50_pp.push(quantile(pp_vals, 0.5));
        p90_pp.push(quantile(pp_vals, 0.9));

        p10_fg.push(quantile(fg_vals, 0.1));
        p50_fg.push(quantile(fg_vals, 0.5));
        p90_fg.push(quantile(fg_vals, 0.9));
    }

    return {
        depths,
        pp: { p10: p10_pp, p50: p50_pp, p90: p90_pp },
        fg: { p10: p10_fg, p50: p50_fg, p90: p90_fg }
    };
};

export const calculateRiskMetrics = (simulationResults) => {
    // Calculate probability of kick (PP > FG) which shouldn't happen geologically but statistically can in model overlap
    // More realistically: Prob (PP > Expected FG) or narrow window
    return {};
};