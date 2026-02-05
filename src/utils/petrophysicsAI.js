import { mean, standardDeviation, min, max, quantile } from 'simple-statistics';

// --- 1. Anomaly Detection ---
export const detectAnomalies = (well) => {
    const anomalies = [];
    const depth = well.data.map(d => d[well.curveMap.DEPTH] || d.DEPTH);
    
    // Check 1: Data Gaps
    if (depth.length > 1) {
        const steps = [];
        for(let i=1; i<depth.length; i++) steps.push(depth[i] - depth[i-1]);
        const avgStep = mean(steps);
        const maxStep = max(steps);
        
        if (maxStep > avgStep * 5) {
            anomalies.push({
                type: 'Data Gap',
                severity: 'High',
                location: `Depth ${(depth[steps.indexOf(maxStep)]).toFixed(1)}`,
                description: `Significant data gap detected (${maxStep.toFixed(2)}m). Check log splicing.`
            });
        }
    }

    // Check 2: Washouts (Caliper vs Bit Size)
    // Assuming BS (Bit Size) is constant or a curve. If missing, assume 8.5"
    const caliKey = well.curveMap.CALI || Object.keys(well.curveMap).find(k => k.includes('CAL'));
    const bsKey = well.curveMap.BS || Object.keys(well.curveMap).find(k => k.includes('BS') || k.includes('BIT'));
    
    if (caliKey) {
        const caliData = well.data.map(d => d[caliKey]);
        const bsData = bsKey ? well.data.map(d => d[bsKey]) : Array(caliData.length).fill(8.5);
        
        let washoutCount = 0;
        caliData.forEach((val, i) => {
            if (val > (bsData[i] + 2.0)) washoutCount++;
        });

        if (washoutCount > caliData.length * 0.1) {
            anomalies.push({
                type: 'Borehole Quality',
                severity: 'Medium',
                location: 'Multiple Zones',
                description: `Severe washout detected in ${(washoutCount/caliData.length*100).toFixed(0)}% of the well. Log corrections recommended.`
            });
        }
    }

    // Check 3: Unphysical Values
    const phiKey = well.curveMap.PHIE || well.curveMap.PHIT;
    if (phiKey) {
        const badPhi = well.data.filter(d => d[phiKey] < -0.05 || d[phiKey] > 0.45).length;
        if (badPhi > 0) {
            anomalies.push({
                type: 'Physical Bounds',
                severity: 'High',
                location: 'Porosity Track',
                description: `Found ${badPhi} points with unphysical porosity values (<-5% or >45%).`
            });
        }
    }

    return anomalies;
};

// --- 2. Trend Analysis & Optimization ---
export const analyzeTrends = (well) => {
    const insights = [];
    const grKey = well.curveMap.GR;
    
    if (grKey) {
        const grVals = well.data.map(d => d[grKey]).filter(v => v!=null);
        const avgGr = mean(grVals);
        
        if (avgGr < 40) {
            insights.push({
                category: 'Geology',
                title: 'Clean Sand Predominance',
                score: 85,
                details: 'Low average Gamma Ray suggests a sand-rich environment. Favorable for reservoir quality.'
            });
        } else if (avgGr > 90) {
            insights.push({
                category: 'Geology',
                title: 'Shale Dominated',
                score: 90,
                details: 'High average Gamma Ray indicates shaly formation. Consider specialized clay corrections.'
            });
        }
    }

    // Pay Zone Optimization
    // Simple Pay Flag logic: Vsh < 0.4, Phi > 0.1, Sw < 0.5
    const vshKey = well.curveMap.VSH;
    const phiKey = well.curveMap.PHIE;
    const swKey = well.curveMap.SW;

    if (vshKey && phiKey && swKey) {
        let payCount = 0;
        well.data.forEach(d => {
            if (d[vshKey] < 0.4 && d[phiKey] > 0.1 && d[swKey] < 0.5) payCount++;
        });
        
        const payNet = payCount * (well.statistics.step || 0.1524); // meters
        
        if (payNet > 10) {
            insights.push({
                category: 'Production',
                title: 'Completion Candidate',
                score: 95,
                details: `Identified ${payNet.toFixed(1)}m of potential net pay. Recommended for perforation strategy optimization.`
            });
        }
    }

    return insights;
};

