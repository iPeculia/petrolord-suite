import { SimulationEngine } from './SimulationEngine';

export class BatchEngine {
    /**
     * Run batch simulation on a list of wells
     * @param {Array} wells - List of well objects with stratigraphy
     * @param {Function} onProgress - Callback (completedCount, total, currentWellName)
     */
    static async runBatch(wells, onProgress) {
        const results = [];
        let completed = 0;

        for (const well of wells) {
            try {
                // Ensure minimum data exists
                if (!well.stratigraphy || well.stratigraphy.length === 0) {
                    results.push({ wellId: well.id, status: 'skipped', error: 'No stratigraphy' });
                    continue;
                }

                // Prepare input (similar to standard run)
                // Assuming well object structure matches context state
                const simInput = {
                    stratigraphy: well.stratigraphy,
                    heatFlow: well.heatFlow || well.heat_flow || { type: 'constant', value: 60 }
                };

                if (onProgress) onProgress(completed, wells.length, well.name);

                // Run Simulation (Silent mode)
                const simResult = await SimulationEngine.run(simInput);
                
                results.push({ 
                    wellId: well.id, 
                    status: 'success', 
                    data: simResult,
                    maxRo: Math.max(...(simResult.data.maturity.flat().map(m => m.value) || [0])),
                    maxTemp: Math.max(...(simResult.data.temperature.flat().map(m => m.value) || [0]))
                });

            } catch (e) {
                console.error(`Batch error for ${well.name}:`, e);
                results.push({ wellId: well.id, status: 'failed', error: e.message });
            }
            
            completed++;
            if (onProgress) onProgress(completed, wells.length, null);
        }

        return results;
    }
}