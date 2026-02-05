export const UNIT_SYSTEMS = {
    METRIC: {
        depth: 'm',
        pressure: 'kPa',
        density: 'kg/m3',
        velocity: 'm/s',
    },
    IMPERIAL: {
        depth: 'ft',
        pressure: 'psi',
        density: 'g/cc',
        velocity: 'ft/s',
    },
};

export const CURVE_MNEMONICS = {
    REQUIRED: ['GR', 'RHOB', 'DT'],
    OPTIONAL: ['NPHI', 'RES_DEEP', 'CALI', 'SP'],
    ALL_FOR_MAPPING: [
        { name: 'Gamma Ray', mnemonic: 'GR'},
        { name: 'Bulk Density', mnemonic: 'RHOB'},
        { name: 'Sonic Compressional', mnemonic: 'DT'},
        { name: 'Neutron Porosity', mnemonic: 'NPHI'},
        { name: 'Deep Resistivity', mnemonic: 'RES_DEEP'},
        { name: 'Caliper', mnemonic: 'CALI'},
        { name: 'Spontaneous Potential', mnemonic: 'SP' },
    ]
};

export const CURVE_ALIASES = {
    GR: ['GR', 'CGR', 'GR_EDTC', 'GAMMA RAY', 'GR CORR', 'SGR', 'KGR', 'GRC'],
    RHOB: ['RHOB', 'RHOZ', 'DEN', 'DENSITY', 'BULK DENSITY', 'ZDEN', 'DENS'],
    DT: ['DT', 'DTC', 'DTCO', 'AC', 'SONIC', 'COMPRESSIONAL', 'DTSM', 'DT24'],
    NPHI: ['NPHI', 'NPOR', 'TNPH', 'NEUT', 'NEUTRON', 'NP', 'PHIN'],
    RES_DEEP: ['AT90', 'RT', 'ILD', 'HRLD', 'DEEP RES', 'AIT90', 'RES-DEEP', 'RILD'],
    CALI: ['CALI', 'C1', 'HCAL', 'CALIPER', 'CAL', 'CAL1'],
    SP: ['SP', 'SP_LOG', 'SPONTANEOUS POTENTIAL'],
};

export const CURVE_UNITS = {
    GR: ['GAPI', 'API'],
    RHOB: ['G/CC', 'K/M3', 'G/CM3'],
    DT: ['US/F', 'US/M', 'US/FT'],
    NPHI: ['V/V', 'PU', '%', 'DEC'],
    RES_DEEP: ['OHMM'],
    CALI: ['IN', 'CM'],
    SP: ['MV'],
};


export const DEFAULT_PARAMS = {
    PORE_PRESSURE: {
        method: 'EATON',
        eatonExponent: 3.0,
        nctTrendline: { a: 0.008, b: 120 },
    },
    STRESS: {
        poissonsRatio: 0.25,
        biotCoefficient: 0.8,
    },
};

export const ERROR_MESSAGES = {
    FILE_PARSE_ERROR: 'Failed to parse the uploaded file. Please check the format.',
    MISSING_CURVES: 'One or more required curves are missing from the input data.',
    CALCULATION_FAILED: 'The calculation could not be completed. Please check your inputs.',
};