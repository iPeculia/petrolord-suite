/**
 * Cost & Economics Calculations Utility
 * Handles aggregation of costs and calculation of economic indicators (NPV, IRR, etc.)
 */

export const calculateTotalCAPEX = (costItems) => {
    if (!costItems) return 0;
    return costItems
        .filter(item => item.type === 'CAPEX')
        .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
};

export const calculateTotalOPEX = (costItems) => {
    if (!costItems) return 0;
    return costItems
        .filter(item => item.type === 'OPEX')
        .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
};

export const calculateCostByPhase = (costItems) => {
    const phases = {};
    costItems.forEach(item => {
        const phase = item.phase || 'Unassigned';
        if (!phases[phase]) phases[phase] = 0;
        phases[phase] += (parseFloat(item.amount) || 0);
    });
    return phases;
};

export const calculateCashFlows = (capex, annualOpex, productionProfile, priceDeck, discountRate = 0.10) => {
    const cashFlows = [];
    const years = Math.max(productionProfile.length, priceDeck.length, 20);
    let cumulativeCashFlow = 0;

    // Year 0 (Development)
    const year0CashFlow = -capex;
    cumulativeCashFlow += year0CashFlow;
    cashFlows.push({
        year: 0,
        revenue: 0,
        capex: capex,
        opex: 0,
        netCashFlow: year0CashFlow,
        cumulativeCashFlow: cumulativeCashFlow,
        discountedCashFlow: year0CashFlow // Year 0 not discounted or factor 1
    });

    // Production Years
    for (let i = 1; i <= years; i++) {
        const prod = productionProfile[i-1] || 0; // volume
        const price = priceDeck[i-1]?.oil_price_usd || 70; // $/unit
        const revenue = prod * price * 365 / 1000; // Assuming prod is daily kbbl, resulting in MM$
        
        // Simple Opex Model: Fixed + Variable
        const variableOpex = prod * 5 * 365 / 1000; // $5/bbl variable
        const totalOpex = annualOpex + variableOpex;

        const netCashFlow = revenue - totalOpex;
        const discountedCashFlow = netCashFlow / Math.pow(1 + discountRate, i);
        
        cumulativeCashFlow += netCashFlow;

        cashFlows.push({
            year: i,
            revenue,
            capex: 0,
            opex: totalOpex,
            netCashFlow,
            cumulativeCashFlow,
            discountedCashFlow
        });
    }

    return cashFlows;
};

export const calculateNPV = (cashFlows) => {
    return cashFlows.reduce((sum, cf) => sum + cf.discountedCashFlow, 0);
};

export const calculateIRR = (cashFlows) => {
    const flows = cashFlows.map(cf => cf.netCashFlow);
    let guess = 0.1;
    
    for (let i = 0; i < 50; i++) {
        let npv = 0;
        let d_npv = 0;
        
        for (let t = 0; t < flows.length; t++) {
            npv += flows[t] / Math.pow(1 + guess, t);
            d_npv -= t * flows[t] / Math.pow(1 + guess, t + 1);
        }
        
        if (Math.abs(npv) < 0.0001) return guess * 100;
        
        const newGuess = guess - npv / d_npv;
        if (Math.abs(newGuess - guess) < 0.00001) return newGuess * 100;
        
        guess = newGuess;
    }
    
    return guess * 100;
};

export const calculatePaybackPeriod = (cashFlows) => {
    for (let i = 0; i < cashFlows.length; i++) {
        if (cashFlows[i].cumulativeCashFlow >= 0) {
            // Interpolate
            if (i === 0) return 0;
            const prevCum = cashFlows[i-1].cumulativeCashFlow;
            const currFlow = cashFlows[i].netCashFlow;
            return (i - 1) + (Math.abs(prevCum) / currFlow);
        }
    }
    return null; // Never pays back within timeframe
};