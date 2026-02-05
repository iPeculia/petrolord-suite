import { useReducer } from 'react';

const initialState = {
    projectId: null,
    projectName: 'New MEM Project',
    inputs: {
        unitSystem: 'metric',
        logs: null, // Parsed log data from LAS
        curveMap: {}, // { GR: 'GR', RHOB: 'DENSITY_1', ... }
        pressurePoints: [],
        rockProperties: {
            poissonsRatio: 0.25,
            frictionAngle: 30,
        },
        trajectory: [],
    },
    results: {
        stresses: [],
        properties: [],
        mudWindow: [],
    },
    jobId: null,
    jobStatus: 'idle', // idle, running, completed, failed
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_PROJECT':
            return { ...state, projectId: action.payload.id, projectName: action.payload.name };
        case 'SET_INPUT_DATA':
            return { ...state, inputs: { ...state.inputs, ...action.payload } };
        case 'SET_CURVE_MAP':
            return { ...state, inputs: { ...state.inputs, curveMap: action.payload }};
        case 'SET_UNIT_SYSTEM':
            return { ...state, inputs: { ...state.inputs, unitSystem: action.payload }};
        case 'SET_ROCK_PROPERTIES':
            return { ...state, inputs: { ...state.inputs, rockProperties: { ...state.inputs.rockProperties, ...action.payload} }};
        case 'SET_RESULTS':
            return { ...state, results: action.payload };
        case 'SET_JOB_ID':
            return { ...state, jobId: action.payload };
        case 'SET_JOB_STATUS':
            return { ...state, jobStatus: action.payload };
        case 'LOAD_PROJECT_STATE':
            return { ...state, ...action.payload };
        case 'RESET_STATE':
            return { ...initialState };
        default:
            return state;
    }
};

export const useMEMState = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return { state, dispatch };
};