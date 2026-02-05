import { HeatFlowPresets } from '../data/HeatFlowPresets';
import { ErosionPresets } from '../data/ErosionPresets';

export const WizardDataConverter = {
    convertWizardDataToSimulationInput: (wizardData) => {
        // 1. Layers (Stratigraphy)
        // Ensure structure matches SimulationEngine expectation
        const layers = wizardData.layers.map(l => ({
            id: l.id,
            name: l.name,
            thickness: parseFloat(l.thickness),
            lithology: l.lithology,
            ageStart: parseFloat(l.ageStart),
            ageEnd: parseFloat(l.ageEnd),
            color: l.color,
            sourceRock: l.sourceRock?.isSource ? {
                isSource: true,
                toc: parseFloat(l.sourceRock.toc),
                hi: parseFloat(l.sourceRock.hi),
                kerogen: l.sourceRock.kerogen
            } : null
        }));

        // 2. Heat Flow
        const hfPreset = HeatFlowPresets.find(p => p.id === wizardData.heatFlowId);
        let heatFlow = { type: 'constant', value: 60 };
        
        if (hfPreset) {
            if (hfPreset.type === 'constant') {
                heatFlow = { type: 'constant', value: hfPreset.value };
            } else {
                heatFlow = { type: 'variable', history: hfPreset.history };
            }
        }
        
        // 3. Erosion
        // Simulation engine might expect erosion events separately or integrated into burial history
        // For Genesis Phase 4, we pass it as metadata or simple event list
        let erosionEvents = [];
        if (wizardData.erosionOption === 'custom' && wizardData.erosionEvent) {
            erosionEvents = [wizardData.erosionEvent];
        } else {
            const erosionPreset = ErosionPresets.find(p => p.id === wizardData.erosionOption);
            if (erosionPreset) {
                erosionEvents = erosionPreset.events;
            }
        }

        return {
            stratigraphy: layers,
            heatFlow: heatFlow,
            erosionEvents: erosionEvents,
            settings: {
                surfaceTemp: 20, // Default
                waterDepth: 0    // Default
            }
        };
    }
};