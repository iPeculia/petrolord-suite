import React, { createContext, useContext, useReducer, useMemo } from 'react';

const AnalyticsContext = createContext();

const initialState = {
    calculationResults: null,
    analysisMetrics: {
        stress: {},
        pressure: {},
        geomechanical: {},
        stats: {},
    },
    visualizationData: null,
    comparisonData: [],
    exportPreferences: {},
    activeTab: 'dashboard', // Default active tab
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_INITIAL_DATA':
            return {
                ...state,
                calculationResults: action.payload,
                visualizationData: action.payload, // Initially set visualization data to full results
            };
        case 'SET_ACTIVE_TAB':
            return { ...state, activeTab: action.payload };
        case 'UPDATE_METRICS':
            return { ...state, analysisMetrics: { ...state.analysisMetrics, ...action.payload } };
        // Add more cases for other state updates
        default:
            return state;
    }
};

export const AnalyticsProvider = ({ children, initialData }) => {
    const [state, dispatch] = useReducer(reducer, {
        ...initialState,
        calculationResults: initialData,
        visualizationData: initialData,
    });
    
    const value = useMemo(() => ({ state, dispatch }), [state]);

    return (
        <AnalyticsContext.Provider value={value}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (context === undefined) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
};