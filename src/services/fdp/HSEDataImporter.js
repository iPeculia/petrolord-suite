/**
 * HSE Data Importer
 * Simulates importing from HSE Management Systems or Excel
 */

import { createRisk, RiskTypes, RiskStatus } from '@/data/fdp/HSEModel';

export class HSEDataImporter {
    static async importFromHSESystem() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        return [
            createRisk({
                name: 'High Pressure Zone Drilling',
                type: RiskTypes.SAFETY,
                probability: 4,
                impact: 5,
                mitigation: 'Use MPD equipment, specialized crew training.',
                status: RiskStatus.MITIGATED
            }),
            createRisk({
                name: 'Chemical Spill Potential',
                type: RiskTypes.ENVIRONMENTAL,
                probability: 2,
                impact: 4,
                mitigation: 'Double containment tanks, spill response kit on site.',
                status: RiskStatus.ASSESSED
            }),
            createRisk({
                name: 'Noise Pollution for Local Village',
                type: RiskTypes.COMMUNITY,
                probability: 5,
                impact: 3,
                mitigation: 'Sound barriers, restricted operating hours for heavy machinery.',
                status: RiskStatus.IDENTIFIED
            })
        ];
    }
}