// Simplified simulation of fiscal regime comparisons.
// This is a placeholder for a complex backend economics engine.

const PROJECT_LIFE = 20; // years

const generateProductionProfile = (initialOil, declineRate) => {
    const profile = [];
    let currentRate = initialOil;
    for (let year = 1; year <= PROJECT_LIFE; year++) {
        const annualProduction = currentRate * 365;
        profile.push({ year, oil: annualProduction });
        currentRate *= (1 - declineRate / 100);
    }
    return profile;
};

const calculateCashFlowForRegime = (regime, project) => {
    const production = generateProductionProfile(project.initialOil, project.declineRate);
    const annualCashFlows = [];
    let cumulativeCostPool = project.capex;

    for (let year = 1; year <= PROJECT_LIFE; year++) {
        const prodThisYear = production.find(p => p.year === year)?.oil || 0;
        
        const grossRevenue = (prodThisYear * project.oilPrice) / 1e6; // in $MM
        const opex = (prodThisYear * project.opex) / 1e6; // in $MM
        const capex = (year === 1) ? project.capex : 0; // Simplified: all CAPEX in year 1

        const royalty = grossRevenue * (regime.royalty / 100);
        
        const revenueAfterRoyalty = grossRevenue - royalty;
        
        const costRecoveryAllowed = revenueAfterRoyalty * (regime.costRecoveryLimit / 100);
        const costRecovered = Math.min(cumulativeCostPool, costRecoveryAllowed);
        cumulativeCostPool -= costRecovered;
        
        const profitOil = revenueAfterRoyalty - costRecovered;
        
        const contractorProfitShare = profitOil * (regime.profitSplit / 100);
        const governmentProfitShare = profitOil * (1 - regime.profitSplit / 100);
        
        const taxableIncome = contractorProfitShare - (opex / 2); // Simplified deductions
        const tax = taxableIncome > 0 ? taxableIncome * (regime.tax / 100) : 0;

        const contractorNCF = contractorProfitShare - tax - opex - capex;
        const governmentTake = royalty + governmentProfitShare + tax;

        annualCashFlows.push({
            year,
            contractorNCF,
            governmentTake,
        });
    }
    return annualCashFlows;
};

const calculateNPV = (cashFlows, discountRate) => {
    return cashFlows.reduce((npv, cf) => {
        return npv + cf.contractorNCF / Math.pow(1 + discountRate / 100, cf.year);
    }, 0);
};

export const runFiscalComparison = async (inputs) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { projectInputs, regimes } = inputs;
    const summary = [];
    const annualCashFlows = [];

    regimes.forEach(regime => {
        const cashflows = calculateCashFlowForRegime(regime, projectInputs);
        annualCashFlows.push({ regimeId: regime.id, data: cashflows });

        const contractorNPV = calculateNPV(cashflows, projectInputs.discountRate);
        const totalGovTake = cashflows.reduce((sum, cf) => sum + cf.governmentTake, 0);
        const totalContractorTake = cashflows.reduce((sum, cf) => sum + cf.contractorNCF, 0) + projectInputs.capex;
        const totalProfit = totalGovTake + totalContractorTake;
        const effectiveTaxRate = totalProfit > 0 ? (totalGovTake / totalProfit) * 100 : 0;
        
        summary.push({
            id: regime.id,
            name: regime.name,
            npv: contractorNPV,
            govTake: totalGovTake,
            effectiveTaxRate: effectiveTaxRate
        });
    });

    // Sort by contractor NPV desc
    summary.sort((a,b) => b.npv - a.npv);

    return {
        summary,
        annualCashFlows,
    };
};