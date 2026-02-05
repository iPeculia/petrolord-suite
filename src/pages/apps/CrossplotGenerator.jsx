import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Save, FolderOpen, Share2, BarChart2, ArrowLeft, Activity, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import DataExchangeHub from '@/components/DataExchangeHub';
import InputPanel from '@/components/crossplot/InputPanel';
import ResultsPanel from '@/components/crossplot/ResultsPanel';
import EmptyState from '@/components/crossplot/EmptyState';
import { processFileUpload, computePlotData, downloadCSV, parseImportedData } from '@/utils/crossplotCalculations';

const STORAGE_KEY = 'crossplot_generator_params';

const CrossplotGenerator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [project, setProject] = useState({
    id: null,
    name: 'New Crossplot Project',
    description: ''
  });

  const [state, setState] = useState({
    logData: null,
    fileName: null,
    depthCol: '',
    curves: [],
    mdMin: 0,
    mdMax: 0,
    curveMap: { depth: '', gr: '', rhob: '', nphi: '', dt: '', rt: '', phi: '' },
    filter: { md_min: '', md_max: '', vsh_max: 0.6 },
    plotType: 'density_neutron',
    params: {
      dn: { nphi_scale: 'limestone', np_shift: 0, rhob_min: 1.9, rhob_max: 2.9, nphi_min: -0.15, nphi_max: 0.45 },
      poro: { rho_matrix: 2.65, rho_fluid: 1.0, enabled: false },
      pickett: { a: 1, m: 2, n: 2, Rw: 0.05, porosity_source: 'phi', sw_lines: [1, 0.5, 0.2], phi_min: 0.01, phi_max: 1, rt_min: 0.2, rt_max: 2000 },
      cluster: { k: 5, max_iter: 100, seed: 42, enabled: false },
    },
    results: null,
    filteredDataForDownload: null,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // === 1. Persistence Layer (Supabase) ===
  const handleSaveProject = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "You must be logged in to save projects.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        project_name: project.name,
        inputs_data: {
           ...state, 
           project_meta: { type: 'crossplot_generator', version: 1 } 
        },
        results_data: state.results || {},
        created_at: new Date().toISOString()
      };

      let error;
      if (project.id) {
        const res = await supabase.from('saved_petrophysics_projects').update(payload).eq('id', project.id);
        error = res.error;
      } else {
        const res = await supabase.from('saved_petrophysics_projects').insert([payload]).select().single();
        if (res.data) setProject(prev => ({ ...prev, id: res.data.id }));
        error = res.error;
      }

      if (error) throw error;
      toast({ title: "Project Saved", description: "Crossplot project saved successfully." });
    } catch (err) {
      toast({ title: "Save Failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // === 2. Unified Data Fabric Integration ===
  const handleDataImport = async (importedData) => {
    setLoading(true);
    try {
      // Handle different data shapes from other apps (Petrophysics Estimator, Log Facies, etc.)
      const processed = parseImportedData(importedData);
      if (processed) {
         setState(prev => ({
           ...prev,
           ...processed,
           // Preserve current view params unless overwritten
           filter: { ...prev.filter, md_min: processed.mdMin, md_max: processed.mdMax }
         }));
         toast({ title: "Data Imported", description: "Well data loaded from exchange hub." });
      } else {
         throw new Error("Incompatible data format");
      }
    } catch (err) {
      toast({ title: "Import Failed", description: "Could not map imported data to crossplot format.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // === 3. Logic ===
  const handleStateChange = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;
    setLoading(true);
    setState(prev => ({ ...prev, results: null, fileName: file.name }));

    try {
      const { logData, curves, depthCol, mdMin, mdMax, suggestedMap } = await processFileUpload(file);
      
      setState(prev => ({
        ...prev,
        logData,
        curves,
        depthCol,
        mdMin,
        mdMax,
        curveMap: suggestedMap,
        filter: { ...prev.filter, md_min: mdMin, md_max: mdMax },
      }));

      toast({ title: 'Upload Successful', description: `${file.name} is ready for plotting.` });
    } catch (error) {
      toast({ title: 'File Upload Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleCompute = useCallback(async () => {
    setLoading(true);
    // Use setTimeout to allow UI to render loading state before heavy calc
    setTimeout(() => {
      try {
        const { plot_data, layout, point_count, applied_filters, filteredData } = computePlotData(state);
        handleStateChange('results', { plot_data, layout, point_count, applied_filters });
        handleStateChange('filteredDataForDownload', filteredData);
        toast({ title: 'Plot Generated', description: 'Crossplot is ready for review.' });
      } catch (error) {
        toast({ title: 'Plot Computation Failed', description: error.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }, 100);
  }, [state, toast]);

  const handleDownload = useCallback(async () => {
    if (!state.filteredDataForDownload) {
      toast({ title: 'No Data to Download', description: 'Please compute a plot first.', variant: 'destructive' });
      return;
    }
    try {
      downloadCSV(state.filteredDataForDownload, `filtered_data_${state.fileName || 'export'}.csv`);
      toast({ title: 'Download Started' });
    } catch (error) {
      toast({ title: 'Download Failed', description: error.message, variant: 'destructive' });
    }
  }, [state.filteredDataForDownload, state.fileName, toast]);

  return (
    <>
      <Helmet>
        <title>Crossplot Generator - Petrolord Suite</title>
      </Helmet>
      <div className="flex flex-col h-screen bg-slate-950 text-white font-sans overflow-hidden">
        {/* App Header */}
        <header className="flex-none flex flex-col md:flex-row justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-10 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/geoscience')} className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
                <BarChart2 className="w-6 h-6 text-blue-500" />
                Crossplot Generator
              </h1>
              <p className="text-xs text-slate-400 hidden md:block">Advanced Petrophysical Visualization & Clustering</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <DataExchangeHub 
              mode="import" 
              onImport={handleDataImport} 
              categoryFilter="WELL_LOGS"
            />
            <DataExchangeHub 
              mode="export" 
              currentData={state.results} 
              currentAppName="Crossplot Generator"
              exportName={project.name}
              categoryFilter="CROSSPLOT_RESULTS"
            />
            <Button variant="outline" onClick={handleSaveProject} disabled={saving} className="border-slate-700 hover:bg-slate-800 whitespace-nowrap">
              {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin"/> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Panel: Inputs */}
          <div className="w-full lg:w-[400px] xl:w-[450px] bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-y-auto p-4 flex-shrink-0">
             <InputPanel
                state={state}
                project={project}
                setProject={setProject}
                onStateChange={handleStateChange}
                onFileUpload={handleFileUpload}
                onCompute={handleCompute}
                loading={loading}
             />
          </div>

          {/* Right Panel: Results */}
          <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col p-4">
             {!state.logData && !loading ? (
                <EmptyState onUploadClick={() => document.getElementById('file-upload-input')?.click()} />
             ) : (
                <div className="h-full rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur overflow-hidden shadow-2xl">
                   {loading && !state.results ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                         <Activity className="w-12 h-12 text-blue-500 animate-pulse mb-4" />
                         <p>Processing Data...</p>
                      </div>
                   ) : (
                      state.results && (
                        <ResultsPanel 
                           results={state.results} 
                           onDownload={handleDownload} 
                           loading={loading} 
                        />
                      )
                   )}
                </div>
             )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CrossplotGenerator;