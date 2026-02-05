import { useState, useCallback } from 'react';
import { parseLAS, autoMapCurves, calculateVshale, calculatePorosityDensity, calculatePorositySonic, calculatePorosityND, calculateSwArchie, calculateSwSimandoux, calculateSwIndonesian, calculateSwWaxmanSmits, calculatePermTimur, calculatePermCoates, calculatePermWyllieRose, determineLithology, determineFluid, runMonteCarloSimulation } from '@/utils/petrophysicsCalculations';
import { supabase } from '@/lib/customSupabaseClient';

export const usePetrophysics = (toast) => {
  const [state, setState] = useState({
    projectId: null,
    projectName: "New Project",
    wells: [],
    activeWellId: null,
    loading: false,
    correlationMode: false,
    selectedWellsForCorrelation: [],
    markers: [],
    selectedInterval: null,
    correlationLines: [],
    flattenMarker: null,
    results: null,
    probabilisticResults: null,
    qcReport: null
  });

  const createProject = useCallback(async (name, description) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('petrophysics_projects')
        .insert({ name, description, user_id: user.id })
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({ ...prev, projectId: data.id, projectName: data.name, wells: [] }));
      toast({ title: "Project Created", description: `Project "${data.name}" is ready.` });
      return data.id;
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to create project.", variant: "destructive" });
      return null;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [toast]);

  const addWellFromLAS = useCallback(async (file, projectId) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const text = await file.text();
      const parsed = parseLAS(text);
      
      if (!parsed.data || parsed.data.length === 0) throw new Error("No data found in LAS file");

      const wellName = parsed.wellParams['WELL']?.value || file.name.replace('.las', '');
      const api = parsed.wellParams['API']?.value || '';
      const mapped = autoMapCurves(parsed.curves);
      const depthCurve = mapped.DEPTH || parsed.curves[0].mnemonic;
      const depths = parsed.data.map(d => d[depthCurve]).filter(d => d !== null);
      const minDepth = Math.min(...depths);
      const maxDepth = Math.max(...depths);
      const step = depths.length > 1 ? Math.abs(depths[1] - depths[0]) : 0;

      let wellId = null;
      if (projectId) {
        const { data: wellData, error: wellError } = await supabase
          .from('petrophysics_wells')
          .insert({
            project_id: projectId,
            name: wellName,
            api_number: api,
            min_depth: minDepth,
            max_depth: maxDepth,
            step: step,
            curve_aliases: mapped,
            las_header: parsed.wellParams
          })
          .select().single();
        if (wellError) throw wellError;
        wellId = wellData.id;
        toast({ title: "Well Saved", description: `${wellName} uploaded.` });
      } else {
        wellId = crypto.randomUUID();
        toast({ title: "Well Parsed", description: `${wellName} loaded locally.` });
      }

      const newWell = {
        id: wellId,
        name: wellName,
        api: api,
        header: parsed.wellParams,
        curves: parsed.curves,
        data: parsed.data,
        curveMap: { ...mapped, DEPTH: depthCurve },
        depthRange: { min: minDepth, max: maxDepth },
        statistics: { count: parsed.data.length, step }
      };

      setState(prev => ({ ...prev, wells: [...prev.wells, newWell], activeWellId: wellId, loading: false }));
    } catch (error) {
      console.error(error);
      toast({ title: "Import Failed", description: error.message, variant: "destructive" });
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [toast]);

  const deleteWell = useCallback(async (wellId) => {
    if (state.projectId) {
       const { error } = await supabase.from('petrophysics_wells').delete().eq('id', wellId);
       if (error) {
         toast({ title: "Error", description: "Failed to delete well", variant: "destructive" });
         return;
       }
    }
    setState(prev => {
        const newWells = prev.wells.filter(w => w.id !== wellId);
        return { ...prev, wells: newWells, activeWellId: newWells.length > 0 ? newWells[0].id : null };
    });
    toast({ title: "Well Removed", description: "Well removed from project." });
  }, [state.projectId, toast]);

  const setActiveWell = (id) => {
      setState(prev => ({ ...prev, activeWellId: id, selectedInterval: null, qcReport: null }));
      fetchMarkers(id); 
  };

  const runCalculations = useCallback((params) => {
      const activeWell = state.wells.find(w => w.id === state.activeWellId);
      if (!activeWell) {
          toast({ title: "No Well Selected", description: "Please select a well first.", variant: "destructive" });
          return;
      }
      setState(prev => ({ ...prev, loading: true }));
      const grKey = activeWell.curveMap['GR'];
      const rhobKey = activeWell.curveMap['RHOB'];
      const nphiKey = activeWell.curveMap['NPHI'];
      const dtKey = activeWell.curveMap['DT'];

      const updatedData = activeWell.data.map(row => {
          const newRow = { ...row };
          if (params.calculateVsh && grKey) newRow['VSH'] = calculateVshale(row[grKey], params.grClean, params.grShale, params.vshMethod);
          if (params.calculatePhi) {
              let phi = null;
              if (params.phiMethod === 'density' && rhobKey) phi = calculatePorosityDensity(row[rhobKey], params.rhoMatrix, params.rhoFluid);
              else if (params.phiMethod === 'sonic' && dtKey) phi = calculatePorositySonic(row[dtKey], params.dtMatrix, params.dtFluid);
              else if (params.phiMethod.startsWith('nd') && rhobKey && nphiKey) {
                  const phiD = calculatePorosityDensity(row[rhobKey], params.rhoMatrix, params.rhoFluid);
                  const phiN = row[nphiKey];
                  phi = calculatePorosityND(phiD, phiN, params.phiMethod === 'nd-rms' ? 'rms' : 'average');
              }
              newRow['PHIE'] = phi;
          }
          return newRow;
      });
      const updatedWell = { ...activeWell, data: updatedData, curveMap: { ...activeWell.curveMap, 'VSH': 'VSH', 'PHIE': 'PHIE' } };
      setState(prev => ({ ...prev, wells: prev.wells.map(w => w.id === state.activeWellId ? updatedWell : w), loading: false, results: true }));
      toast({ title: "Calculations Complete", description: "Curves VSH and PHIE generated." });
  }, [state.activeWellId, state.wells, toast]);

  const runSaturation = useCallback((model, params) => {
      const activeWell = state.wells.find(w => w.id === state.activeWellId);
      if (!activeWell) return;
      if (!activeWell.curveMap['PHIE']) {
          toast({ title: "Missing Porosity", description: "Run porosity calculation first.", variant: "destructive" });
          return;
      }
      setState(prev => ({ ...prev, loading: true }));
      const rtKey = activeWell.curveMap['RES_DEEP'];
      
      const updatedData = activeWell.data.map(row => {
          const newRow = { ...row };
          const rt = row[rtKey];
          const phi = row['PHIE']; 
          const vsh = row['VSH'] || 0;
          let sw = 1.0;
          if (rt !== null && phi !== null) {
              if (model === 'archie') sw = calculateSwArchie(rt, phi, params.rw, params.a, params.m, params.n);
              else if (model === 'simandoux') sw = calculateSwSimandoux(rt, phi, params.rw, vsh, params.rsh, params.a, params.m, params.n);
              else if (model === 'indonesian') sw = calculateSwIndonesian(rt, phi, params.rw, vsh, params.rsh, params.a, params.m, params.n);
              else if (model === 'waxman') sw = calculateSwWaxmanSmits(rt, phi, params.rw, params.temp, params.qv, params.m, params.n);
          }
          newRow['SW'] = sw;
          return newRow;
      });
      const updatedWell = { ...activeWell, data: updatedData, curveMap: { ...activeWell.curveMap, 'SW': 'SW' } };
      setState(prev => ({ ...prev, wells: prev.wells.map(w => w.id === state.activeWellId ? updatedWell : w), loading: false, results: true }));
      toast({ title: "Saturation Complete", description: `Sw calculated using ${model} model.` });
  }, [state.activeWellId, state.wells, toast]);

  const runPropertyEstimation = useCallback((permModel, params) => {
      const activeWell = state.wells.find(w => w.id === state.activeWellId);
      if (!activeWell) return;
      if (!activeWell.curveMap['PHIE'] || !activeWell.curveMap['SW']) {
          toast({ title: "Missing Inputs", description: "Phi and Sw required.", variant: "destructive" });
          return;
      }
      setState(prev => ({ ...prev, loading: true }));
      
      const rhobKey = activeWell.curveMap['RHOB'];
      const nphiKey = activeWell.curveMap['NPHI'];
      const pefKey = activeWell.curveMap['PEF'];

      const updatedData = activeWell.data.map(row => {
          const newRow = { ...row };
          const phi = row['PHIE'];
          const sw = row['SW'];
          const vsh = row['VSH'] || 0;
          const rhob = rhobKey ? row[rhobKey] : null;
          const nphi = nphiKey ? row[nphiKey] : null;
          const pef = pefKey ? row[pefKey] : null;

          let k = 0.01;
          const swi = params.useCalculatedSw ? sw : params.swIrr;
          if (phi && swi) {
             if (permModel === 'timur') k = calculatePermTimur(phi, swi);
             else if (permModel === 'coates') k = calculatePermCoates(phi, swi);
             else if (permModel === 'wyllie') k = calculatePermWyllieRose(phi, swi, params.wyllieP, params.wyllieQ, params.wyllieR);
             else if (permModel === 'tixier') k = calculatePermWyllieRose(phi, swi, 250, 3, 1); 
          }
          newRow['PERM'] = k;

          const lith = determineLithology(rhob, nphi, pef, vsh);
          newRow['LITH_CODE'] = lith.code; 

          const fluid = determineFluid(sw, phi, rhob, nphi, vsh);
          newRow['FLUID_CODE'] = fluid.code; 

          return newRow;
      });

      const updatedWell = { 
          ...activeWell, 
          data: updatedData, 
          curveMap: { 
              ...activeWell.curveMap, 
              'PERM': 'PERM', 
              'LITH_CODE': 'LITH_CODE',
              'FLUID_CODE': 'FLUID_CODE' 
          } 
      };

      setState(prev => ({ ...prev, wells: prev.wells.map(w => w.id === state.activeWellId ? updatedWell : w), loading: false, results: true }));
      toast({ title: "Estimation Complete", description: "Permeability, Lithology, and Fluid curves generated." });
  }, [state.activeWellId, state.wells, toast]);

  // Probabilistic Analysis (Build 9)
  const runProbabilisticAnalysis = useCallback(async (inputs, iterations) => {
      setState(prev => ({ ...prev, loading: true }));
      
      // Simulate calculation delay
      await new Promise(r => setTimeout(r, 500));

      try {
          const results = runMonteCarloSimulation(inputs, iterations);
          setState(prev => ({ ...prev, loading: false, probabilisticResults: { ...results, fluidType: inputs.fluidType } }));
          
          // Optional: Save to DB
          if (state.projectId) {
              await supabase.from('petrophysics_monte_carlo_runs').insert({
                  project_id: state.projectId,
                  well_id: state.activeWellId, // Optional
                  zone_name: "Probabilistic Run", // Could be input
                  iterations: iterations,
                  inputs: inputs,
                  results: { stats: results.stats, sensitivity: results.sensitivity } // Don't save full histogram to avoid payload limit if large
              });
          }
          
          toast({ title: "Monte Carlo Complete", description: "Probabilistic analysis finished successfully." });
      } catch (error) {
          console.error(error);
          setState(prev => ({ ...prev, loading: false }));
          toast({ title: "Simulation Failed", description: "Error running Monte Carlo.", variant: "destructive" });
      }
  }, [state.projectId, state.activeWellId, toast]);

  const saveCalculatedCurves = useCallback(async () => {
      const activeWell = state.wells.find(w => w.id === state.activeWellId);
      if (!activeWell || !state.projectId) {
          toast({ title: "Save Failed", description: "No active well or project not saved.", variant: "destructive" });
          return;
      }
      setState(prev => ({ ...prev, loading: true }));

      try {
          const resultsToSave = [];
          ['VSH', 'PHIE', 'SW', 'PERM', 'LITH_CODE', 'FLUID_CODE'].forEach(mnemonic => {
             if (activeWell.curveMap[mnemonic]) {
                  resultsToSave.push({
                      well_id: activeWell.id,
                      mnemonic: mnemonic,
                      unit: mnemonic === 'PERM' ? 'mD' : (mnemonic.includes('CODE') ? 'code' : 'v/v'),
                      description: `Calculated ${mnemonic}`,
                      data: activeWell.data.map(r => r[mnemonic])
                  });
             }
          });

          if (resultsToSave.length === 0) throw new Error("No calculated curves found.");
          const { error } = await supabase.from('petrophysics_curves').insert(resultsToSave); 
          if (error) throw error;
          toast({ title: "Results Saved", description: "All calculated curves stored." });
      } catch (error) {
          console.error(error);
          toast({ title: "Error", description: "Failed to save results.", variant: "destructive" });
      } finally {
          setState(prev => ({ ...prev, loading: false }));
      }
  }, [state.activeWellId, state.wells, state.projectId, toast]);

  const saveReserves = useCallback(async (reservesData) => {
      const activeWell = state.wells.find(w => w.id === state.activeWellId);
      if (!activeWell || !state.projectId) {
          toast({ title: "Save Failed", description: "No active well or project not saved.", variant: "destructive" });
          return;
      }
      setState(prev => ({ ...prev, loading: true }));

      try {
          const records = reservesData.map(r => ({
              well_id: activeWell.id,
              zone_name: r.name,
              top_depth: r.topDepth,
              base_depth: r.baseDepth,
              parameters: {
                  area: r.area,
                  bo: r.bo,
                  bg: r.bg,
                  rf: r.rf,
                  cutoffs: r.cutoffs,
                  fluidType: r.fluidType
              },
              results: {
                  stats: r.stats,
                  volumes: r.volumes
              }
          }));

          const { error } = await supabase.from('petrophysics_reserves').insert(records);
          if (error) throw error;
          toast({ title: "Reserves Saved", description: "Volumetric results stored in database." });
      } catch (error) {
          console.error(error);
          toast({ title: "Error", description: "Failed to save reserves.", variant: "destructive" });
      } finally {
          setState(prev => ({ ...prev, loading: false }));
      }
  }, [state.activeWellId, state.wells, state.projectId, toast]);

  const saveQCReport = useCallback(async (report) => {
      if (!state.projectId || !state.activeWellId) {
          toast({ title: "Save Failed", description: "No project or well loaded.", variant: "destructive" });
          return;
      }
      setState(prev => ({ ...prev, loading: true }));
      try {
          const { error } = await supabase.from('petrophysics_qc_reports').insert({
              project_id: state.projectId,
              well_id: state.activeWellId,
              score: report.score,
              flags: report.flags,
              stats: report.stats
          });
          if (error) throw error;
          toast({ title: "QC Report Saved", description: "Quality control analysis stored." });
          setState(prev => ({ ...prev, qcReport: report }));
      } catch (error) {
          console.error(error);
          toast({ title: "Error", description: "Failed to save report.", variant: "destructive" });
      } finally {
          setState(prev => ({ ...prev, loading: false }));
      }
  }, [state.projectId, state.activeWellId, toast]);

  // Helpers
  const toggleWellForCorrelation = (id) => {
      setState(prev => {
          const current = prev.selectedWellsForCorrelation;
          let newSelection = [];
          if (current.includes(id)) newSelection = current.filter(wid => wid !== id);
          else {
              if (current.length >= 4) return prev;
              newSelection = [...current, id];
          }
          fetchAllMarkers(newSelection, prev.projectId);
          return { ...prev, selectedWellsForCorrelation: newSelection };
      });
  };
  
  const updateCurveMap = useCallback((wellId, type, mnemonic) => {
      setState(prev => ({
          ...prev,
          wells: prev.wells.map(w => w.id === wellId ? { ...w, curveMap: { ...w.curveMap, [type]: mnemonic } } : w)
      }));
  }, []);

  const fetchMarkers = useCallback(async (wellId) => {
      if (!wellId || !state.projectId) return;
      const { data, error } = await supabase.from('petrophysics_markers').select('*').eq('well_id', wellId).order('depth', { ascending: true });
      if (!error) {
          setState(prev => {
            const otherMarkers = prev.markers.filter(m => m.well_id !== wellId);
            return { ...prev, markers: [...otherMarkers, ...data] };
          });
      }
  }, [state.projectId]);

  const fetchAllMarkers = useCallback(async (wellIds, projectId) => {
    if (!projectId || wellIds.length === 0) return;
    const { data, error } = await supabase.from('petrophysics_markers').select('*').in('well_id', wellIds).order('depth', { ascending: true });
    if (!error) setState(prev => ({ ...prev, markers: data }));
  }, []);

  const addMarker = useCallback(async (markerData) => {
      const targetWellId = markerData.well_id || state.activeWellId;
      if (!targetWellId) return;
      const newMarker = { well_id: targetWellId, name: markerData.name, depth: parseFloat(markerData.depth), type: markerData.type || 'Formation', color: markerData.color || '#FFD700' };
      if (state.projectId) {
          const { data } = await supabase.from('petrophysics_markers').insert(newMarker).select().single();
          if (data) setState(prev => ({ ...prev, markers: [...prev.markers, data].sort((a,b) => a.depth - b.depth) }));
      } else {
          setState(prev => ({ ...prev, markers: [...prev.markers, { ...newMarker, id: crypto.randomUUID() }].sort((a,b) => a.depth - b.depth) }));
      }
  }, [state.activeWellId, state.projectId]);

  const deleteMarker = useCallback(async (markerId) => {
      if (state.projectId) await supabase.from('petrophysics_markers').delete().eq('id', markerId);
      setState(prev => ({ ...prev, markers: prev.markers.filter(m => m.id !== markerId) }));
  }, [state.projectId]);

  const setSelectedInterval = (interval) => setState(prev => ({ ...prev, selectedInterval: interval }));
  const setFlattenMarker = (markerName) => setState(prev => ({ ...prev, flattenMarker: markerName }));
  
  const propagateMarker = async (sourceMarker) => {
      if (!state.projectId) return;
      const targetWells = state.selectedWellsForCorrelation.filter(wid => wid !== sourceMarker.well_id);
      if (targetWells.length === 0) return;
      await supabase.from('petrophysics_markers').update({ color: sourceMarker.color, type: sourceMarker.type }).eq('name', sourceMarker.name).in('well_id', targetWells);
      fetchAllMarkers(state.selectedWellsForCorrelation, state.projectId);
  };

  return {
    petroState: state,
    activeWell: state.wells.find(w => w.id === state.activeWellId) || null,
    createProject,
    addWellFromLAS,
    deleteWell,
    setActiveWell,
    toggleWellForCorrelation,
    updateCurveMap,
    addMarker,
    deleteMarker,
    setSelectedInterval,
    setFlattenMarker,
    propagateMarker,
    runCalculations,
    runSaturation,
    runPropertyEstimation,
    saveCalculatedCurves,
    saveReserves,
    runProbabilisticAnalysis,
    saveQCReport
  };
};