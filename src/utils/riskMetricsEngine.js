export const calculateRiskMap = (probResults) => {
    // Probabilistic drilling window assessment
    const { pp, fg, depths } = probResults;
    
    // Simple risk index based on window width P50
    // Narrow window = (FG_P10 - PP_P90) < Threshold
    
    const risks = depths.map((d, i) => {
        const narrowWindow = (fg.p10[i] - pp.p90[i]);
        let riskLevel = 'Low';
        if (narrowWindow < 0.5) riskLevel = 'Medium'; // < 0.5 ppg margin
        if (narrowWindow < 0) riskLevel = 'High'; // Kick/Loss zone overlap

        return {
            depth: d,
            window: narrowWindow,
            riskLevel
        };
    });

    return risks;
};