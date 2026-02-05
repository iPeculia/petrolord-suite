export const calculatePortfolioRisk = (wells) => {
    const totalWells = wells.length;
    let highRiskCount = 0;
    let totalContingency = 0;

    const risks = wells.map(w => {
        // Simple risk heuristic
        const maxPP = Math.max(...w.results.pp);
        
        // Find minimum margin across the whole well
        // Filter out invalid values first
        const margins = w.results.fg.map((f, i) => f - w.results.pp[i]).filter(m => !isNaN(m));
        const minMargin = margins.length > 0 ? Math.min(...margins) : 1000;
        
        let riskLevel = 'Low';
        let contingency = 500000; // Base contingency cost $500k

        if (minMargin < 200) {
            riskLevel = 'High';
            highRiskCount++;
            contingency += 1500000; // Add $1.5M for narrow window mitigation
        } else if (minMargin < 500) {
            riskLevel = 'Medium';
            contingency += 500000;
        }

        totalContingency += contingency;

        return {
            wellId: w.id,
            name: w.name,
            riskLevel,
            contingency
        };
    });

    return {
        summary: {
            totalWells,
            highRiskPercentage: totalWells > 0 ? (highRiskCount / totalWells) * 100 : 0,
            totalContingencyCost: totalContingency,
            averageRiskScore: totalWells > 0 ? (highRiskCount * 3 + (totalWells - highRiskCount)) / totalWells : 0
        },
        wellRisks: risks
    };
};