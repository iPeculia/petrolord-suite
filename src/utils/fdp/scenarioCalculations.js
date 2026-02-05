/**
 * Scenario Calculations Utility
 * NPV, IRR, and Economic metrics.
 */

export const calculateNPV = (cashFlows, discountRate = 0.10) => {
    return cashFlows.reduce((acc, val, t) => acc + val / Math.pow(1 + discountRate, t), 0);
};

export const calculateIRR = (cashFlows) => {
    // Simple Newton-Raphson approximation for IRR
    let guess = 0.1;
    for (let i = 0; i < 20; i++) {
        const npv = calculateNPV(cashFlows, guess);
        if (Math.abs(npv) < 1) return guess * 100;
        
        // Derivative estimation
        const npvDelta = calculateNPV(cashFlows, guess + 0.001);
        const derivative = (npvDelta - npv) / 0.001;
        
        guess = guess - npv / derivative;
    }
    return guess * 100;
};

export const calculatePayback = (cashFlows) => {
    let cumulative = 0;
    for (let i = 0; i < cashFlows.length; i++) {
        cumulative += cashFlows[i];
        if (cumulative >= 0) return i + (cumulative - cashFlows[i]) / Math.abs(cashFlows[i]); // Linear interpolation
    }
    return cashFlows.length;
};

export const generateCashFlows = (scenario, concept) => {
    // Mock cash flow generation
    const years = 20;
    const capex = parseFloat(concept.capex) || 100;
    const opex = parseFloat(concept.opex) || 10;
    const price = parseFloat(scenario.oilPrice) || 70;
    const production = parseFloat(concept.peakProduction) || 50; // kbpd
    
    const flows = [-capex]; // Year 0
    for(let i = 1; i <= years; i++) {
        // Simplified decline curve
        const yearlyProd = i < 3 ? production : production * Math.pow(0.9, i - 3);
        const revenue = yearlyProd * 365 * price / 1000; // MM$
        flows.push(revenue - opex);
    }
    return flows;
};