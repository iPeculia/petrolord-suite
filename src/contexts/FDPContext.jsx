import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { DataValidator } from '@/services/fdp/DataValidator';
import { mockTeam, mockComments, mockNotifications } from '@/data/fdp/mockCollaborationData';
import { mockTasks, mockApprovals, mockAuditLog } from '@/data/fdp/mockWorkflowData';
import { mockCourses } from '@/data/training/mockTrainingData';
import { mockFAQs, mockArticles } from '@/data/help/mockHelpData';

// Initial State
const initialState = {
    meta: {
        id: null,
        name: "New Field Development Plan",
        status: "draft",
        version: "1.0.0",
        lastModified: new Date().toISOString(),
        author: "CurrentUser",
        mode: "expert",
    },
    navigation: {
        activeTab: "overview",
        sidebarCollapsed: false,
        rightPanelOpen: true,
        currentStep: 0,
    },
    fieldData: {
        fieldName: "",
        location: { lat: 0, lng: 0, name: "" },
        country: "",
        region: "",
        assetType: "Offshore",
        waterDepth: 0,
        fieldArea: 0,
        status: "Appraisal",
        operator: "",
        description: "",
        dates: { discovery: "", appraisal: "", firstOil: "", plateauStart: "", plateauEnd: "", abandonment: "" },
        stakeholders: [], 
        objectives: [], 
        partnerReqs: [], 
        regulatoryConstraints: []
    },
    subsurface: {
        reserves: { 
            summary: { p10: 0, p50: 0, p90: 0, unit: "MMbbl", rf: 0 },
            breakdown: []
        },
        properties: { zones: [] },
        pressureTemp: {
            gradient: 0.45,
            temperatureGradient: 1.2,
            datumDepth: 0,
            datumPressure: 0,
            dataPoints: []
        },
        geomech: {
            fractureGradient: 0,
            porePressureGradient: 0,
            mudWindow: { min: 0, max: 0 }
        },
        fluidProps: { type: "oil", api: 35, gor: 500, viscosity: 0.5 },
        risks: [] 
    },
    concepts: {
        list: [], 
        selectedId: null,
        comparisonIds: []
    },
    scenarios: {
        list: [], 
        selectedId: null
    },
    wells: {
        list: [], 
        drillingSchedule: [],
        rigs: 1,
        rigRate: 250000,
        strategy: 'Sequential', 
        risks: []
    },
    facilities: {
        list: [], 
        selectedId: null,
        exportMethod: "Pipeline",
        constraints: []
    },
    schedule: {
        activities: [],
        baseline: [],
        criticalPath: [],
        risks: [],
        settings: { workWeek: 7 }
    },
    costs: {
        items: [],
        settings: { currency: 'USD', escalation: 2.5, contingency: 10 }
    },
    economics: {
        priceDeck: [],
        capex: 0,
        opex: 0,
        npv: 0,
        irr: 0,
        oilPrice: 75,
        royalty: 0,
        tax: 0
    },
    hseData: {
        policy: "",
        safetySystem: "ISO 45001",
        envSystem: "ISO 14001",
        hazards: [],
        controls: [],
        emergency: "",
        training: "",
        incidents: [],
        kpis: [],
        compliance: [],
        certifications: []
    },
    communityData: {
        strategy: "Proactive Engagement",
        stakeholders: [],
        concerns: [],
        activities: [],
        benefits: [],
        employment: { localContentTarget: 40 },
        impactAssessment: "",
        grievances: [],
        monitoring: "",
        relationships: []
    },
    dataManagement: {
        importStatus: {}, 
        validationStatus: { isValid: true, errors: [], warnings: [] },
        syncHistory: []
    },
    analytics: {
        metadata: { performed: 0, insights: 0 },
        results: []
    },
    optimization: {
        metadata: { optimizations: 0, improvements: 0 },
        results: []
    },
    collaboration: {
        team: mockTeam,
        comments: mockComments,
        notifications: mockNotifications
    },
    workflow: {
        tasks: mockTasks,
        approvals: mockApprovals,
        auditLog: mockAuditLog
    },
    mobileApp: {
        status: 'Live',
        version: '2.1.0',
        users: 128,
        downloads: 450
    },
    api: {
        status: 'Healthy',
        requests: 1200000,
        endpoints: 15
    },
    helpGuide: {
        faqs: mockFAQs,
        articles: mockArticles
    },
    training: {
        courses: mockCourses
    },
    risks: [], 
    notifications: [],
    isLoading: false,
    error: null
};