// --- 3. Risk Assessment ---
export const assessRisk = (well) => {
    // Monte Carlo simulation logic usually goes here, but we'll do a risk matrix based on data quality and variance
    const risks = [];
    
    // Data Quality Risk
    const nullCount = well.data.reduce((acc, row) => {
        return acc + Object.values(row).filter(v => v === null || v === -999.25).length;
    }, 0);
    const totalPoints = well.data.length * Object.keys(well.data[0] || {}).length;
    const qualityRatio = 1 - (nullCount / totalPoints);

    if (qualityRatio < 0.8) {
        risks.push({
            area: 'Reserves Estimation',
            level: 'High',
            prob: '80%',
            impact: 'Significant under/overestimation due to data gaps.',
            mitigation: 'Acquire offset well data or run stochastic imputation.'
        });
    }

    // Geological Risk (Heterogeneity)
    const permKey = well.curveMap.PERM;
    if (permKey) {
        const perms = well.data.map(d => d[permKey]).filter(v => v > 0);
        if (perms.length > 10) {
            const p10 = quantile(perms, 0.1);
            const p90 = quantile(perms, 0.9);
            const heterogeneity = p90 / p10; // Dykstra-Parsons proxy
            
            if (heterogeneity > 100) {
                risks.push({
                    area: 'Production Strategy',
                    level: 'Medium',
                    prob: '60%',
                    impact: 'Early water breakthrough likely due to high permeability contrast.',
                    mitigation: 'Consider inflow control devices (ICDs) for completion.'
                });
            }
        }
    }

    return risks;
};

// --- 4. Automated Comparison ---
export const compareWells = (activeWell, allWells) => {
    if (!allWells || allWells.length < 2) return [];

    const comparisons = allWells.map(w => {
        const phiKey = w.curveMap.PHIE || w.curveMap.PHIT;
        const phis = w.data.map(d => d[phiKey]).filter(v => v!=null);
        const avgPhi = phis.length ? mean(phis) : 0;
        return { id: w.id, name: w.name, avgPhi };
    });

    // Sort by Phi
    comparisons.sort((a,b) => b.avgPhi - a.avgPhi);
    
    const rank = comparisons.findIndex(c => c.id === activeWell.id) + 1;
    
    return {
        rank,
        total: allWells.length,
        topPerformer: comparisons[0],
        diffFromTop: (comparisons[0].avgPhi - (comparisons.find(c => c.id === activeWell.id)?.avgPhi || 0)).toFixed(3)
    };
};

// --- 5. NLP Summary Generator ---
export const generateAISummary = (well, insights, anomalies, risks) => {
    const name = well.name || 'Target Well';
    const insightCount = insights.length;
    const anomalyCount = anomalies.length;
    const riskLevel = risks.some(r => r.level === 'High') ? 'Elevated' : 'Moderate';

    let text = `**Executive Summary for ${name}:**\n\n`;
    text += `The automated petrophysical analysis indicates a ${riskLevel} risk profile. `;
    text += `We identified ${insightCount} key optimization opportunities, primarily driven by ${insights[0]?.title || 'general formation trends'}. `;
    
    if (anomalyCount > 0) {
        text += `\n\n**Data Quality Alert:** ${anomalyCount} anomalies were detected, with the most severe being "${anomalies[0]?.type}". Immediate review of log quality is advised before finalizing reserves. `;
    } else {
        text += `\n\nData quality appears robust with no significant anomalies detected. `;
    }

    if (insights.some(i => i.title === 'Completion Candidate')) {
        text += `\n\n**Upside Potential:** The well shows strong indicators for completion, with significant net pay identified. Recommendation is to proceed with detailed nodal analysis.`;
    }

    return text;
};