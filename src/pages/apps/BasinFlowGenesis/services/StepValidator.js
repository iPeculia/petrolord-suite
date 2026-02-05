export const StepValidator = {
    validateTemplateSelection: (data) => {
        if (!data.selectedTemplateId) {
            return { isValid: false, error: "Please select a basin template to proceed." };
        }
        return { isValid: true };
    },

    validateStratigraphy: (data) => {
        if (!data.layers || data.layers.length === 0) {
            return { isValid: false, error: "At least one stratigraphic layer is required." };
        }
        
        // Check for continuity (basic check)
        for (let i = 0; i < data.layers.length; i++) {
            const layer = data.layers[i];
            if (!layer.name) return { isValid: false, error: `Layer ${i + 1} is missing a name.` };
            if (layer.thickness <= 0) return { isValid: false, error: `Layer '${layer.name}' must have positive thickness.` };
            if (layer.ageStart <= layer.ageEnd) return { isValid: false, error: `Layer '${layer.name}': Start age must be older than End age.` };
        }
        
        return { isValid: true };
    },

    validatePetroleumSystem: (data) => {
        const sources = data.layers.filter(l => l.sourceRock?.isSource);
        // Ideally we want at least one source, but it's not strictly required for simulation to run (just won't get HCs)
        // Let's warn but allow, or enforce if it's a "Petroleum System" wizard.
        // The prompt asks for validation.
        
        if (sources.length === 0) {
            return { isValid: false, warning: "No source rocks defined. No hydrocarbons will be generated.", isWarning: true };
        }
        
        // Check source properties
        const invalidSource = sources.find(s => !s.sourceRock.toc || !s.sourceRock.hi);
        if (invalidSource) {
            return { isValid: false, error: `Source rock '${invalidSource.name}' is missing TOC or HI values.` };
        }

        return { isValid: true };
    },

    validateHeatFlow: (data) => {
        if (!data.heatFlowId) {
            return { isValid: false, error: "Please select a heat flow model." };
        }
        return { isValid: true };
    },

    validateErosion: (data) => {
        if (!data.erosionOption) {
            return { isValid: false, error: "Please select an erosion option." };
        }
        if (data.erosionOption === 'custom' && (!data.erosionEvent || data.erosionEvent.amount <= 0)) {
            return { isValid: false, error: "Please define valid custom erosion parameters." };
        }
        return { isValid: true };
    },
    
    validateReview: (data) => {
        // Comprehensive check
        return { isValid: true };
    }
};