// Action Types
const ACTIONS = {
    SET_PROJECT_META: 'SET_PROJECT_META',
    SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
    TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
    TOGGLE_RIGHT_PANEL: 'TOGGLE_RIGHT_PANEL',
    SET_GUIDED_STEP: 'SET_GUIDED_STEP',
    UPDATE_FIELD_DATA: 'UPDATE_FIELD_DATA',
    UPDATE_SUBSURFACE: 'UPDATE_SUBSURFACE',
    UPDATE_CONCEPTS: 'UPDATE_CONCEPTS',
    UPDATE_SCENARIOS: 'UPDATE_SCENARIOS',
    UPDATE_WELLS: 'UPDATE_WELLS',
    UPDATE_FACILITIES: 'UPDATE_FACILITIES',
    UPDATE_SCHEDULE: 'UPDATE_SCHEDULE',
    UPDATE_COSTS: 'UPDATE_COSTS', 
    UPDATE_ECONOMICS: 'UPDATE_ECONOMICS',
    UPDATE_HSE: 'UPDATE_HSE',
    UPDATE_COMMUNITY: 'UPDATE_COMMUNITY',
    UPDATE_DATA_MANAGEMENT: 'UPDATE_DATA_MANAGEMENT',
    UPDATE_RISKS: 'UPDATE_RISKS', 
    ADD_RISK: 'ADD_RISK',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_MODE: 'SET_MODE',
    UPDATE_ANALYTICS: 'UPDATE_ANALYTICS',
    UPDATE_OPTIMIZATION: 'UPDATE_OPTIMIZATION',
    UPDATE_COLLABORATION: 'UPDATE_COLLABORATION',
    UPDATE_WORKFLOW: 'UPDATE_WORKFLOW',
    UPDATE_MOBILE_APP: 'UPDATE_MOBILE_APP',
    UPDATE_API: 'UPDATE_API',
    UPDATE_HELP_GUIDE: 'UPDATE_HELP_GUIDE',
    UPDATE_TRAINING: 'UPDATE_TRAINING'
};

// Reducer
const fdpReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_PROJECT_META:
            return { ...state, meta: { ...state.meta, ...action.payload } };
        case ACTIONS.SET_ACTIVE_TAB:
            return { ...state, navigation: { ...state.navigation, activeTab: action.payload } };
        case ACTIONS.TOGGLE_SIDEBAR:
            return { ...state, navigation: { ...state.navigation, sidebarCollapsed: !state.navigation.sidebarCollapsed } };
        case ACTIONS.TOGGLE_RIGHT_PANEL:
            return { ...state, navigation: { ...state.navigation, rightPanelOpen: !state.navigation.rightPanelOpen } };
        case ACTIONS.SET_GUIDED_STEP:
            return { ...state, navigation: { ...state.navigation, currentStep: action.payload } };
        case ACTIONS.UPDATE_FIELD_DATA: {
            const newFieldData = { ...state.fieldData, ...action.payload };
            const validation = DataValidator.validateFieldOverview(newFieldData);
            return { 
                ...state, 
                fieldData: newFieldData,
                dataManagement: { ...state.dataManagement, validationStatus: validation }
            };
        }
        case ACTIONS.UPDATE_SUBSURFACE:
            return { ...state, subsurface: { ...state.subsurface, ...action.payload } };
        case ACTIONS.UPDATE_CONCEPTS:
            return { ...state, concepts: { ...state.concepts, ...action.payload } };
        case ACTIONS.UPDATE_SCENARIOS:
            return { ...state, scenarios: { ...state.scenarios, ...action.payload } };
        case ACTIONS.UPDATE_WELLS:
            return { ...state, wells: { ...state.wells, ...action.payload } };
        case ACTIONS.UPDATE_FACILITIES:
            return { ...state, facilities: { ...state.facilities, ...action.payload } };
        case ACTIONS.UPDATE_SCHEDULE:
            return { ...state, schedule: { ...state.schedule, ...action.payload } };
        case ACTIONS.UPDATE_COSTS:
            return { ...state, costs: { ...state.costs, ...action.payload } };
        case ACTIONS.UPDATE_ECONOMICS:
            return { ...state, economics: { ...state.economics, ...action.payload } };
        case ACTIONS.UPDATE_HSE:
            return { ...state, hseData: { ...state.hseData, ...action.payload } };
        case ACTIONS.UPDATE_COMMUNITY:
            return { ...state, communityData: { ...state.communityData, ...action.payload } };
        case ACTIONS.UPDATE_DATA_MANAGEMENT:
            return { ...state, dataManagement: { ...state.dataManagement, ...action.payload } };
        case ACTIONS.UPDATE_RISKS: 
            return { ...state, risks: action.payload };
        case ACTIONS.ADD_RISK: 
            return { ...state, risks: [...state.risks, action.payload] };
        case ACTIONS.UPDATE_ANALYTICS:
            return { ...state, analytics: { ...state.analytics, ...action.payload } };
        case ACTIONS.UPDATE_OPTIMIZATION:
            return { ...state, optimization: { ...state.optimization, ...action.payload } };
        case ACTIONS.UPDATE_COLLABORATION:
            return { ...state, collaboration: { ...state.collaboration, ...action.payload } };
        case ACTIONS.UPDATE_WORKFLOW:
            return { ...state, workflow: { ...state.workflow, ...action.payload } };
        case ACTIONS.UPDATE_MOBILE_APP:
            return { ...state, mobileApp: { ...state.mobileApp, ...action.payload } };
        case ACTIONS.UPDATE_API:
            return { ...state, api: { ...state.api, ...action.payload } };
        case ACTIONS.UPDATE_HELP_GUIDE:
            return { ...state, helpGuide: { ...state.helpGuide, ...action.payload } };
        case ACTIONS.UPDATE_TRAINING:
            return { ...state, training: { ...state.training, ...action.payload } };
        case ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload };
        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload };
        case ACTIONS.SET_MODE:
            return { ...state, meta: { ...state.meta, mode: action.payload } };
        default:
            return state;
    }
};

