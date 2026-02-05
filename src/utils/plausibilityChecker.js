export const checkPlausibility = (results) => {
    const { depths, pp_ppg, fg_ppg, obg_ppg } = results;
    const flags = [];

    for(let i=0; i<depths.length; i+=50) { // Sample every 50ft
        const pp = pp_ppg[i];
        const fg = fg_ppg[i];
        const obg = obg_ppg[i];
        const d = depths[i];

        if (pp && fg && pp > fg) {
            flags.push({
                depth: d,
                type: 'Critical',
                message: 'Pore Pressure exceeds Fracture Gradient (Kick/Loss Zone)'
            });
        }

        if (pp && obg && pp > obg) {
             flags.push({
                depth: d,
                type: 'Data Error',
                message: 'Pore Pressure exceeds Overburden (Physical impossibility in relaxational basins)'
            });
        }
    }
    
    return {
        isValid: flags.filter(f => f.type === 'Critical').length === 0,
        flags
    };
};