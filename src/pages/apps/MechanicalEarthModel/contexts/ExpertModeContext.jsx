import React, { createContext, useContext, useState, useCallback, useReducer } from 'react';

const ExpertModeContext = createContext();

const initialState = {
  activeLayerId: null,
  calibrationData: {
    ro: [], // { depth, value }
    temperature: [], // { depth, value }
    pressure: []
  },
  scenarios: [],
  sensitivityParams: {
    parameter: 'heatFlow',
    min: 40,
    max: 80,
    steps: 5
  },
  sensitivityResults: null
};

function expertReducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_LAYER':
      return { ...state, activeLayerId: action.payload };
    case 'UPDATE_CALIBRATION_DATA':
      return { ...state, calibrationData: { ...state.calibrationData, ...action.payload } };
    case 'ADD_SCENARIO':
      return { ...state, scenarios: [...state.scenarios, action.payload] };
    case 'SET_SENSITIVITY_PARAMS':
      return { ...state, sensitivityParams: action.payload };
    case 'SET_SENSITIVITY_RESULTS':
      return { ...state, sensitivityResults: action.payload };
    default:
      return state;
  }
}

export const ExpertModeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expertReducer, initialState);

  const setActiveLayer = useCallback((id) => dispatch({ type: 'SET_ACTIVE_LAYER', payload: id }), []);
  
  const updateCalibrationData = useCallback((type, data) => {
    dispatch({ type: 'UPDATE_CALIBRATION_DATA', payload: { [type]: data } });
  }, []);

  const addScenario = useCallback((scenario) => {
    dispatch({ type: 'ADD_SCENARIO', payload: { id: Date.now(), ...scenario } });
  }, []);

  const runSensitivityAnalysis = useCallback(async () => {
    // Mock simulation run
    return new Promise(resolve => {
        setTimeout(() => {
            const results = {
                tornado: [
                    { parameter: 'Heat Flow', impact: 0.85 },
                    { parameter: 'Thermal Cond.', impact: 0.45 },
                    { parameter: 'Erosion', impact: 0.25 }
                ],
                variation: [
                    { x: state.sensitivityParams.min, y: 0.5 },
                    { x: state.sensitivityParams.max, y: 1.2 }
                ]
            };
            dispatch({ type: 'SET_SENSITIVITY_RESULTS', payload: results });
            resolve(results);
        }, 1500);
    });
  }, [state.sensitivityParams]);

  return (
    <ExpertModeContext.Provider value={{ 
      state, 
      setActiveLayer, 
      updateCalibrationData, 
      addScenario,
      runSensitivityAnalysis
    }}>
      {children}
    </ExpertModeContext.Provider>
  );
};

export const useExpertMode = () => {
  const context = useContext(ExpertModeContext);
  if (!context) {
    throw new Error('useExpertMode must be used within an ExpertModeProvider');
  }
  return context;
};