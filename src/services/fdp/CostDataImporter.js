/**
 * Cost Data Importer
 * Handles ingestion of cost data from AFE, ERP, or Excel sources.
 */

export class CostDataImporter {
    static async importFromAFE() {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency

        return [
            { id: 'afe-001', name: 'Mob/Demob', category: 'Drilling', type: 'CAPEX', amount: 2.5, phase: 'Mobilization', unit: 'Lump Sum' },
            { id: 'afe-002', name: 'Rig Daily Rate (30d)', category: 'Drilling', type: 'CAPEX', amount: 7.5, phase: 'Execution', unit: 'Day Rate' },
            { id: 'afe-003', name: 'Tangibles (Casing)', category: 'Drilling', type: 'CAPEX', amount: 3.2, phase: 'Execution', unit: 'Lump Sum' },
            { id: 'afe-004', name: 'Cementing Services', category: 'Drilling', type: 'CAPEX', amount: 1.1, phase: 'Execution', unit: 'Service' },
            { id: 'afe-005', name: 'Logistics & Support', category: 'Support', type: 'OPEX', amount: 0.5, phase: 'Execution', unit: 'Monthly' }
        ];
    }

    static async importFromProjectManagement() {
        await new Promise(resolve => setTimeout(resolve, 800));

        return [
            { id: 'pm-001', name: 'EPC Contract - Topsides', category: 'Fabrication', type: 'CAPEX', amount: 450, phase: 'Construction', unit: 'Contract' },
            { id: 'pm-002', name: 'Subsea Umbilicals', category: 'Installation', type: 'CAPEX', amount: 85, phase: 'Installation', unit: 'Lump Sum' },
            { id: 'pm-003', name: 'PMT Team', category: 'Management', type: 'CAPEX', amount: 25, phase: 'All', unit: 'Yearly' }
        ];
    }
}