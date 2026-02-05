export const generateNodalData = (inputs) => {
    const { reservoirPressure, aofp } = inputs;

    // Generate IPR curve (Vogel's equation)
    const ipr = [];
    for (let q = 0; q <= aofp; q += aofp / 20) {
        const pwf = reservoirPressure * (1 - 0.2 * (q / aofp) - 0.8 * (q / aofp)**2);
        ipr.push({ x: q, y: pwf });
    }

    // Generate OPR curves (simplified)
    const opr_current = [];
    const opr_optimal = [];
    for (let q = 0; q <= aofp; q += aofp / 20) {
        const baseP = 500 + 0.1 * q;
        opr_current.push({ x: q, y: baseP + 0.05 * q }); // Higher pressure drop for sub-optimal
        opr_optimal.push({ x: q, y: baseP });
    }

    // Find intersection points (simplified)
    const findIntersection = (iprCurve, oprCurve) => {
        for (let i = 1; i < iprCurve.length; i++) {
            if (iprCurve[i].y < oprCurve[i].y) {
                // Simple linear interpolation
                const q1 = iprCurve[i-1].x, p_ipr1 = iprCurve[i-1].y, p_opr1 = oprCurve[i-1].y;
                const q2 = iprCurve[i].x, p_ipr2 = iprCurve[i].y, p_opr2 = oprCurve[i].y;
                const q = q1 + (q2 - q1) * (p_opr1 - p_ipr1) / (p_ipr2 - p_opr2 - p_ipr1 + p_opr1);
                const p = p_ipr1 + (p_ipr2 - p_ipr1) * (q - q1) / (q2 - q1);
                return { x: q, y: p };
            }
        }
        return iprCurve[iprCurve.length - 1];
    };

    const current_point = findIntersection(ipr, opr_current);
    const optimal_point = findIntersection(ipr, opr_optimal);

    const kpis = {
        currentRate: current_point.x.toFixed(0),
        currentRevenue: (current_point.x * 80).toFixed(0), // Assuming $80/bbl
        currentChoke: '60',
        status: 'Off-Design',
    };

    const recommendations = {
        choke: '85',
        liftRate: '55',
        incrementalRate: (optimal_point.x - current_point.x).toFixed(0),
        revenueUplift: ((optimal_point.x - current_point.x) * 80).toFixed(0),
    };

    return {
        kpis,
        recommendations,
        plotsData: {
            ipr,
            opr_current,
            opr_optimal,
            current_point,
            optimal_point,
        },
    };
};