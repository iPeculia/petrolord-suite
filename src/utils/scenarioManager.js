import { v4 as uuidv4 } from 'uuid';

export const createScenario = (name, params, description = '') => {
    return {
        id: uuidv4(),
        name,
        description,
        params: { ...params },
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
    };
};

export const saveScenariosToStorage = (scenarios) => {
    localStorage.setItem('ppfg_scenarios', JSON.stringify(scenarios));
};

export const loadScenariosFromStorage = () => {
    const saved = localStorage.getItem('ppfg_scenarios');
    return saved ? JSON.parse(saved) : [];
};

export const compareScenarios = (scenarioA, scenarioB, inputs, engine) => {
    const resA = engine(inputs, scenarioA.params);
    const resB = engine(inputs, scenarioB.params);
    
    // Calculate difference
    const diffPP = resA.pp.map((v, i) => v - resB.pp[i]);
    
    return {
        resA,
        resB,
        diffPP
    };
};