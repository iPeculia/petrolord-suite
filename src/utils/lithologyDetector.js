/**
 * Algorithmic Lithology Detection from Logs
 * 
 * Rules based on standard petrophysical cutoffs:
 * 1. GR (Gamma Ray): Low = Clean (Sand/Carb), High = Shale
 * 2. RES (Resistivity): High = Hydrocarbon/Tight, Low = Water/Shale
 * 3. DT (Sonic): Low = Tight (Carb), High = Shale, Mid = Sand
 * 4. RHOB (Density): High = Dolomite/Anhydrite, Mid = Sand/Lime, Low = Coal/Salt
 */

export const detectLithologyAtDepth = (logs, depth) => {
    if (!logs) return 'Unknown';

    // Extract values at this depth index (assuming logs are aligned arrays or objects)
    // For this utility, we expect logs to be an object like { GR: val, RES: val, ... } at specific depth
    const gr = logs.GR;
    const dt = logs.dt || logs.DT;
    const rhob = logs.rhob || logs.RHOB;
    const res = logs.res || logs.RES;

    // Weighted Voting System
    let scores = {
        'Sandstone': 0,
        'Shale': 0,
        'Limestone': 0,
        'Dolomite': 0,
        'Salt': 0,
        'Coal': 0
    };

    // 1. Gamma Ray Logic (Primary Indicator - 40% weight)
    if (gr !== undefined && gr !== null) {
        if (gr < 50) scores['Sandstone'] += 4; // Clean
        else if (gr > 80) scores['Shale'] += 4; // Shaly
        else {
            scores['Sandstone'] += 2;
            scores['Shale'] += 2;
        }
    }

    // 2. Resistivity Logic (30% weight)
    if (res !== undefined && res !== null) {
        if (res < 10) scores['Shale'] += 3;
        else if (res > 100) scores['Limestone'] += 2; // Likely tight or HC
        else scores['Sandstone'] += 1;
    }

    // 3. Sonic Logic (DT) (20% weight)
    if (dt !== undefined && dt !== null) {
        if (dt < 55) {
            scores['Limestone'] += 2;
            scores['Dolomite'] += 2;
        } else if (dt >= 55 && dt <= 80) {
            scores['Sandstone'] += 2;
        } else if (dt > 80) {
            scores['Shale'] += 2;
        }
    }

    // 4. Density Logic (RHOB) (10% weight)
    if (rhob !== undefined && rhob !== null) {
        if (rhob < 2.1) scores['Salt'] += 5; // Very low density usually salt or coal
        else if (rhob < 2.3) scores['Sandstone'] += 1;
        else if (rhob > 2.4 && rhob <= 2.7) scores['Limestone'] += 1;
        else if (rhob > 2.7) scores['Dolomite'] += 1;
    }

    // Special Case: Coal (Low density, high sonic, low GR usually)
    if (rhob < 1.8 && dt > 90) return 'Coal';

    // Determine Winner
    let maxScore = -1;
    let winner = 'Unknown';

    Object.entries(scores).forEach(([lith, score]) => {
        if (score > maxScore) {
            maxScore = score;
            winner = lith;
        }
    });

    // Default fallback if not enough data
    if (maxScore === 0) return 'Unknown';

    return winner;
};

/**
 * Batch process an entire well
 */
export const generateLithologyColumn = (depths, logsInput) => {
    if (!depths || !logsInput) return [];

    return depths.map((d, i) => {
        const logSlice = {
            GR: logsInput.GR ? logsInput.GR[i] : null,
            DT: logsInput.dt ? logsInput.dt[i] : null,
            RHOB: logsInput.rhob ? logsInput.rhob[i] : null,
            RES: logsInput.res ? logsInput.res[i] : null,
        };
        return {
            depth: d,
            lithology: detectLithologyAtDepth(logSlice, d)
        };
    });
};