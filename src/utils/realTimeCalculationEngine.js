import { runPPFGWorkflow } from './ppfgEngine';

let lastCalculation = 0;
const CALC_DELAY = 50; // ms debounce

// Simple debounce wrapper for the workflow
export const calculateRealTime = (inputs, params) => {
    const now = Date.now();
    if (now - lastCalculation < CALC_DELAY) {
        // In a real robust engine we might return a cached promise or cancel previous
        // For UI responsiveness in React, typical debounce is handled at the hook level
        // This function performs the direct calculation.
    }
    lastCalculation = now;

    // Prepare inputs for ppfgEngine
    // inputs contains arrays: depths, gr, res, dt, rhob
    // params contains scalars: eatonExponent, poisson, etc.

    // We need to construct the params object expected by runPPFGWorkflow
    const engineParams = {
        eatonExponent: params.eatonExponent,
        poisson: params.poissonRatio,
        nct: {
            a: params.nctIntercept,
            b: params.nctSlope
        }
        // Bowers parameters etc can be added here if the engine supports them
    };

    const workflowInputs = {
        ...inputs,
        params: engineParams,
        waterDepth: inputs.waterDepth || 0,
        airGap: inputs.airGap || 0
    };

    return runPPFGWorkflow(workflowInputs);
};