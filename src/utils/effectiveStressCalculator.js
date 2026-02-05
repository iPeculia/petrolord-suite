// Calculates vertical effective stress (Sigma_e) using various methods
// Sigma_e = Sigma_v - Pp (Terzaghi)
// BUT here we predict Sigma_e from Velocity/Resistivity to then find Pp.

export const calculateEffectiveStress = (inputs) => {
    const { 
        depths, 
        obg_psi, 
        dt, 
        dt_nct, 
        res, 
        res_nct, 
        method = 'eaton_sonic', 
        params = {} 
    } = inputs;

    const { eatonExponent = 3.0 } = params;
    const sigma_e = [];
    const pp_psi = []; // Implicitly calculating PP to get Sigma_e or vice versa.
    // Actually, Eaton calculates PP directly. 
    // If we want Sigma_e first:
    // Eaton: Sigma_e = Sigma_v * (DT_nct / DT_obs)^N  (This is equivalent to Eaton PP form)

    for(let i=0; i<depths.length; i++) {
        const sv = obg_psi[i]; // Sigma_v
        let se = 0; // Sigma_e

        if (!sv) {
            sigma_e.push(null);
            continue;
        }

        if (method === 'eaton_sonic') {
            const obs = dt[i];
            const nct = dt_nct[i];
            if (obs && nct) {
                // Sigma_e = (OBG - Phydro) * (NCT/Obs)^N ???
                // No, Eaton standard: PP = OBG - (OBG - Pn) * (NCT/Obs)^N
                // Which implies Sigma_e = (OBG - Pn) * (NCT/Obs)^N
                // Where (OBG - Pn) is Normal Effective Stress (Sigma_e_normal)
                
                // We need Pn (Normal Pore Pressure, usually Hydrostatic)
                const pn = depths[i] * 0.44; // Hydrostatic assumption
                const sigma_e_normal = sv - pn;
                
                // Ratio: For Sonic (DT), undercompaction (Overpressure) means DT_obs > DT_nct
                // So Ratio = DT_nct / DT_obs < 1.
                // Sigma_e = Sigma_e_normal * (Ratio)^N
                
                se = sigma_e_normal * Math.pow((nct / obs), eatonExponent);
            } else {
                se = sv - (depths[i] * 0.44); // Fallback to hydrostatic
            }
        }
        // Add other methods (Resistivity, Bowers) here
        
        sigma_e.push(se);
    }

    return sigma_e;
};