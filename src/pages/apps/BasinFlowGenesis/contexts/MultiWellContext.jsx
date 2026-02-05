import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const MultiWellContext = createContext(null);

const initialState = {
    wells: [], // List of well metadata
    wellDataMap: {}, // Map of id -> full data object
    activeWellId: null,
    comparisonMode: false,
    selectedWellsForComparison: [],
    isLoading: false
};

const multiWellReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_WELLS':
            // Initialize wellDataMap from fetched wells
            const dataMap = {};
            action.payload.forEach(w => {
                dataMap[w.id] = w;
            });
            return { 
                ...state, 
                wells: action.payload.map(w => ({
                    id: w.id,
                    name: w.name,
                    status: w.status,
                    location: w.location_coords, // Adapt if needed
                    updated_at: w.updated_at
                })),
                wellDataMap: dataMap
            };
        case 'ADD_WELL_LOCAL': {
            const newWell = action.payload;
            return { 
                ...state, 
                wells: [...state.wells, { 
                    id: newWell.id, 
                    name: newWell.name, 
                    status: newWell.status,
                    updated_at: new Date().toISOString()
                }],
                wellDataMap: {
                    ...state.wellDataMap,
                    [newWell.id]: newWell
                }
            };
        }
        case 'REMOVE_WELL_LOCAL': {
            const newWellDataMap = { ...state.wellDataMap };
            delete newWellDataMap[action.payload];
            return {
                ...state,
                wells: state.wells.filter(w => w.id !== action.payload),
                wellDataMap: newWellDataMap,
                activeWellId: state.activeWellId === action.payload ? null : state.activeWellId
            };
        }
        case 'SET_ACTIVE_WELL':
            return { ...state, activeWellId: action.payload };
        case 'UPDATE_WELL_LOCAL': {
            const updatedWells = state.wells.map(w => w.id === action.id ? { ...w, ...action.payload, updated_at: new Date().toISOString() } : w);
            const currentData = state.wellDataMap[action.id] || {};
            const updatedWellData = { ...currentData, ...action.payload, updated_at: new Date().toISOString() };
            
            return {
                ...state,
                wells: updatedWells,
                wellDataMap: { ...state.wellDataMap, [action.id]: updatedWellData }
            };
        }
        default:
            return state;
    }
};

export const MultiWellProvider = ({ children }) => {
    const [state, dispatch] = useReducer(multiWellReducer, initialState);
    const { toast } = useToast();

    // --- Supabase Sync ---

    const fetchWells = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('bf_wells')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false });

            if (error) throw error;

            if (data) {
                // Transform if necessary to match internal structure
                const processedData = data.map(w => ({
                    ...w,
                    location: w.location_coords || { lat: 0, lng: 0 },
                    stratigraphy: w.stratigraphy || [],
                    heatFlow: w.heat_flow || { type: 'constant', value: 60 },
                    calibration: w.calibration_data || { ro: [], temp: [] },
                    scenarios: w.scenarios || []
                }));
                dispatch({ type: 'SET_WELLS', payload: processedData });
            }
        } catch (error) {
            console.error("Error fetching wells:", error);
            toast({ variant: "destructive", title: "Sync Error", description: "Could not load wells." });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [toast]);

    // Initial Load
    useEffect(() => {
        fetchWells();
    }, [fetchWells]);

    const addWell = useCallback(async (wellData) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast({ title: "Authentication Error", description: "Please sign in to create wells.", variant: "destructive" });
                return;
            }

            const newWellId = uuidv4();
            const payload = {
                id: newWellId,
                user_id: user.id,
                name: wellData.name || 'New Well',
                status: wellData.status || 'not-started',
                stratigraphy: [],
                heat_flow: { type: 'constant', value: 60 },
                calibration_data: {},
                scenarios: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            // Optimistic UI update
            dispatch({ type: 'ADD_WELL_LOCAL', payload: { ...payload, location: { lat: 0, lng: 0 } } }); // Adapt local structure

            const { error } = await supabase.from('bf_wells').insert([payload]);
            if (error) throw error;

            toast({ title: "Well Created", description: `${payload.name} added to database.` });
            return newWellId;
        } catch (error) {
            console.error("Error creating well:", error);
            toast({ variant: "destructive", title: "Creation Failed", description: error.message });
        }
    }, [toast]);

    const updateWell = useCallback(async (id, updates) => {
        // Local update first
        dispatch({ type: 'UPDATE_WELL_LOCAL', id, payload: updates });

        try {
            // Map internal names to DB column names if needed
            const dbUpdates = {};
            if (updates.name) dbUpdates.name = updates.name;
            if (updates.status) dbUpdates.status = updates.status;
            if (updates.stratigraphy) dbUpdates.stratigraphy = updates.stratigraphy;
            if (updates.heatFlow) dbUpdates.heat_flow = updates.heatFlow;
            if (updates.calibration) dbUpdates.calibration_data = updates.calibration;
            if (updates.scenarios) dbUpdates.scenarios = updates.scenarios;
            
            dbUpdates.updated_at = new Date().toISOString();

            if (Object.keys(dbUpdates).length > 0) {
                const { error } = await supabase.from('bf_wells').update(dbUpdates).eq('id', id);
                if (error) throw error;
            }
        } catch (error) {
            console.error("Error updating well:", error);
            // toast({ variant: "destructive", title: "Save Failed", description: "Changes might not be persisted." });
        }
    }, []);

    const removeWell = useCallback(async (id) => {
        dispatch({ type: 'REMOVE_WELL_LOCAL', payload: id });
        try {
            const { error } = await supabase.from('bf_wells').delete().eq('id', id);
            if (error) throw error;
            toast({ title: "Well Deleted", description: "Well removed from database." });
        } catch (error) {
            console.error("Error deleting well:", error);
            toast({ variant: "destructive", title: "Deletion Failed", description: error.message });
        }
    }, [toast]);

    const saveWellData = useCallback((id, data) => {
        // Wrapper for updateWell to be used by consumers
        updateWell(id, data);
    }, [updateWell]);

    const getWellData = useCallback((id) => state.wellDataMap[id], [state.wellDataMap]);
    const setActiveWell = useCallback((id) => dispatch({ type: 'SET_ACTIVE_WELL', payload: id }), []);

    return (
        <MultiWellContext.Provider value={{ 
            state, 
            addWell, 
            removeWell, 
            setActiveWell, 
            updateWell, 
            saveWellData,
            getWellData,
            fetchWells
        }}>
            {children}
        </MultiWellContext.Provider>
    );
};

export const useMultiWell = () => {
    const context = useContext(MultiWellContext);
    if (!context) throw new Error('useMultiWell must be used within MultiWellProvider');
    return context;
};