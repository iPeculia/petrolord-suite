import { DistributionManager } from './DistributionManager';
import * as ss from 'simple-statistics';

export class MonteCarloEngine {
    
    static async runSimulation(config, inputs, onProgress) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const iterations = config.iterations || 1000;
                    const results = {
                        stooip: [],
                        giip: [],
                        grv: [],
                        samples: [] // Optional: store all sampled inputs for sensitivity
                    };

                    const isField = config.unitSystem === 'field';
                    const oilFactor = isField ? 7758 : 1000000; // STB vs sm3 (simple metric assumption)
                    const gasFactor = isField ? 43560 : 1000000;

                    for (let i = 0; i < iterations; i++) {
                        // Sample Inputs
                        const area = DistributionManager.sample(inputs.area);
                        const thickness = DistributionManager.sample(inputs.thickness);
                        const ntg = DistributionManager.sample(inputs.ntg);
                        const phi = DistributionManager.sample(inputs.porosity);
                        const sw = DistributionManager.sample(inputs.sw);
                        const fvf = DistributionManager.sample(inputs.fvf);
                        const bg = DistributionManager.sample(inputs.bg);
                        // Optional recoveries
                        const recOil = inputs.recovery ? DistributionManager.sample(inputs.recovery) : 0;
                        const recGas = inputs.recoveryGas ? DistributionManager.sample(inputs.recoveryGas) : 0;

                        // Calculate Volumes
                        const grv = area * thickness;
                        const poreVol = grv * ntg * phi;
                        const hcpv = poreVol * (1 - sw);

                        let stooip = 0;
                        let giip = 0;

                        if (config.fluidType === 'oil' || config.fluidType === 'oil_gas') {
                            stooip = (hcpv * oilFactor) / fvf;
                        }
                        
                        if (config.fluidType === 'gas' || config.fluidType === 'oil_gas') {
                            giip = (hcpv * gasFactor) / bg;
                        }

                        results.stooip.push(stooip);
                        results.giip.push(giip);
                        results.grv.push(grv);
                        
                        // Store subset of samples for sensitivity analysis (e.g. first 5000 or all if small)
                        if (iterations <= 5000 || i % 5 === 0) {
                            results.samples.push({
                                area, thickness, ntg, phi, sw, fvf, stooip, giip
                            });
                        }

                        // Progress Update
                        if (i % 500 === 0 && onProgress) {
                            onProgress((i / iterations) * 100);
                        }
                    }

                    // Calculate Stats
                    const stats = {
                        stooip: this.calculateStats(results.stooip),
                        giip: this.calculateStats(results.giip),
                        sensitivity: this.calculateSensitivity(results.samples)
                    };

                    resolve({ raw: results, stats });

                } catch (e) {
                    reject(e);
                }
            }, 10);
        });
    }

    static calculateStats(data) {
        if (!data || data.length === 0) return {};
        const validData = data.filter(n => !isNaN(n) && isFinite(n));
        if (validData.length === 0) return {};

        validData.sort((a, b) => a - b);
        
        const getPercentile = (p) => {
            const idx = Math.floor(p * validData.length);
            return validData[Math.min(idx, validData.length - 1)];
        };

        // Calculate CDF Points for Plotting
        const cdfPoints = [];
        const step = Math.max(1, Math.floor(validData.length / 100));
        for(let i=0; i<validData.length; i+=step) {
            cdfPoints.push({
                x: validData[i],
                y: (i / validData.length) * 100
            });
        }
        cdfPoints.push({ x: validData[validData.length-1], y: 100 });

        return {
            p90: getPercentile(0.1), // P90 is smaller value (90% prob of exceeding)
            p50: getPercentile(0.5),
            p10: getPercentile(0.9), // P10 is larger value
            mean: ss.mean(validData),
            min: validData[0],
            max: validData[validData.length - 1],
            stdDev: ss.standardDeviation(validData),
            histogram: this.generateHistogram(validData),
            cdf: cdfPoints
        };
    }

    static generateHistogram(data, bins = 20) {
        const min = data[0];
        const max = data[data.length - 1];
        const range = max - min;
        if (range === 0) return [{ x: min, y: data.length }];

        const step = range / bins;
        const hist = new Array(bins).fill(0);
        
        data.forEach(val => {
            const idx = Math.min(Math.floor((val - min) / step), bins - 1);
            hist[idx]++;
        });

        return hist.map((count, i) => ({
            x0: min + i * step,
            x1: min + (i + 1) * step,
            count
        }));
    }

    static calculateSensitivity(samples) {
        // Basic rank correlation
        if (!samples || samples.length === 0) return [];

        const parameters = ['area', 'thickness', 'ntg', 'phi', 'sw', 'fvf'];
        const results = [];

        const outputs = samples.map(s => s.stooip); // Target variable

        parameters.forEach(param => {
            const inputs = samples.map(s => s[param]);
            // Simple correlation coefficient (Pearson)
            // Handle edge case where stdDev is 0 (constant input)
            let correlation = 0;
            try {
                if (ss.standardDeviation(inputs) > 0 && ss.standardDeviation(outputs) > 0) {
                     correlation = ss.sampleCorrelation(inputs, outputs);
                }
            } catch (e) {
                correlation = 0;
            }
            
            // To draw tornado, we need "Low" and "High" output values corresponding to Low/High input
            // We approximate this by taking P10 and P90 of input and finding expected output
            // Or simply map impact score for visualization
            
            // Simplified Tornado Construction for UI:
            // We will simulate a "Swing": output range attributable to this variable
            const stdDevInput = ss.standardDeviation(inputs);
            const slope = correlation * (ss.standardDeviation(outputs) / (stdDevInput || 1));
            
            // Base Case (Mean)
            const meanOutput = ss.mean(outputs);
            
            // Swing +/- 2 sigma (approx P10/P90 range for normal)
            const swingLow = meanOutput - 2 * slope * stdDevInput;
            const swingHigh = meanOutput + 2 * slope * stdDevInput;
            
            results.push({
                parameter: param,
                correlation: correlation || 0,
                baseValue: meanOutput,
                lowValue: Math.min(swingLow, swingHigh), // Ensure low is lower
                highValue: Math.max(swingLow, swingHigh),
                swing: Math.abs(swingHigh - swingLow)
            });
        });

        return results.sort((a, b) => b.swing - a.swing);
    }
}