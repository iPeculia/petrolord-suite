import { useState, useEffect, useCallback } from 'react';
import { BASIN_PRESETS, VARIANT_MODIFIERS } from '@/utils/parameterPresets';
import { createScenario, loadScenariosFromStorage, saveScenariosToStorage } from '@/utils/scenarioManager';
import { calculateRealTime } from '@/utils/realTimeCalculationEngine';

export const usePhase3State = (initialData) => {
    // initialData contains logs: depths, gr, res, dt...
    
    const [params, setParams] = useState(BASIN_PRESETS.NIGER_DELTA.params);
    const [mode, setMode] = useState('guided'); // guided | expert
    const [scenarios, setScenarios] = useState([]);
    const [activeScenarioId, setActiveScenarioId] = useState('base');
    const [history, setHistory] = useState([]);
    const [results, setResults] = useState(null);
    const [comparisonResult, setComparisonResult] = useState(null);

    // Initialize
    useEffect(() => {
        const saved = loadScenariosFromStorage();
        if (saved.length === 0) {
            const base = createScenario('Base Case', BASIN_PRESETS.NIGER_DELTA.params, 'Default Niger Delta parameters');
            setScenarios([base]);
            setActiveScenarioId(base.id);
        } else {
            setScenarios(saved);
            setActiveScenarioId(saved[0].id);
            setParams(saved[0].params);
        }
    }, []);

    // Recalculate when params change
    useEffect(() => {
        if (initialData && initialData.depths) {
            const res = calculateRealTime(initialData, params);
            setResults(res);
        }
    }, [params, initialData]);

    const updateParam = (key, value) => {
        setParams(prev => {
            const next = { ...prev, [key]: value };
            // Add to history (debounce this in real app)
            setHistory(h => [...h.slice(-19), { timestamp: new Date(), params: next, change: `${key} to ${value}` }]);
            return next;
        });
    };

    const applyPreset = (basinKey, variant = 'BASE') => {
        const base = BASIN_PRESETS[basinKey].params;
        const mod = VARIANT_MODIFIERS[variant];
        
        const newParams = { ...base };
        // Apply modifiers
        Object.keys(mod).forEach(k => {
            if (typeof mod[k] === 'number' && newParams[k]) {
                newParams[k] *= mod[k];
            }
        });
        setParams(newParams);
    };

    const saveCurrentAsScenario = (name) => {
        const newScenario = createScenario(name, params);
        const updated = [...scenarios, newScenario];
        setScenarios(updated);
        saveScenariosToStorage(updated);
        setActiveScenarioId(newScenario.id);
    };

    return {
        params,
        updateParam,
        mode,
        setMode,
        scenarios,
        activeScenarioId,
        setActiveScenarioId,
        applyPreset,
        saveCurrentAsScenario,
        results,
        history
    };
};