import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { VolumeCalculationEngine } from '../services/VolumeCalculationEngine';

// Initial State
const initialState = {
    project: {
        name: "Untitled Project",
        id: null,
        created_at: null
    },
    currentProjectMeta: {
        name: "",
        description: ""
    },
    reservoirName: "",
    // Core settings
    unitSystem: 'field', // 'field' (ft) or 'metric' (m)
    calcMethod: 'deterministic', // 'deterministic' or 'probabilistic'
    inputMethod: 'simple', // 'simple', 'hybrid', 'surfaces'
    
    // Inputs dictionary
    inputs: {
        fluidType: 'oil', 
        topSurfaceId: null,
        baseSurfaceId: null,
        area: 5000,
        thickness: 50,
        ntg: 1.0,
        porosity: 0.20,
        sw: 0.30,
        fvf: 1.2,
        bg: 0.005,
        recovery: 25,
        recoveryGas: 70,
        pressure: 3500,
        temperature: 180,
        permeability: 100,
        api: 35,
        gasGrav: 0.7,
        owc: -8000,
        goc: -7000
    },
    
    // Surfaces: { [uuid]: { id: uuid, name: string, ... } }
    surfaces: {}, 
    
    // Results
    results: null, 
    probResults: null,
    
    // UI States
    isCalculating: false,
    isDirty: false,
    error: null
};

// Action Types
const ACTIONS = {
    SET_PROJECT: 'SET_PROJECT',
    UPDATE_INPUTS: 'UPDATE_INPUTS',
    ADD_SURFACE: 'ADD_SURFACE',
    REMOVE_SURFACE: 'REMOVE_SURFACE',
    SET_TOP_SURFACE: 'SET_TOP_SURFACE',
    SET_BASE_SURFACE: 'SET_BASE_SURFACE',
    SET_RESULTS: 'SET_RESULTS',
    SET_PROB_RESULTS: 'SET_PROB_RESULTS',
    SET_CALCULATING: 'SET_CALCULATING',
    SET_ERROR: 'SET_ERROR',
    RESET: 'RESET',
    SET_MODE: 'SET_MODE',
    SET_UNIT_SYSTEM: 'SET_UNIT_SYSTEM',
    SET_INPUT_METHOD: 'SET_INPUT_METHOD',
    MARK_DIRTY: 'MARK_DIRTY'
};

// Reducer
const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_PROJECT:
            return { 
                ...state, 
                project: { ...state.project, ...action.payload },
                currentProjectMeta: { ...state.currentProjectMeta, ...action.payload.meta },
                isDirty: false 
            };
        case ACTIONS.UPDATE_INPUTS:
            return { 
                ...state, 
                inputs: { ...state.inputs, ...action.payload },
                isDirty: true
            };
        case ACTIONS.SET_MODE:
            return { ...state, calcMethod: action.payload }; 
        case ACTIONS.SET_UNIT_SYSTEM:
            return { ...state, unitSystem: action.payload };
        case ACTIONS.SET_INPUT_METHOD:
            return { ...state, inputMethod: action.payload };
        case ACTIONS.ADD_SURFACE:
            const newSurface = action.payload;
            if (!newSurface.id) newSurface.id = crypto.randomUUID();
            return { 
                ...state, 
                surfaces: { ...state.surfaces, [newSurface.id]: newSurface },
                isDirty: true
            };
        case ACTIONS.REMOVE_SURFACE:
            const newSurfaces = { ...state.surfaces };
            delete newSurfaces[action.payload];
            
            let newInputs = { ...state.inputs };
            if (newInputs.topSurfaceId === action.payload) newInputs.topSurfaceId = null;
            if (newInputs.baseSurfaceId === action.payload) newInputs.baseSurfaceId = null;

            return { ...state, surfaces: newSurfaces, inputs: newInputs, isDirty: true };
        case ACTIONS.SET_TOP_SURFACE:
            return { 
                ...state, 
                inputs: { ...state.inputs, topSurfaceId: action.payload },
                isDirty: true
            };
        case ACTIONS.SET_BASE_SURFACE:
            return { 
                ...state, 
                inputs: { ...state.inputs, baseSurfaceId: action.payload },
                isDirty: true
            };
        case ACTIONS.SET_RESULTS:
            return { ...state, results: action.payload, isCalculating: false };
        case ACTIONS.SET_PROB_RESULTS:
            return { ...state, probResults: action.payload, isCalculating: false };
        case ACTIONS.SET_CALCULATING:
            return { ...state, isCalculating: action.payload };
        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload };
        case ACTIONS.MARK_DIRTY:
            return { ...state, isDirty: true };
        case ACTIONS.RESET:
            return initialState;
        default:
            return state;
    }
};

