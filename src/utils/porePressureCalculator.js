export const calculatePorePressure = (inputs) => {
    const { depths, obg_psi, sigma_e } = inputs;

    // Terzaghi: Pp = Sigma_v - Sigma_e
    const pp_psi = [];
    const pp_ppg = [];

    for(let i=0; i<depths.length; i++) {
        const sv = obg_psi[i];
        const se = sigma_e[i];
        const depth = depths[i];

        if (sv !== null && se !== null && depth > 0) {
            const pp = sv - se;
            pp_psi.push(pp);
            pp_ppg.push(pp / (0.052 * depth));
        } else {
            pp_psi.push(null);
            pp_ppg.push(null);
        }
    }

    return { pp_psi, pp_ppg };
};