/**
 * Testing Utilities for Casing Wear Analyzer
 */

import { calculateWearVolume, calculateSafetyFactor, calculateBurstCapacity } from './wearCalculations';

export const runUnitTests = () => {
    const results = [];

    // Test 1: Wear Volume
    const vol = calculateWearVolume(1.0, 10.0, 100.0);
    results.push({
        test: 'Wear Volume Calculation',
        expected: 1000.0,
        actual: vol,
        passed: Math.abs(vol - 1000.0) < 0.001
    });

    // Test 2: Safety Factor
    const sf = calculateSafetyFactor(5000, 2000);
    results.push({
        test: 'Safety Factor Calculation',
        expected: 2.5,
        actual: sf,
        passed: Math.abs(sf - 2.5) < 0.001
    });

    // Test 3: Burst Capacity (Barlow approx linear scaling)
    // Original 5000 psi, half wall thickness -> expect 2500 psi
    const burst = calculateBurstCapacity(5000, 5.0, 10.0);
    results.push({
        test: 'Burst Capacity Recalculation',
        expected: 2500.0,
        actual: burst,
        passed: Math.abs(burst - 2500.0) < 0.001
    });

    return results;
};

export const generateTestReport = () => {
    const results = runUnitTests();
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    
    return {
        summary: `Passed ${passed}/${total} tests.`,
        details: results
    };
};