const ReservoirCalcContext = createContext();

export const ReservoirCalcProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Helper actions
    const updateInputs = (inputs) => dispatch({ type: ACTIONS.UPDATE_INPUTS, payload: inputs });
    const addSurface = (surface) => dispatch({ type: ACTIONS.ADD_SURFACE, payload: surface });
    const deleteSurface = (id) => dispatch({ type: ACTIONS.REMOVE_SURFACE, payload: id });
    const setTopSurface = (id) => dispatch({ type: ACTIONS.SET_TOP_SURFACE, payload: id });
    const setBaseSurface = (id) => dispatch({ type: ACTIONS.SET_BASE_SURFACE, payload: id });
    const setCalcMethod = (mode) => dispatch({ type: ACTIONS.SET_MODE, payload: mode });
    const setUnitSystem = (system) => dispatch({ type: ACTIONS.SET_UNIT_SYSTEM, payload: system });
    const setInputMethod = (method) => dispatch({ type: ACTIONS.SET_INPUT_METHOD, payload: method });
    const setResults = (results) => dispatch({ type: ACTIONS.SET_RESULTS, payload: results });
    const saveCurrentProject = async (userId, meta) => {
        console.log("Saving project...", meta);
        // Placeholder for save logic
        dispatch({ type: ACTIONS.SET_PROJECT, payload: { meta } });
    };

    const getActiveSurface = () => {
        const id = state.inputs.topSurfaceId;
        return (state.surfaces && id) ? state.surfaces[id] : null;
    };

    // === CRITICAL: THE CALCULATE FUNCTION ===
    const calculate = async () => {
        console.log("Triggering Recalculation...");
        dispatch({ type: ACTIONS.SET_CALCULATING, payload: true });

        try {
            // Simulate async calc
            await new Promise(resolve => setTimeout(resolve, 300));

            if (state.calcMethod === 'probabilistic') {
                // Placeholder for probabilistic calculation
                // In a real app, this would call MonteCarloEngine
                console.log("Running Probabilistic Calc...");
                // dispatch({ type: ACTIONS.SET_PROB_RESULTS, payload: ... });
                // For now, just fallback or mock
                const res = VolumeCalculationEngine.calculateDeterministic(
                    state.inputs, 
                    state.unitSystem, 
                    state.inputMethod, 
                    state.surfaces
                );
                 // Mock a distribution
                const mockProb = { 
                     stats: { 
                         stooip: { p10: res.stooip * 1.2, p50: res.stooip, p90: res.stooip * 0.8, mean: res.stooip, min: res.stooip*0.5, max: res.stooip*1.5 } 
                     } 
                };
                dispatch({ type: ACTIONS.SET_PROB_RESULTS, payload: mockProb });
            } else {
                // Deterministic
                const results = VolumeCalculationEngine.calculateDeterministic(
                    state.inputs, 
                    state.unitSystem, 
                    state.inputMethod, 
                    state.surfaces
                );
                dispatch({ type: ACTIONS.SET_RESULTS, payload: results });
            }
        } catch (error) {
            console.error("Calculation Failed:", error);
            dispatch({ type: ACTIONS.SET_RESULTS, payload: { error: error.message } });
        } finally {
            dispatch({ type: ACTIONS.SET_CALCULATING, payload: false });
        }
    };

    const value = useMemo(() => ({
        state,
        dispatch,
        updateInputs,
        addSurface,
        deleteSurface,
        setTopSurface,
        setBaseSurface,
        setCalcMethod,
        setUnitSystem,
        setInputMethod,
        setResults,
        getActiveSurface,
        saveCurrentProject,
        calculate // Exposed to consumers
    }), [state]);

    return (
        <ReservoirCalcContext.Provider value={value}>
            {children}
        </ReservoirCalcContext.Provider>
    );
};

export const useReservoirCalc = () => {
    const context = useContext(ReservoirCalcContext);
    if (!context) {
        throw new Error("useReservoirCalc must be used within a ReservoirCalcProvider");
    }
    return context;
};

export default ReservoirCalcContext;