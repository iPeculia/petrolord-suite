/**
 * HSE Risk Model
 * Defines structure for HSE risks and hazards.
 */

export const RiskTypes = {
    SAFETY: 'Safety',
    HEALTH: 'Health',
    ENVIRONMENTAL: 'Environmental',
    COMMUNITY: 'Community',
    REGULATORY: 'Regulatory',
    SECURITY: 'Security'
};

export const RiskCategories = {
    HAZARD: 'Hazard Identification',
    EXPOSURE: 'Exposure',
    CONSEQUENCE: 'Consequence',
    PROBABILITY: 'Probability'
};

export const RiskStatus = {
    IDENTIFIED: 'Identified',
    ASSESSED: 'Assessed',
    MITIGATED: 'Mitigated',
    CLOSED: 'Closed'
};

export const createRisk = (data = {}) => ({
    id: data.id || `risk-${Date.now()}`,
    name: data.name || '',
    description: data.description || '',
    type: data.type || RiskTypes.SAFETY,
    category: data.category || RiskCategories.HAZARD,
    probability: data.probability || 3, // 1-5
    impact: data.impact || 3, // 1-5
    mitigation: data.mitigation || '',
    owner: data.owner || '',
    status: data.status || RiskStatus.IDENTIFIED,
    createdDate: data.createdDate || new Date().toISOString(),
    modifiedDate: new Date().toISOString()
});

export const calculateRiskScore = (risk) => {
    return (risk.probability || 0) * (risk.impact || 0);
};

export const getRiskLevel = (score) => {
    if (score >= 15) return 'High';
    if (score >= 8) return 'Medium';
    return 'Low';
};