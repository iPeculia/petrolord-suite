/**
 * Optimization Calculations
 * Helper functions for objective evaluation and constraint checking.
 */

export const calculateNPVObjective = (vars, parameters) => {
    // vars: { productionRate, oilPrice, opex, capex }
    // NPV = sum( (Revenue - Cost) / (1+r)^t )
    // Simplified single period model for optimization loop speed
    const revenue = vars.productionRate * 365 * parameters.oilPrice;
    const cost = vars.capex + (vars.opex * 20); // 20 years
    return revenue - cost; 
};

export const checkConstraints = (solution, constraints) => {
    const violations = [];
    if (constraints.maxCapex && solution.capex > constraints.maxCapex) {
        violations.push(`CAPEX exceeds limit of ${constraints.maxCapex}`);
    }
    if (constraints.minPlateau && solution.plateauRate < constraints.minPlateau) {
        violations.push(`Production plateau below target of ${constraints.minPlateau}`);
    }
    return {
        isFeasible: violations.length === 0,
        violations
    };
};

export const calculateEfficientFrontier = (scenarios) => {
    // Filter scenarios that are dominated (higher risk for same return, or lower return for same risk)
    // Assuming x=Risk, y=Return
    // Sort by Risk
    const sorted = [...scenarios].sort((a, b) => a.risk - b.risk);
    const frontier = [];
    
    let maxReturn = -Infinity;
    
    sorted.forEach(s => {
        if (s.return > maxReturn) {
            frontier.push(s);
            maxReturn = s.return;
        }
    });
    
    return frontier;
};