export const calculateFractureGradient = (inputs) => {
    const { depths, obg_psi, pp_psi, params = {} } = inputs;
    const { poisson = 0.4 } = params;

    const fg_psi = [];
    const fg_ppg = [];

    // Matthews & Kelly / Eaton FG
    // FG = PP + K0 * (OBG - PP)
    // K0 = v / (1 - v)
    const k0 = poisson / (1 - poisson);

    for(let i=0; i<depths.length; i++) {
        const pp = pp_psi[i];
        const obg = obg_psi[i];
        const depth = depths[i];

        if (pp !== null && obg !== null && depth > 0) {
            const fg = pp + k0 * (obg - pp);
            fg_psi.push(fg);
            fg_ppg.push(fg / (0.052 * depth));
        } else {
            fg_psi.push(null);
            fg_ppg.push(null);
        }
    }

    return { fg_psi, fg_ppg };
};