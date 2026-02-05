function triangular(p10, p50, p90) {
    const rand = Math.random();
    const f = (p90 - p10) > 0 ? (p50 - p10) / (p90 - p10) : 0.5;
    if (rand < f) {
        return p10 + Math.sqrt(rand * (p90 - p10) * (p50 - p10));
    } else {
        return p90 - Math.sqrt((1 - rand) * (p90 - p10) * (p90 - p50));
    }
}

function calculateNPV(price, productionData, capex, opex, discountRate, royaltyRate, taxRate) {
    let npv = -capex;
    const dr = discountRate / 100;
    const rr = royaltyRate / 100;
    const tr = taxRate / 100;

    const firstYear = productionData.length > 0 ? productionData[0].year : new Date().getFullYear();

    productionData.forEach(row => {
        const yearIndex = row.year - firstYear;
        const production = row.oil_production_bbl;
        
        const revenue = production * price;
        const royalty = revenue * rr;
        const netRevenue = revenue - royalty;
        const profitBeforeTax = netRevenue - opex;
        const tax = profitBeforeTax > 0 ? profitBeforeTax * tr : 0;
        const cashFlow = profitBeforeTax - tax;
        
        const discountedCF = cashFlow / Math.pow(1 + dr, yearIndex + 1);
        npv += discountedCF;
    });

    return npv / 1e6; // Return NPV in $MM
}

function findBreakevenPrice(productionData, capex, opex, discountRate, royaltyRate, taxRate, targetNpv) {
    let low = 0;
    let high = 200;
    let mid;
    let npv;

    for (let i = 0; i < 50; i++) { // 50 iterations for precision
        mid = (low + high) / 2;
        npv = calculateNPV(mid, productionData, capex, opex, discountRate, royaltyRate, taxRate);
        if (npv > targetNpv) {
            high = mid;
        } else {
            low = mid;
        }
    }
    return mid;
}

export const generateBreakevenData = (inputs) => {
    const { iterations, variables, productionData, discountRate, royaltyRate, taxRate, targetNpv } = inputs;
    
    if (!productionData || !productionData.data || productionData.data.length === 0) {
        throw new Error("Production data is missing or invalid.");
    }

    const results = [];
    const getVar = (name) => variables.find(v => v.name.includes(name));

    const capexVar = getVar('CAPEX');
    const opexVar = getVar('OPEX');
    const efficiencyVar = getVar('Production Efficiency');

    for (let i = 0; i < iterations; i++) {
        const capex = triangular(capexVar.p10, capexVar.p50, capexVar.p90) * 1e6; // to dollars
        const opex = triangular(opexVar.p10, opexVar.p50, opexVar.p90) * 1e6; // to dollars
        const efficiency = triangular(efficiencyVar.p10, efficiencyVar.p50, efficiencyVar.p90) / 100;

        const adjustedProductionData = productionData.data.map(row => ({
            ...row,
            oil_production_bbl: row.oil_production_bbl * efficiency
        }));

        const breakevenPrice = findBreakevenPrice(adjustedProductionData, capex, opex, discountRate, royaltyRate, taxRate, targetNpv);
        results.push(breakevenPrice);
    }

    results.sort((a, b) => a - b);

    const p10 = results[Math.floor(iterations * 0.1)];
    const p50 = results[Math.floor(iterations * 0.5)];
    const p90 = results[Math.floor(iterations * 0.9)];
    const mean = results.reduce((a, b) => a + b, 0) / iterations;

    const kpis = { p10, p50, p90, mean };

    // Sensitivity Analysis for Tornado Chart
    const baseCapex = capexVar.p50 * 1e6;
    const baseOpex = opexVar.p50 * 1e6;
    const baseEfficiency = efficiencyVar.p50 / 100;
    const baseProdData = productionData.data.map(r => ({...r, oil_production_bbl: r.oil_production_bbl * baseEfficiency}));
    const baseBreakeven = findBreakevenPrice(baseProdData, baseCapex, baseOpex, discountRate, royaltyRate, taxRate, targetNpv);
    
    const sensitivityData = [];
    
    // CAPEX Sensitivity
    const capexLowBE = findBreakevenPrice(baseProdData, capexVar.p10 * 1e6, baseOpex, discountRate, royaltyRate, taxRate, targetNpv);
    const capexHighBE = findBreakevenPrice(baseProdData, capexVar.p90 * 1e6, baseOpex, discountRate, royaltyRate, taxRate, targetNpv);
    sensitivityData.push({ name: 'Total CAPEX', low: capexLowBE, high: capexHighBE, swing: Math.abs(capexHighBE - capexLowBE) });

    // OPEX Sensitivity
    const opexLowBE = findBreakevenPrice(baseProdData, baseCapex, opexVar.p10 * 1e6, discountRate, royaltyRate, taxRate, targetNpv);
    const opexHighBE = findBreakevenPrice(baseProdData, baseCapex, opexVar.p90 * 1e6, discountRate, royaltyRate, taxRate, targetNpv);
    sensitivityData.push({ name: 'Annual OPEX', low: opexLowBE, high: opexHighBE, swing: Math.abs(opexHighBE - opexLowBE) });
    
    // Production Efficiency Sensitivity
    const effLowProdData = productionData.data.map(r => ({...r, oil_production_bbl: r.oil_production_bbl * (efficiencyVar.p10 / 100)}));
    const effHighProdData = productionData.data.map(r => ({...r, oil_production_bbl: r.oil_production_bbl * (efficiencyVar.p90 / 100)}));
    const effLowBE = findBreakevenPrice(effLowProdData, baseCapex, baseOpex, discountRate, royaltyRate, taxRate, targetNpv);
    const effHighBE = findBreakevenPrice(effHighProdData, baseCapex, baseOpex, discountRate, royaltyRate, taxRate, targetNpv);
    sensitivityData.push({ name: 'Prod. Efficiency', low: effHighBE, high: effLowBE, swing: Math.abs(effLowBE - effHighBE) });

    sensitivityData.sort((a, b) => b.swing - a.swing);

    const tornadoData = {
        y: sensitivityData.map(d => d.name),
        x: sensitivityData.map(d => d.high - baseBreakeven),
        base: sensitivityData.map(d => baseBreakeven),
    };
    
    const plotData = {
        cdf: { x: results, y: results.map((_, i) => (i + 1) / iterations) },
        histogram: { x: results },
    };

    const topSensitivities = sensitivityData.slice(0, 2).map(d => d.name).join(' and ');
    const insights = `The project's P50 breakeven oil price is ${p50.toFixed(2)}/STB, with a 90% probability of being below ${p90.toFixed(2)}/STB. The most impactful uncertainties on breakeven are ${topSensitivities}.`;

    return {
        kpis,
        plotData,
        tornadoData,
        insights,
    };
};