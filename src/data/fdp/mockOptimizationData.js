/**
 * Mock Data for Optimization Module
 */

export const mockScenarios = [
    { id: 1, name: "Base Case", npv: 245, capex: 1200 },
    { id: 2, name: "Accelerated", npv: 280, capex: 1350 },
    { id: 3, name: "Phased", npv: 210, capex: 900 }
];

export const mockOptimizationResults = {
    bestScenarioId: 2,
    uplift: 35, // $MM
    iterations: 500,
    converged: true
};