const FDPContext = createContext();

export const FDPProvider = ({ children }) => {
    const [state, dispatch] = useReducer(fdpReducer, initialState);

    // Persistence
    useEffect(() => {
        const saved = localStorage.getItem('fdp_project_temp');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                dispatch({ type: ACTIONS.SET_PROJECT_META, payload: parsed.meta });
                if(parsed.fieldData) dispatch({ type: ACTIONS.UPDATE_FIELD_DATA, payload: parsed.fieldData });
                if(parsed.subsurface) dispatch({ type: ACTIONS.UPDATE_SUBSURFACE, payload: parsed.subsurface });
                if(parsed.concepts) dispatch({ type: ACTIONS.UPDATE_CONCEPTS, payload: parsed.concepts });
                if(parsed.scenarios) dispatch({ type: ACTIONS.UPDATE_SCENARIOS, payload: parsed.scenarios });
                if(parsed.wells) dispatch({ type: ACTIONS.UPDATE_WELLS, payload: parsed.wells });
                if(parsed.facilities) dispatch({ type: ACTIONS.UPDATE_FACILITIES, payload: parsed.facilities });
                if(parsed.schedule) dispatch({ type: ACTIONS.UPDATE_SCHEDULE, payload: parsed.schedule });
                if(parsed.costs) dispatch({ type: ACTIONS.UPDATE_COSTS, payload: parsed.costs }); 
                if(parsed.hseData) dispatch({ type: ACTIONS.UPDATE_HSE, payload: parsed.hseData });
                if(parsed.communityData) dispatch({ type: ACTIONS.UPDATE_COMMUNITY, payload: parsed.communityData });
                if(parsed.risks) dispatch({ type: ACTIONS.UPDATE_RISKS, payload: parsed.risks });
                if(parsed.analytics) dispatch({ type: ACTIONS.UPDATE_ANALYTICS, payload: parsed.analytics });
                if(parsed.optimization) dispatch({ type: ACTIONS.UPDATE_OPTIMIZATION, payload: parsed.optimization });
                if(parsed.collaboration) dispatch({ type: ACTIONS.UPDATE_COLLABORATION, payload: parsed.collaboration });
                if(parsed.workflow) dispatch({ type: ACTIONS.UPDATE_WORKFLOW, payload: parsed.workflow });
                if(parsed.mobileApp) dispatch({ type: ACTIONS.UPDATE_MOBILE_APP, payload: parsed.mobileApp });
                if(parsed.api) dispatch({ type: ACTIONS.UPDATE_API, payload: parsed.api });
                if(parsed.helpGuide) dispatch({ type: ACTIONS.UPDATE_HELP_GUIDE, payload: parsed.helpGuide });
                if(parsed.training) dispatch({ type: ACTIONS.UPDATE_TRAINING, payload: parsed.training });
            } catch (e) {
                console.error("Failed to load saved FDP state", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('fdp_project_temp', JSON.stringify({
            meta: state.meta,
            fieldData: state.fieldData,
            subsurface: state.subsurface,
            concepts: state.concepts,
            scenarios: state.scenarios,
            wells: state.wells,
            facilities: state.facilities,
            schedule: state.schedule,
            costs: state.costs,
            hseData: state.hseData,
            communityData: state.communityData,
            risks: state.risks,
            analytics: state.analytics,
            optimization: state.optimization,
            collaboration: state.collaboration,
            workflow: state.workflow,
            mobileApp: state.mobileApp,
            api: state.api,
            helpGuide: state.helpGuide,
            training: state.training
        }));
    }, [state]);

    const setProjectName = (name) => dispatch({ type: ACTIONS.SET_PROJECT_META, payload: { name } });
    const setActiveTab = (tab) => dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tab });
    const toggleSidebar = () => dispatch({ type: ACTIONS.TOGGLE_SIDEBAR });
    const toggleRightPanel = () => dispatch({ type: ACTIONS.TOGGLE_RIGHT_PANEL });
    const setMode = (mode) => dispatch({ type: ACTIONS.SET_MODE, payload: mode });
    const setGuidedStep = (step) => dispatch({ type: ACTIONS.SET_GUIDED_STEP, payload: step });
    
    const updateFieldData = (data) => dispatch({ type: ACTIONS.UPDATE_FIELD_DATA, payload: data });
    const updateSubsurface = (data) => dispatch({ type: ACTIONS.UPDATE_SUBSURFACE, payload: data });
    const updateConcepts = (data) => dispatch({ type: ACTIONS.UPDATE_CONCEPTS, payload: data });
    const updateScenarios = (data) => dispatch({ type: ACTIONS.UPDATE_SCENARIOS, payload: data });
    const updateWells = (data) => dispatch({ type: ACTIONS.UPDATE_WELLS, payload: data });
    const updateFacilities = (data) => dispatch({ type: ACTIONS.UPDATE_FACILITIES, payload: data });
    const updateSchedule = (data) => dispatch({ type: ACTIONS.UPDATE_SCHEDULE, payload: data });
    const updateCosts = (data) => dispatch({ type: ACTIONS.UPDATE_COSTS, payload: data }); 
    const updateEconomics = (data) => dispatch({ type: ACTIONS.UPDATE_ECONOMICS, payload: data });
    const updateHSE = (data) => dispatch({ type: ACTIONS.UPDATE_HSE, payload: data });
    const updateCommunity = (data) => dispatch({ type: ACTIONS.UPDATE_COMMUNITY, payload: data });
    const updateDataManagement = (data) => dispatch({ type: ACTIONS.UPDATE_DATA_MANAGEMENT, payload: data });
    const updateRisks = (data) => dispatch({ type: ACTIONS.UPDATE_RISKS, payload: data });
    const updateAnalytics = (data) => dispatch({ type: ACTIONS.UPDATE_ANALYTICS, payload: data });
    const updateOptimization = (data) => dispatch({ type: ACTIONS.UPDATE_OPTIMIZATION, payload: data });
    const updateCollaboration = (data) => dispatch({ type: ACTIONS.UPDATE_COLLABORATION, payload: data });
    const updateWorkflow = (data) => dispatch({ type: ACTIONS.UPDATE_WORKFLOW, payload: data });
    const updateMobileApp = (data) => dispatch({ type: ACTIONS.UPDATE_MOBILE_APP, payload: data });
    const updateAPI = (data) => dispatch({ type: ACTIONS.UPDATE_API, payload: data });
    const updateHelpGuide = (data) => dispatch({ type: ACTIONS.UPDATE_HELP_GUIDE, payload: data });
    const updateTraining = (data) => dispatch({ type: ACTIONS.UPDATE_TRAINING, payload: data });

    return (
        <FDPContext.Provider value={{
            state,
            dispatch,
            actions: {
                setProjectName,
                setActiveTab,
                toggleSidebar,
                toggleRightPanel,
                setMode,
                setGuidedStep,
                updateFieldData,
                updateSubsurface,
                updateConcepts,
                updateScenarios,
                updateWells,
                updateFacilities,
                updateSchedule,
                updateCosts,
                updateEconomics,
                updateHSE,
                updateCommunity,
                updateDataManagement,
                updateRisks,
                updateAnalytics,
                updateOptimization,
                updateCollaboration,
                updateWorkflow,
                updateMobileApp,
                updateAPI,
                updateHelpGuide,
                updateTraining
            }
        }}>
            {children}
        </FDPContext.Provider>
    );
};

export const useFDP = () => {
    const context = useContext(FDPContext);
    if (!context) {
        throw new Error("useFDP must be used within an FDPProvider");
    }
    return context;
};