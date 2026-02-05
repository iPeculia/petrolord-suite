import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Define the initial state for the guided mode
const initialState = {
    currentStep: 0,
    formData: {},
    loading: false,
    error: null,
    memProject: null,
    wellLogs: [],
    pressureData: null,
    mechanicalProperties: null,
    trajectoryData: null,
    activeLayerId: null,
};

// Define action types
const actionTypes = {
    NEXT_STEP: 'NEXT_STEP',
    PREVIOUS_STEP: 'PREVIOUS_STEP',
    SET_STEP: 'SET_STEP',
    UPDATE_FORM_DATA: 'UPDATE_FORM_DATA',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    RESET_GUIDED_MODE: 'RESET_GUIDED_MODE',
    SET_MEM_PROJECT: 'SET_MEM_PROJECT',
    SET_WELL_LOGS: 'SET_WELL_LOGS',
    SET_PRESSURE_DATA: 'SET_PRESSURE_DATA',
    SET_MECHANICAL_PROPERTIES: 'SET_MECHANICAL_PROPERTIES',
    SET_TRAJECTORY_DATA: 'SET_TRAJECTORY_DATA',
    SET_ACTIVE_LAYER: 'SET_ACTIVE_LAYER',
};

// Reducer function
const guidedModeReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.NEXT_STEP:
            return { ...state, currentStep: state.currentStep + 1 };
        case actionTypes.PREVIOUS_STEP:
            return { ...state, currentStep: state.currentStep - 1 };
        case actionTypes.SET_STEP:
            return { ...state, currentStep: action.payload };
        case actionTypes.UPDATE_FORM_DATA:
            return { ...state, formData: { ...state.formData, ...action.payload } };
        case actionTypes.SET_LOADING:
            return { ...state, loading: action.payload };
        case actionTypes.SET_ERROR:
            return { ...state, error: action.payload };
        case actionTypes.RESET_GUIDED_MODE:
            return initialState;
        case actionTypes.SET_MEM_PROJECT:
            return { ...state, memProject: action.payload };
        case actionTypes.SET_WELL_LOGS:
            return { ...state, wellLogs: action.payload };
        case actionTypes.SET_PRESSURE_DATA:
            return { ...state, pressureData: action.payload };
        case actionTypes.SET_MECHANICAL_PROPERTIES:
            return { ...state, mechanicalProperties: action.payload };
        case actionTypes.SET_TRAJECTORY_DATA:
            return { ...state, trajectoryData: action.payload };
        case actionTypes.SET_ACTIVE_LAYER:
            return { ...state, activeLayerId: action.payload };
        default:
            return state;
    }
};

// Create the context
export const GuidedModeContext = createContext(undefined);

// Create a custom hook
export const useGuidedMode = () => {
    const context = useContext(GuidedModeContext);
    if (context === undefined) {
        throw new Error('useGuidedMode must be used within a GuidedModeProvider');
    }
    return context;
};

// Create the provider component
export const GuidedModeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(guidedModeReducer, initialState);

    const nextStep = useCallback(() => dispatch({ type: actionTypes.NEXT_STEP }), []);
    const previousStep = useCallback(() => dispatch({ type: actionTypes.PREVIOUS_STEP }), []);
    const setStep = useCallback((step) => dispatch({ type: actionTypes.SET_STEP, payload: step }), []);
    const updateFormData = useCallback((data) => dispatch({ type: actionTypes.UPDATE_FORM_DATA, payload: data }), []);
    const setLoading = useCallback((isLoading) => dispatch({ type: actionTypes.SET_LOADING, payload: isLoading }), []);
    const setError = useCallback((err) => dispatch({ type: actionTypes.SET_ERROR, payload: err }), []);
    const resetGuidedMode = useCallback(() => dispatch({ type: actionTypes.RESET_GUIDED_MODE }), []);
    const setMemProject = useCallback((project) => dispatch({ type: actionTypes.SET_MEM_PROJECT, payload: project }), []);
    const setWellLogs = useCallback((logs) => dispatch({ type: actionTypes.SET_WELL_LOGS, payload: logs }), []);
    const setPressureData = useCallback((data) => dispatch({ type: actionTypes.SET_PRESSURE_DATA, payload: data }), []);
    const setMechanicalProperties = useCallback((props) => dispatch({ type: actionTypes.SET_MECHANICAL_PROPERTIES, payload: props }), []);
    const setTrajectoryData = useCallback((data) => dispatch({ type: actionTypes.SET_TRAJECTORY_DATA, payload: data }), []);
    const setActiveLayer = useCallback((layerId) => dispatch({ type: actionTypes.SET_ACTIVE_LAYER, payload: layerId }), []);

    const value = {
        state,
        nextStep,
        previousStep,
        setStep,
        updateFormData,
        setLoading,
        setError,
        resetGuidedMode,
        setMemProject,
        setWellLogs,
        setPressureData,
        setMechanicalProperties,
        setTrajectoryData,
        setActiveLayer,
    };

    return (
        <GuidedModeContext.Provider value={value}>
            {children}
        </GuidedModeContext.Provider>
    );
};