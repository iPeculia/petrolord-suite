import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const MEMContext = createContext(null);

const initialState = {
  project: {
    id: null,
    name: 'Untitled Project',
    description: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    settings: { unitSystem: 'metric', theme: 'dark' }
  },
  well: {
    name: 'New Well',
    location: '',
    depthUnit: 'm',
    depthRange: { top: 0, bottom: 3000 }
  },
  // Data Arrays - Initialized as empty arrays to prevent 'reading 0 of undefined'
  lithology: [], 
  pressureData: [],
  stressData: [],
  rockProperties: [],
  logs: [],
  
  // Analysis State
  calculations: {
    overburden: [],
    porePressure: [],
    fractureGradient: [],
    mudWindow: []
  },
  
  // UI State
  activeTab: 'overview',
  mode: 'guided', // 'guided' | 'expert'
  isLoading: false,
  error: null,
  notifications: []
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'UPDATE_PROJECT':
      return { ...state, project: { ...state.project, ...action.payload, updated_at: new Date().toISOString() } };
    case 'UPDATE_WELL':
      return { ...state, well: { ...state.well, ...action.payload } };
    
    // Generic Array Operations
    case 'ADD_ITEM':
      return { 
        ...state, 
        [action.collection]: [...(state[action.collection] || []), { ...action.payload, id: uuidv4() }] 
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        [action.collection]: (state[action.collection] || []).map(item => 
          item.id === action.id ? { ...item, ...action.payload } : item
        )
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        [action.collection]: (state[action.collection] || []).filter(item => item.id !== action.id)
      };
    case 'SET_COLLECTION':
        return {
            ...state,
            [action.collection]: action.payload
        };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export const MEMProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Safe getters to prevent undefined access
  const getCollection = (name) => state[name] || [];

  return (
    <MEMContext.Provider value={{ state, dispatch, getCollection }}>
      {children}
    </MEMContext.Provider>
  );
};

export const useMEM = () => {
  const context = useContext(MEMContext);
  if (!context) {
    throw new Error('useMEM must be used within a MEMProvider');
  }
  return context;
};