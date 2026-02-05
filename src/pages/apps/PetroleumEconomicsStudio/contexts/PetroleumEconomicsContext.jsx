import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { calculateEconomics } from '@/utils/petroleumEconomicsEngine';
import { generateDemoData } from '@/data/petroleumEconomicsDemoData';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const PetroleumEconomicsContext = createContext();

export const PetroleumEconomicsProvider = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate(); 
  
  const [currentProject, setCurrentProject] = useState(null);
  const [currentModel, setCurrentModel] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [activeScenario, setActiveScenario] = useState(null);
  
  // Status States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [economicsStatus, setEconomicsStatus] = useState('not_run'); 
  const [lastRunTime, setLastRunTime] = useState(null);

  // --- Inputs State ---
  const [modelSettings, setModelSettings] = useState({
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear() + 20,
      frequency: 'annual',
      currency: 'USD',
      discountRate: 0.1,
      inflationRate: 0.02,
      inflationEnabled: true,
      priceDeckType: 'flat'
  });

  const [streams, setStreams] = useState([
      { id: 'oil', name: 'Oil', active: true },
      { id: 'gas', name: 'Gas', active: true },
      { id: 'condensate', name: 'Condensate', active: false },
  ]);

  const [productionData, setProductionData] = useState([]); 
  const [costData, setCostData] = useState({ capexProfile: [], opexProfile: [] }); 
  const [assumptions, setAssumptions] = useState({
      workingInterest: 100,
      netRevenueInterest: 85,
      taxRate: 35,
      royaltyRate: 12.5,
      uptime: 95
  });

  const [fiscalTerms, setFiscalTerms] = useState(null);
  const [priceAssumptions, setPriceAssumptions] = useState({
      oilPrice: 70, 
      gasPrice: 3.5, 
      escalation: 0.02
  });

  const [validationIssues, setValidationIssues] = useState([]);
  const [calculationResults, setCalculationResults] = useState(null);
  const [comparisonData, setComparisonData] = useState({}); 
  const [auditLogs, setAuditLogs] = useState([]);
  const [scenarioNotes, setScenarioNotes] = useState({});
  const [fdpSnapshots, setFdpSnapshots] = useState([]);
  const [afeBudgets, setAfeBudgets] = useState([]);
  const [sensitivityResults, setSensitivityResults] = useState(null);
  const [importedData, setImportedData] = useState(null);

  // History for Undo/Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveTimeoutRef = useRef(null);

  // --- Snapshot History Logic ---
  const takeSnapshot = useCallback(() => {
      const snapshot = {
          modelSettings,
          productionData,
          costData,
          assumptions,
          fiscalTerms,
          priceAssumptions
      };
      
      // If we are in the middle of history stack, truncate future
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(snapshot);
      
      // Limit history size
      if (newHistory.length > 20) newHistory.shift();
      
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
  }, [modelSettings, productionData, costData, assumptions, fiscalTerms, priceAssumptions, history, historyIndex]);

  const undo = useCallback(() => {
      if (historyIndex > 0) {
          const prevSnapshot = history[historyIndex - 1];
          setHistoryIndex(historyIndex - 1);
          // Restore state
          setModelSettings(prevSnapshot.modelSettings);
          setProductionData(prevSnapshot.productionData);
          setCostData(prevSnapshot.costData);
          setAssumptions(prevSnapshot.assumptions);
          setFiscalTerms(prevSnapshot.fiscalTerms);
          setPriceAssumptions(prevSnapshot.priceAssumptions);
          toast({ title: "Undone", description: "Reverted to previous state." });
      }
  }, [history, historyIndex, toast]);

  const redo = useCallback(() => {
      if (historyIndex < history.length - 1) {
          const nextSnapshot = history[historyIndex + 1];
          setHistoryIndex(historyIndex + 1);
          // Restore state
          setModelSettings(nextSnapshot.modelSettings);
          setProductionData(nextSnapshot.productionData);
          setCostData(nextSnapshot.costData);
          setAssumptions(nextSnapshot.assumptions);
          setFiscalTerms(nextSnapshot.fiscalTerms);
          setPriceAssumptions(nextSnapshot.priceAssumptions);
          toast({ title: "Redone", description: "Restored state." });
      }
  }, [history, historyIndex, toast]);

  // Hook into setProductionData etc. to take snapshots occasionally?
  // For simplicity, we manually call takeSnapshot on major actions like "Run" or "Load Demo"
  // Or expose takeSnapshot to UI components to call onBlur

  // --- Calculate Progress ---
  const progress = useMemo(() => {
      return {
          setup: !!modelSettings.startYear,
          inputs: productionData.length > 0 && costData.capexProfile?.length > 0,
          ready: fiscalTerms !== null && priceAssumptions.oilPrice > 0,
          results: economicsStatus === 'complete'
      };
  }, [modelSettings, productionData, costData, fiscalTerms, priceAssumptions, economicsStatus]);


  // --- Fetching Logic (Same as before) ---
  const fetchScenarioDetails = useCallback(async (scenarioId) => {
    if (!scenarioId) return;
    try {
        const { data: inputs, error: inputError } = await supabase.from('econ_inputs').select('*').eq('scenario_id', scenarioId);
        if (inputError) throw inputError;

        if (inputs && inputs.length > 0) {
            inputs.forEach(item => {
                if (item.input_key === 'modelSettings' && item.input_json) setModelSettings(item.input_json);
                if (item.input_key === 'productionData' && item.input_json) setProductionData(item.input_json);
                if (item.input_key === 'costData' && item.input_json) setCostData(item.input_json);
                if (item.input_key === 'assumptions' && item.input_json) setAssumptions(item.input_json);
                if (item.input_key === 'priceAssumptions' && item.input_json) setPriceAssumptions(item.input_json);
                if (item.input_key === 'streams' && item.input_json) setStreams(item.input_json);
            });
        }
        
        const { data: fiscal, error: fiscalError } = await supabase.from('econ_fiscal_terms').select('*').eq('scenario_id', scenarioId).single();
        if (!fiscalError && fiscal) setFiscalTerms(fiscal.terms_json);
        else setFiscalTerms({ template_type: 'royalty_tax', royalty_rate: 12.5, tax_rate: 30 });

        // Take initial snapshot
        // We delay slightly to ensure state update propagates
        setTimeout(() => {
             // takeSnapshot(); // Logic circular dependency if we use the state directly here
             // Simplification: handled by component useEffect or manual call
        }, 500);

    } catch (err) {
        console.error("Error fetching scenario:", err);
    }
  }, []);

  const fetchModelDetails = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    try {
        const { data: model } = await supabase.from('econ_models_v2').select('*').eq('id', id).single();
        setCurrentModel(model);
        if (model?.project_id) {
             const { data: proj } = await supabase.from('econ_projects').select('*').eq('id', model.project_id).single();
             if (proj) setCurrentProject(proj);
        }
        const { data: scen } = await supabase.from('econ_scenarios_v2').select('*').eq('model_id', id).order('created_at', { ascending: true });
        setScenarios(scen || []);
        if (scen && scen.length > 0) {
            const base = scen.find(s => s.is_base_scenario) || scen[0];
            setActiveScenario(base);
            await fetchScenarioDetails(base.id);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  }, [fetchScenarioDetails]);

  // --- Saving & Running ---
  const saveInputs = useCallback(async () => {
      if (!activeScenario || activeScenario.is_locked) return;
      try {
          const inputPayloads = [
              { scenario_id: activeScenario.id, input_key: 'modelSettings', input_json: modelSettings },
              { scenario_id: activeScenario.id, input_key: 'productionData', input_json: productionData },
              { scenario_id: activeScenario.id, input_key: 'costData', input_json: costData },
              { scenario_id: activeScenario.id, input_key: 'assumptions', input_json: assumptions },
              { scenario_id: activeScenario.id, input_key: 'priceAssumptions', input_json: priceAssumptions },
              { scenario_id: activeScenario.id, input_key: 'streams', input_json: streams },
          ];
          await supabase.from('econ_inputs').upsert(inputPayloads, { onConflict: 'scenario_id, input_key' });
          if (fiscalTerms) {
              await supabase.from('econ_fiscal_terms').upsert({
                  scenario_id: activeScenario.id,
                  fiscal_regime: fiscalTerms.template_type,
                  terms_json: fiscalTerms
              }, { onConflict: 'scenario_id' });
          }
      } catch (err) {
          console.error(err);
      }
  }, [activeScenario, modelSettings, productionData, costData, assumptions, priceAssumptions, streams, fiscalTerms]);

  const runEconomics = useCallback(async (autoNavigate = true) => {
      if (!activeScenario) {
          toast({ variant: 'destructive', title: "No Scenario", description: "Select a scenario first." });
          return;
      }
      setEconomicsStatus('running');
      setCalculating(true);
      takeSnapshot(); // Snapshot before running
      await saveInputs();

      setTimeout(async () => {
          try {
              const inputs = { modelSettings, productionData, costData, fiscalTerms, priceAssumptions, assumptions, streams };
              const results = calculateEconomics(inputs);
              setCalculationResults(results);
              // Mock save results to DB
              setEconomicsStatus('complete');
              setLastRunTime(new Date());
              toast({ title: "Calculation Complete", description: "Results updated." });
          } catch (err) {
              console.error(err);
              setEconomicsStatus('not_run');
              toast({ variant: 'destructive', title: "Calculation Failed", description: "Check inputs." });
          } finally {
              setCalculating(false);
          }
      }, 800);
  }, [activeScenario, saveInputs, modelSettings, productionData, costData, fiscalTerms, priceAssumptions, assumptions, streams, toast, takeSnapshot]);

  // Auto-save
  useEffect(() => {
      if (activeScenario && !activeScenario.is_locked && !loading) {
          if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
          saveTimeoutRef.current = setTimeout(() => {
              setSaving(true);
              saveInputs().finally(() => setSaving(false));
          }, 3000); 
      }
      return () => clearTimeout(saveTimeoutRef.current);
  }, [modelSettings, productionData, costData, fiscalTerms, priceAssumptions, assumptions, streams, activeScenario, saveInputs, loading]);

  // --- Other Actions ---
  const loadDemoModel = useCallback(async (type) => {
      if (!currentModel) return;
      setLoading(true);
      const demoData = generateDemoData(type, new Date().getFullYear());
      if (demoData) {
          setModelSettings(demoData.modelSettings);
          setStreams(demoData.streams);
          setProductionData(demoData.productionData);
          setCostData(demoData.costData);
          setAssumptions(demoData.assumptions);
          setPriceAssumptions(demoData.priceAssumptions);
          setFiscalTerms(demoData.fiscalTerms);
          
          setTimeout(async () => {
              await saveInputs();
              takeSnapshot();
              setLoading(false);
              toast({ title: "Template Loaded", description: `${type} data loaded.` });
              runEconomics(false); 
          }, 500);
      }
  }, [currentModel, runEconomics, saveInputs, toast, takeSnapshot]);

  const updateAssumptions = (newAssumptions) => {
      setAssumptions(prev => ({ ...prev, ...newAssumptions }));
  };

  const createScenario = useCallback(async (name, description) => {
      if (!currentModel) return;
      setLoading(true);
      try {
          const { data: scenario, error } = await supabase.from('econ_scenarios_v2').insert({
              model_id: currentModel.id,
              name: name,
              description: description,
              is_base_scenario: false,
              status: 'draft',
              created_by: user?.id
          }).select().single();
          if (error) throw error;
          setScenarios(prev => [...prev, scenario]);
          setActiveScenario(scenario);
          toast({ title: "Scenario Created", description: `${name} active.` });
      } catch (err) {
          toast({ variant: "destructive", title: "Error", description: err.message });
      } finally {
          setLoading(false);
      }
  }, [currentModel, user, toast]);

  const fetchComparisonResults = useCallback(async (scenarioIds) => {
      // Mock comparison data fetching
      const mock = {};
      scenarioIds.forEach(id => mock[id] = []); // Should fetch real result rows
      setComparisonData(mock);
  }, []);

  const value = useMemo(() => ({
      currentProject, currentModel, scenarios, activeScenario, setActiveScenario,
      loading, saving, calculating, economicsStatus, lastRunTime,
      modelSettings, setModelSettings, streams, setStreams,
      productionData, setProductionData, costData, setCostData,
      assumptions, setAssumptions, fiscalTerms, setFiscalTerms,
      priceAssumptions, setPriceAssumptions,
      validationIssues, setValidationIssues,
      calculationResults, setCalculationResults,
      comparisonData, setComparisonData,
      auditLogs, setAuditLogs,
      scenarioNotes, setScenarioNotes,
      fdpSnapshots, setFdpSnapshots,
      afeBudgets, setAfeBudgets,
      sensitivityResults, setSensitivityResults,
      importedData, setImportedData,
      
      progress,
      history, historyIndex, undo, redo, takeSnapshot,

      createScenario,
      loadDemoModel,
      fetchModelDetails,
      runEconomics,
      updateAssumptions,
      saveFiscalTerms: async () => true, // Stub
      calculateSensitivity: async () => ({ baseNPV: 100, analysisData: [] }), // Stub
      calculateIncrementalMetrics: () => ({}), // Stub
      fetchComparisonResults,
      sendToFDP: async () => {}, sendToAFE: async () => {},
      fetchFDPSnapshots: async () => {}, fetchAFEBudgets: async () => {},
      parseImportedData: async (f) => [],
      calculateReconciliation: () => ({ rows: [], stats: { rate: 0 } })
  }), [
      currentProject, currentModel, scenarios, activeScenario, loading, saving, calculating, economicsStatus, lastRunTime,
      modelSettings, streams, productionData, costData, assumptions, fiscalTerms, priceAssumptions,
      validationIssues, calculationResults, comparisonData, auditLogs, scenarioNotes, fdpSnapshots,
      afeBudgets, sensitivityResults, importedData, progress, history, historyIndex, undo, redo, takeSnapshot,
      createScenario, loadDemoModel, fetchModelDetails, runEconomics, fetchComparisonResults
  ]);

  return (
    <PetroleumEconomicsContext.Provider value={value}>
      {children}
    </PetroleumEconomicsContext.Provider>
  );
};

export const usePetroleumEconomics = () => {
  const context = useContext(PetroleumEconomicsContext);
  if (!context) throw new Error('usePetroleumEconomics must be used within an PetroleumEconomicsProvider');
  return context;
};