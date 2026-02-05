/**
 * FDP Document Model
 * Structure for the final Field Development Plan document.
 */

export const FDPSections = {
    EXECUTIVE_SUMMARY: 'Executive Summary',
    FIELD_OVERVIEW: 'Field Overview',
    SUBSURFACE: 'Subsurface Analysis',
    CONCEPTS: 'Development Concepts',
    WELLS: 'Well Strategy',
    FACILITIES: 'Facilities & Infrastructure',
    SCHEDULE: 'Project Schedule',
    COSTS: 'Cost & Economics',
    HSE: 'HSE & Community',
    RISKS: 'Risk Management',
    APPENDICES: 'Appendices'
};

export const createFDPDocument = (data = {}) => ({
    id: data.id || `fdp-${Date.now()}`,
    meta: {
        title: data.title || 'Field Development Plan',
        version: data.version || '1.0.0',
        status: data.status || 'Draft',
        author: data.author || 'User',
        createdDate: data.createdDate || new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        project: data.project || 'Unknown Project'
    },
    sections: {
        [FDPSections.EXECUTIVE_SUMMARY]: { enabled: true, content: '', status: 'Incomplete' },
        [FDPSections.FIELD_OVERVIEW]: { enabled: true, content: '', status: 'Pending' },
        [FDPSections.SUBSURFACE]: { enabled: true, content: '', status: 'Pending' },
        [FDPSections.CONCEPTS]: { enabled: true, content: '', status: 'Pending' },
        [FDPSections.WELLS]: { enabled: true, content: '', status: 'Pending' },
        [FDPSections.FACILITIES]: { enabled: true, content: '', status: 'Pending' },
        [FDPSections.SCHEDULE]: { enabled: true, content: '', status: 'Pending' },
        [FDPSections.COSTS]: { enabled: true, content: '', status: 'Pending' },
        [FDPSections.HSE]: { enabled: true, content: '', status: 'Pending' },
        [FDPSections.RISKS]: { enabled: true, content: '', status: 'Pending' }
    },
    validation: {
        isValid: false,
        errors: [],
        warnings: []
    }
});