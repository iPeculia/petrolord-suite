import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { MOCK_CATALOG } from '../data/catalog';

const CasingTubingDesignContext = createContext();

export const CasingTubingDesignProvider = ({ children }) => {
    const { user } = useAuth();
    const { toast } = useToast();

    // -- App State --
    const [wells, setWells] = useState([]);
    const [selectedWell, setSelectedWell] = useState(null);
    const [designCases, setDesignCases] = useState([]); 
    const [selectedDesignCase, setSelectedDesignCase] = useState(null);
    const [activeTab, setActiveTab] = useState('well-loads');
    
    // -- UX State (Phase 5) --
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    
    // -- Engineering Data State --
    const [wellTrajectory, setWellTrajectory] = useState([]);
    const [ppfgProfile, setPpfgProfile] = useState([]);
    const [tempProfile, setTempProfile] = useState([]);
    const [loadCases, setLoadCases] = useState([]);
    const [casingStrings, setCasingStrings] = useState([]); // Array of casing strings
    const [tubingStrings, setTubingStrings] = useState([]); // Array of tubing strings
    
    // -- Phase 4: Packer & Completion Config --
    const [packerConfig, setPackerConfig] = useState({
        hasPacker: true,
        depth: 3400,
        type: 'Permanent',
        rating: 450, // kN
        stroke: 2.0, // m
        hasSSSV: true,
        sssvDepth: 150,
        sssvPressure: 350 // bar
    });

    const [catalog, setCatalog] = useState(MOCK_CATALOG);
    
    // -- Settings & Results --
    const [safetyFactors, setSafetyFactors] = useState({
        burst: 1.1,
        collapse: 1.0,
        tension: 1.6,
        triaxial: 1.25,
        compression: 1.2
    });
    
    const [results, setResults] = useState(null);
    const [logs, setLogs] = useState([]);
    const [warnings, setWarnings] = useState([]);

    // -- Helpers --
    const addLog = (message, type = 'info') => {
        setLogs(prev => [{ timestamp: new Date(), message, type }, ...prev]);
    };

    const addWarning = (message, severity = 'medium') => {
        setWarnings(prev => [...prev, { id: Date.now(), message, severity }]);
    };

    const toggleHelp = () => setIsHelpOpen(prev => !prev);

    // -- Mock Data Generators --
    const generateMockTrajectory = (wellId) => {
        const points = [];
        let md = 0;
        let tvd = 0;
        let inc = 0;
        // Simple build and hold profile
        for (let i = 0; i <= 24; i++) {
            points.push({ md, tvd: Math.round(tvd), inc: Math.round(inc), azi: 0 });
            md += 500;
            if (md < 3000) { // Vertical section
                tvd += 500;
            } else if (md < 6000) { // Build section
                inc += 2; // Build 2 deg per 500ft approx
                tvd += 500 * Math.cos(inc * Math.PI / 180);
            } else { // Hold section
                tvd += 500 * Math.cos(inc * Math.PI / 180);
            }
        }
        return points;
    };

    const generateMockPPFG = () => {
        return [
            { tvd: 0, pp: 8.5, fg: 12.0 },
            { tvd: 2000, pp: 8.6, fg: 13.0 },
            { tvd: 4000, pp: 9.0, fg: 13.5 },
            { tvd: 6000, pp: 9.8, fg: 14.2 },
            { tvd: 8000, pp: 11.5, fg: 15.5 },
            { tvd: 10000, pp: 13.5, fg: 16.5 },
            { tvd: 12000, pp: 14.0, fg: 17.0 }
        ];
    };

    const generateMockTemp = () => {
        return [
            { tvd: 0, temp: 60 },
            { tvd: 6000, temp: 150 },
            { tvd: 12000, temp: 280 }
        ];
    };

    // -- Fetching --
    const fetchWells = useCallback(async () => {
        // Mocking well list for instant UI if DB is empty or slow
        try {
            // Fallback mock wells immediately for UI testing
            const mockWells = [
                { id: '1', name: 'Adalu-1', field: 'Unknown Field', location: 'Offshore' },
                { id: '2', name: 'Bravo-2', field: 'Permian', location: 'Onshore' }
            ];
            setWells(mockWells);
            if (!selectedWell) setSelectedWell(mockWells[0]);
            
            if (user) {
                const { data, error } = await supabase
                    .from('wells')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('name');
                
                if (data && data.length > 0) {
                    setWells(data);
                    if (!selectedWell) setSelectedWell(data[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching wells:', error);
        }
    }, [user, selectedWell]);

    const fetchCaseData = useCallback(async () => {
        if (!selectedWell) return;
        
        // Mock Loading Data
        addLog(`Loading environment for ${selectedWell.name}...`);
        
        // 1. Trajectory
        setWellTrajectory(generateMockTrajectory(selectedWell.id));

        // 2. PPFG & Temp
        setPpfgProfile(generateMockPPFG());
        setTempProfile(generateMockTemp());

        // 3. Load Cases (Phase 4 Updates: Added types for tubing analysis)
        if (loadCases.length === 0) {
            setLoadCases([
                { id: 1, name: 'Production - Base', type: 'Production', internal_fluid_density: 8.5, external_fluid_density: 9.0, surface_pressure: 200 },
                { id: 2, name: 'Injection - Max Rate', type: 'Injection', internal_fluid_density: 9.2, external_fluid_density: 9.0, surface_pressure: 3000 },
                { id: 3, name: 'Stimulation - Acid', type: 'Stimulation', internal_fluid_density: 9.5, external_fluid_density: 9.0, surface_pressure: 5000 },
                { id: 4, name: 'Kill - Bullhead', type: 'Kill', internal_fluid_density: 12.0, external_fluid_density: 9.0, surface_pressure: 1500 },
                { id: 5, name: 'Drilling Liner', type: 'Drilling', internal_fluid_density: 12.5, surface_pressure: 0, external_profile: 'Pore Pressure' }
            ]);
        }
        
        // 4. Design Cases (Mock if empty)
        if (designCases.length === 0) {
            setDesignCases([
                { id: 'dc1', scheme_name: 'Base Case - Production', created_at: new Date().toISOString() },
                { id: 'dc2', scheme_name: 'Contingency Liner', created_at: new Date().toISOString() }
            ]);
            if (!selectedDesignCase) setSelectedDesignCase({ id: 'dc1', scheme_name: 'Base Case - Production' });
        }

        // 5. Mock Casing Strings if empty
        if (casingStrings.length === 0) {
            setCasingStrings([
                {
                    id: 'str1',
                    name: 'Surface Casing',
                    top_depth: 0,
                    bottom_depth: 500,
                    od: '20',
                    weight: 94,
                    grade: 'K-55',
                    status: 'Active',
                    connection: 'API',
                    sections: [
                        { id: 'sec1', name: 'Surf-1', top_depth: 0, bottom_depth: 500, od: '20', weight: 94, grade: 'K-55', api_burst: 3000, api_collapse: 1500, yield_strength: 500000 }
                    ]
                },
                {
                    id: 'str2',
                    name: 'Intermediate Casing',
                    top_depth: 0,
                    bottom_depth: 2000,
                    od: '13.375',
                    weight: 68,
                    grade: 'N-80',
                    status: 'Active',
                    connection: 'API',
                    sections: [
                        { id: 'sec2', name: 'Inter-1', top_depth: 0, bottom_depth: 2000, od: '13.375', weight: 68, grade: 'N-80', api_burst: 5000, api_collapse: 3500, yield_strength: 800000 }
                    ]
                },
                {
                    id: 'str3',
                    name: 'Production Casing',
                    top_depth: 0,
                    bottom_depth: 3500,
                    od: '9.625',
                    weight: 47,
                    grade: 'P-110',
                    status: 'Active',
                    connection: 'API',
                    sections: [
                        { id: 'sec3', name: 'Prod-1', top_depth: 0, bottom_depth: 3500, od: '9.625', weight: 47, grade: 'P-110', api_burst: 9000, api_collapse: 7000, yield_strength: 1000000 }
                    ]
                }
            ]);
        }

        // 6. Mock Tubing Strings if empty (Phase 3/4)
        if (tubingStrings.length === 0) {
            setTubingStrings([
                {
                    id: 101,
                    name: 'Production Tubing',
                    top_depth: 0,
                    bottom_depth: 3500,
                    od: '3.5',
                    weight: 9.3,
                    grade: 'L-80',
                    status: 'Active',
                    connection: 'VAM Top',
                    sections: [
                        { id: 'tsec1', name: 'Upper Section', top_depth: 0, bottom_depth: 1000, od: '3.5', id_nom: '2.992', weight: 9.3, grade: 'L-80', api_burst: 10000, api_collapse: 9500, yield_strength: 150000 },
                        { id: 'tsec2', name: 'Lower Section', top_depth: 1000, bottom_depth: 3500, od: '3.5', id_nom: '2.992', weight: 12.7, grade: 'P-110', api_burst: 12000, api_collapse: 11000, yield_strength: 180000 }
                    ],
                    components: [
                        { id: 'comp1', type: 'Safety Valve (SSSV)', depth: 150, od: '4.5', status: 'Active', description: 'Surface controlled' },
                        { id: 'comp2', type: 'Packer', depth: 3400, od: '7.0', status: 'Active', description: 'Permanent production packer' }
                    ]
                }
            ]);
        }

        addLog(`Data loaded successfully.`);

    }, [selectedWell]);

    // -- Effects --
    useEffect(() => {
        fetchWells();
    }, [fetchWells]);

    useEffect(() => {
        if (selectedWell) fetchCaseData();
    }, [fetchCaseData, selectedWell]);

    // -- Actions --
    const createDesignCase = (name) => {
        const newCase = { id: `new-${Date.now()}`, scheme_name: name, created_at: new Date().toISOString() };
        setDesignCases([newCase, ...designCases]);
        setSelectedDesignCase(newCase);
        toast({ title: 'Success', description: 'New design case created.' });
        addLog(`Created design case: ${name}`);
    };

    const updateSafetyFactors = (newFactors) => {
        setSafetyFactors(newFactors);
        addLog('Safety Factors updated.');
    };

    const saveLoadCase = (loadCase) => {
        if (loadCase.id) {
            setLoadCases(prev => prev.map(lc => lc.id === loadCase.id ? loadCase : lc));
            toast({ title: 'Updated', description: 'Load case updated.' });
        } else {
            const newCase = { ...loadCase, id: Date.now() };
            setLoadCases(prev => [...prev, newCase]);
            toast({ title: 'Created', description: 'Load case added.' });
        }
    };

    const deleteLoadCase = (id) => {
        setLoadCases(prev => prev.filter(lc => lc.id !== id));
        toast({ title: 'Deleted', description: 'Load case removed.' });
    };

    return (
        <CasingTubingDesignContext.Provider value={{
            wells,
            selectedWell,
            setSelectedWell,
            designCases,
            selectedDesignCase,
            setSelectedDesignCase,
            activeTab,
            setActiveTab,
            
            // Engineering Data
            wellTrajectory,
            setWellTrajectory,
            ppfgProfile,
            setPpfgProfile,
            tempProfile,
            setTempProfile,
            loadCases,
            saveLoadCase,
            deleteLoadCase,
            casingStrings,
            setCasingStrings,
            tubingStrings,
            setTubingStrings,
            packerConfig,
            setPackerConfig,
            
            catalog,
            
            // Settings
            safetyFactors,
            setSafetyFactors: updateSafetyFactors,
            results,
            logs,
            warnings,
            createDesignCase,
            addLog,
            addWarning,
            
            // UX State
            isHelpOpen,
            toggleHelp
        }}>
            {children}
        </CasingTubingDesignContext.Provider>
    );
};

export const useCasingTubingDesign = () => {
    const context = useContext(CasingTubingDesignContext);
    if (!context) {
        throw new Error('useCasingTubingDesign must be used within a CasingTubingDesignProvider');
    }
    return context;
};