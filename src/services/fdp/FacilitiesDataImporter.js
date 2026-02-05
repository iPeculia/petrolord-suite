/**
 * Facilities Data Importer
 * Simulation of data ingestion from existing facility databases or benchmarks.
 */

export class FacilitiesDataImporter {
    static async importBenchmarks() {
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate latency

        return [
            {
                id: 'bench-001',
                name: 'FPSO - Generic Large',
                type: 'FPSO',
                nameplateCapacity: 150000,
                gasCapacity: 200,
                waterCapacity: 120000,
                capex: 1500,
                opex: 65
            },
            {
                id: 'bench-002',
                name: 'Platform - Shallow Water',
                type: 'Platform',
                nameplateCapacity: 50000,
                gasCapacity: 50,
                waterCapacity: 30000,
                capex: 600,
                opex: 25
            },
            {
                id: 'bench-003',
                name: 'Subsea Tie-back System',
                type: 'Subsea Tie-back',
                nameplateCapacity: 30000,
                gasCapacity: 20,
                waterCapacity: 10000,
                capex: 350,
                opex: 15
            }
        ];
    }
}