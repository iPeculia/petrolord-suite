import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import InputPanel from '@/components/crossplot/InputPanel';
import ResultsPanel from '@/components/crossplot/ResultsPanel';
import { computePlotData, downloadCSV } from '@/utils/crossplotCalculations';
import { supabase } from '@/lib/customSupabaseClient';
import { BarChart2 } from 'lucide-react';

const STORAGE_KEY = 'crossplot_generator_params';

const CrossplotView = ({ selectedWell, selectedLog }) => {
  const [state, setState] = useState({
    logData: null,
    fileName: null,
    depthCol: 'DEPTH',
    curves: [],
    mdMin: 0,
    mdMax: 0,
    curveMap: { depth: 'DEPTH', gr: '', rhob: '', nphi: '', dt: '', rt: '', phi: '' },
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
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedParams = localStorage.getItem(STORAGE_KEY);
      if (savedParams) {
        const parsed = JSON.parse(savedParams);
        setState(prev => ({ ...prev, params: { ...prev.params, ...parsed } }));
      }
    } catch (e) {
      console.error("Failed to load params from localStorage", e);
    }
  }, []);

  const handleStateChange = (key, value) => {
    setState(prev => {
      const newState = { ...prev, [key]: value };
      if (key === 'params') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      }
      return newState;
    });
  };

  const fetchLogData = useCallback(async (logId) => {
    setLoading(true);
    setState(prev => ({ ...prev, results: null, logData: null, fileName: 'Loading...' }));
    
    try {
        const { data: logAsset, error: assetError } = await supabase.from('ss_assets').select('name, uri').eq('id', logId).single();
        if (assetError) throw assetError;

        const { data: fileData, error: downloadError } = await supabase.storage.from('ss-assets').download(logAsset.uri);
        if(downloadError) throw downloadError;

        const textData = await fileData.text();
        const lines = textData.split('\n');
        
        let curveStartIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().toUpperCase().startsWith('~C')) {
                curveStartIndex = i + 1;
                break;
            }
        }
        if (curveStartIndex === -1) throw new Error("Curve definition section (~C) not found.");

        let dataStartIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().toUpperCase().startsWith('~A')) {
                dataStartIndex = i + 1;
                break;
            }
        }
        if (dataStartIndex === -1) throw new Error("Data section (~A) not found.");

        const curveLines = [];
        for (let i = curveStartIndex; i < lines.length; i++) {
            if (lines[i].trim().startsWith('~')) break;
            if (lines[i].trim() && !lines[i].trim().startsWith('#')) {
                curveLines.push(lines[i]);
            }
        }
        
        const curves = curveLines.map(line => line.split('.')[0].trim().split(/\s+/)[0]);
        const logData = lines.slice(dataStartIndex)
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'))
            .map(line => {
                const values = line.split(/\s+/).map(Number);
                const row = {};
                curves.forEach((curve, index) => {
                    row[curve] = values[index];
                });
                return row;
            });

        const depthCol = curves[0] || 'DEPTH';
        const depthValues = logData.map(r => r[depthCol]).filter(v => v !== null && !isNaN(v));
        const mdMin = Math.min(...depthValues);
        const mdMax = Math.max(...depthValues);

        const autoMap = {
            depth: depthCol,
            gr: curves.find(c => c.toUpperCase().includes('GR')) || '',
            rhob: curves.find(c => c.toUpperCase().includes('RHOB') || c.toUpperCase().includes('DENS')) || '',
            nphi: curves.find(c => c.toUpperCase().includes('NPHI')) || '',
            rt: curves.find(c => c.toUpperCase().includes('RT') || c.toUpperCase().includes('RESD')) || '',
            dt: curves.find(c => c.toUpperCase().includes('DT')) || '',
            phi: curves.find(c => c.toUpperCase().includes('PHI')) || '',
        };

      setState(prev => ({
        ...prev,
        logData,
        curves,
        depthCol,
        mdMin,
        mdMax,
        curveMap: autoMap,
        fileName: logAsset.name,
        filter: { ...prev.filter, md_min: mdMin, md_max: mdMax },
      }));
      toast({ title: 'Log Loaded', description: `${logAsset.name} is ready.` });
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to Load Log', description: error.message, variant: 'destructive' });
      setState(prev => ({ ...prev, fileName: null }));
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    if (selectedLog) {
      fetchLogData(selectedLog.id);
    } else {
        setState(prev => ({...prev, logData: null, results: null, fileName: null}));
    }
  }, [selectedLog, fetchLogData]);

  const handleCompute = useCallback(async () => {
    if (!state.logData) {
        toast({ title: 'No Log Data', description: 'Please select a log to compute.', variant: 'destructive' });
        return;
    }
    setLoading(true);
    try {
      const { plot_data, layout, point_count, applied_filters, filteredData } = computePlotData(state);
      handleStateChange('results', { plot_data, layout, point_count, applied_filters });
      handleStateChange('filteredDataForDownload', filteredData);
      toast({ title: 'Plot Generated', description: 'Crossplot is ready for review.' });
    } catch (error) {
      console.error("Compute Error:", error);
      toast({ title: 'Plot Computation Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [state, toast]);

  const handleDownload = useCallback(async () => {
    if (!state.filteredDataForDownload) {
      toast({ title: 'No Data to Download', description: 'Please compute a plot first.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      downloadCSV(state.filteredDataForDownload, `filtered_data_${state.fileName}.csv`);
      toast({ title: 'Download Started' });
    } catch (error) {
      toast({ title: 'Download Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [state.filteredDataForDownload, state.fileName, toast]);
  
  const handleFakeFileUpload = () => {
      toast({ title: "Action Not Available", description: "Please select a log from the project tree on the left."});
  };

  if (!selectedWell && !selectedLog) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 text-slate-400">
        <BarChart2 className="w-16 h-16 mb-4 text-slate-500" />
        <h2 className="text-2xl font-bold text-slate-300">Crossplot</h2>
        <p>Select a well (or a log) to begin.</p>
      </div>
    );
  }
  
  if (!state.logData && selectedLog) {
     return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-400 mx-auto"></div>
              <p className="text-white mt-4 text-lg">Loading Log Data...</p>
            </div>
        </div>
     );
  }

  return (
    <div className="flex h-full bg-slate-950 text-white">
      <div className="w-full md:w-2/5 xl:w-1/3 p-4 sm:p-6 bg-slate-900/50 backdrop-blur-lg border-r border-white/10 overflow-y-auto">
        <InputPanel
          state={state}
          onStateChange={handleStateChange}
          onFileUpload={handleFakeFileUpload}
          onCompute={handleCompute}
          loading={loading}
        />
      </div>
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {!state.results && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 text-slate-400">
              <BarChart2 className="w-16 h-16 mb-4 text-slate-500" />
              <h2 className="text-xl font-bold text-slate-300">Ready to Compute</h2>
              <p>Adjust parameters and click "Compute Plot" to generate the crossplot.</p>
          </div>
        )}
        {loading && !state.results && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-400 mx-auto"></div>
              <p className="text-white mt-4 text-lg">Processing...</p>
              <p className="text-lime-300">Please wait while the magic happens.</p>
            </div>
          </div>
        )}
        {state.results && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <ResultsPanel results={state.results} onDownload={handleDownload} loading={loading} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CrossplotView;