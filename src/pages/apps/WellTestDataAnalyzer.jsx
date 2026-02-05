import React, { useState, useCallback, useEffect, useMemo } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/customSupabaseClient';
    import InputPanel from '@/components/welltestanalyzer/InputPanel';
    import ResultsPanel from '@/components/welltestanalyzer/ResultsPanel';
    import EmptyState from '@/components/welltestanalyzer/EmptyState';
    import QCPanel from '@/components/welltestanalyzer/QCPanel';
    import { generateWellTestData, applyBourdetSmoothing } from '@/utils/wellTestCalculations';
    import { v4 as uuidv4 } from 'uuid';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { ArrowLeft } from 'lucide-react';

    const WellTestDataAnalyzer = () => {
      const [currentProject, setCurrentProject] = useState(null);
      const [results, setResults] = useState(null);
      const [loading, setLoading] = useState(false);
      const [isSaving, setIsSaving] = useState(false);
      const [qcData, setQcData] = useState(null);
      const [smoothingLevel, setSmoothingLevel] = useState(0);
      const { toast } = useToast();
      const { user } = useAuth();
      const location = useLocation();
      const navigate = useNavigate();

      const defaultInputs = useMemo(() => ({
        projectName: "Field X Well Test Program",
        wellName: "Well A-1",
        testType: "Buildup",
        viscosity: 0.8,
        compressibility: 1.5e-5,
        fvf: 1.25,
        porosity: 0.18,
        thickness: 50,
        wellboreRadius: 0.3,
        initialPressure: 3500,
        isGasWell: false,
      }), []);

      const [inputs, setInputs] = useState(defaultInputs);

      const handleLoadProject = useCallback((project) => {
        if (!project || !project.inputs_data) {
          toast({ variant: "destructive", title: "Load Failed", description: "Invalid project data format." });
          return;
        }
        setCurrentProject(project);
        setInputs(project.inputs_data.inputs);
        setResults(project.results_data);
        setQcData(null);
        toast({ title: "Project Loaded", description: `Successfully loaded '${project.name}'.` });
      }, [toast]);
      
      useEffect(() => {
        if (location.state?.loadedProject) {
            handleLoadProject(location.state.loadedProject);
        }
      }, [location.state, handleLoadProject]);

      const handleAnalyze = async (analysisInputs, mappedData, model) => {
        setLoading(true);
        setResults(null);
        setSmoothingLevel(0);
        if (!qcData) setQcData(null);

        toast({
          title: "🚀 Analysis Initiated",
          description: "Processing data... Please wait.",
        });

        if (mappedData.length < 10) {
          toast({ variant: "destructive", title: "Analysis Failed", description: "Not enough data points for analysis." });
          setLoading(false);
          return;
        }

        let processedData = mappedData;
        if (processedData.length > 2000) {
          const step = Math.floor(processedData.length / 2000);
          processedData = processedData.filter((_, i) => i % step === 0);
          toast({ title: "Data Downsampled", description: `Dataset reduced to 2000 points for performance.` });
        }

        const runAnalysis = async (dataToAnalyze) => {
            toast({
              title: "Contacting Analysis Service...",
              description: "Fitting model to processed data.",
            });

            const runId = uuidv4();
            const payload = {
              run_id: runId, model: model || "homogeneous_wbs_skin",
              data: { t: dataToAnalyze.map(d => d.time), p: dataToAnalyze.map(d => d.pressure), q: dataToAnalyze.map(d => d.rate) },
              fluid: { mu: analysisInputs.viscosity, ct: analysisInputs.compressibility, Bo: analysisInputs.fvf },
              well: { rw: analysisInputs.wellboreRadius, h: analysisInputs.thickness, phi: analysisInputs.porosity },
              options: { max_iters: 200, time_budget_s: 10, bootstrap_samples: 50 },
            };

            try {
              const { data: functionResult, error } = await supabase.functions.invoke('pta_fit_basic', { body: JSON.stringify(payload) });

              if (error) throw new Error("The analysis service could not be reached.");
              if (!functionResult.ok) throw new Error(functionResult.error || "The analysis service returned an error.");
              
              const baseTestResults = generateWellTestData(analysisInputs, dataToAnalyze);

              const analysisResults = {
                runId: runId,
                kpis: {
                  permeability: functionResult.params.kh, skin: functionResult.params.skin, pi: functionResult.params.Pi,
                  wellboreStorage: functionResult.params.C, flowEfficiency: functionResult.params.eta, rmse: functionResult.metrics.rmse,
                  boundaryDistance: functionResult.intervals.boundary ? functionResult.intervals.boundary[0] : 'N/A',
                  confidence: functionResult.confidence || { kh: [null, null], skin: [null, null], Pi: [null, null]},
                },
                plotsData: {
                  ...baseTestResults.plotsData,
                  modelFit: functionResult.model_fit ? functionResult.model_fit.map(p => ({x: p.t, y: p.p_der})) : baseTestResults.plotsData.modelFit,
                  regimes: functionResult.intervals.regimes || baseTestResults.plotsData.regimes
                },
                warnings: functionResult.warnings,
                model: model,
                mappedData: dataToAnalyze,
              };

              setResults(analysisResults);
              setInputs(analysisInputs);
              toast({ title: "✅ Analysis Complete!", description: "Well test data has been successfully analyzed." });

            } catch (error) {
              console.error("Analysis Error: ", error);
              toast({ variant: "destructive", title: "Analysis Failed", description: error.message || "An unknown error occurred during analysis." });
            } finally {
              setLoading(false);
            }
        };

        if (analysisInputs.isGasWell) {
          toast({ title: "Gas Well Mode", description: "Offloading pseudo-pressure calculations to a background worker." });
          const gasWorker = new Worker(new URL('@/workers/gasCalcs.worker.js', import.meta.url), { type: 'module' });
          
          gasWorker.onmessage = (e) => {
              const { transformedData } = e.data;
              toast({ title: "Gas calculations complete", description: "Proceeding with model fit."});
              runAnalysis(transformedData);
              gasWorker.terminate();
          };

          gasWorker.onerror = (e) => {
              toast({ variant: 'destructive', title: 'Gas Calculation Error', description: 'Web worker failed. Using raw data as fallback.' });
              runAnalysis(processedData); 
              gasWorker.terminate();
          };

          gasWorker.postMessage({ data: processedData, params: { viscosity: analysisInputs.viscosity, initialPressure: analysisInputs.initialPressure } });
        } else {
          runAnalysis(processedData);
        }
      };

      const handleSaveProject = async () => {
        if (!user) {
          toast({ variant: "destructive", title: "Not logged in", description: "You must be logged in to save a project." });
          return;
        }
        if (!results) {
          toast({ variant: "destructive", title: "Nothing to save", description: "Please run an analysis before saving." });
          return;
        }
        setIsSaving(true);
        const projectData = {
          name: inputs.projectName,
          well_name: inputs.wellName,
          reservoir: 'N/A',
          user_id: user.id,
          inputs_data: { inputs: inputs, qcRawData: qcData },
          results_data: results,
        };

        try {
          if (currentProject?.id) {
            const { data, error } = await supabase.from('pta_projects').update(projectData).eq('id', currentProject.id).select().single();
            if (error) throw error;
            setCurrentProject(data);
            toast({ title: "Project Updated", description: `'${data.name}' has been successfully updated.` });
          } else {
            const { data, error } = await supabase.from('pta_projects').insert(projectData).select().single();
            if (error) throw error;
            setCurrentProject(data);
            toast({ title: "Project Saved", description: `'${data.name}' has been successfully saved.` });
          }
        } catch (error) {
          toast({ variant: "destructive", title: "Save Failed", description: error.message });
        } finally {
          setIsSaving(false);
        }
      };
      
      const handleRunDemo = (demoInputs) => {
        setLoading(true); setResults(null); setQcData(null); setCurrentProject(null); setInputs(demoInputs || defaultInputs);
        toast({ title: "🚀 Analysis Initiated", description: "Running local diagnostic calculations..." });

        setTimeout(() => {
          try {
            const analysisResults = generateWellTestData(demoInputs || defaultInputs);
            setResults(analysisResults);
            toast({ title: "✅ Analysis Complete!", description: "Sample well test data has been analyzed." });
          } catch (error) { toast({ variant: "destructive", title: "Analysis Failed", description: error.message });
          } finally { setLoading(false); }
        }, 1500);
      };

      const handleDataLoaded = useCallback((data) => {
        setQcData(data); setResults(null); setCurrentProject(null);
        toast({ title: "📂 Data Loaded", description: "Review and configure your data before analysis." });
      }, [toast]);

      const handleConfirmQC = useCallback((mappedData, confirmedInputs, model) => {
        handleAnalyze(confirmedInputs, mappedData, model);
        setQcData(null);
      }, []);

      const handleReset = () => {
        setResults(null);
        setQcData(null);
        setCurrentProject(null);
        setInputs(defaultInputs);
        setSmoothingLevel(0);
      }
      
      const handleSmoothingChange = (level) => {
        setSmoothingLevel(level);
        if (results && results.plotsData.derivative) {
            const smoothedDerivative = applyBourdetSmoothing(results.plotsData.derivative, level);
            setResults(prev => ({
                ...prev,
                plotsData: {
                    ...prev.plotsData,
                    smoothedDerivative: smoothedDerivative
                }
            }));
        }
      };

      const renderMainPanel = () => {
        if (loading) {
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-400 mx-auto"></div>
                <p className="text-white mt-4 text-lg">Analyzing Well Test Data...</p>
                <p className="text-lime-300">Running advanced calculations...</p>
              </div>
            </div>
          );
        }
        if (qcData) {
          return <QCPanel data={qcData.data} headers={qcData.headers} fileName={qcData.fileName} onConfirm={handleConfirmQC} onCancel={() => setQcData(null)} defaultValues={inputs} />;
        }
        if (results) {
          return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <ResultsPanel results={results} onReset={handleReset} onSmoothingChange={handleSmoothingChange} smoothingLevel={smoothingLevel} />
          </motion.div>;
        }
        return <EmptyState onRunDemo={() => handleRunDemo(inputs)} onDataLoaded={handleDataLoaded} />;
      };

      return (
        <>
          <Helmet>
            <title>Well Test Data Analyzer - Petrolord</title>
            <meta name="description" content="Analyze pressure and rate data to determine key reservoir and wellbore characteristics." />
          </Helmet>
          <div className="flex flex-col md:flex-row h-full bg-slate-900 text-white">
            <aside className="w-full md:w-[380px] xl:w-[420px] p-4 bg-slate-800/30 border-r border-slate-700 overflow-y-auto">
              <div className="mb-4">
                <Button variant="outline" onClick={() => navigate('/dashboard/production')} className="text-slate-300 border-slate-600 hover:bg-slate-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
              <InputPanel onRunDemo={() => handleRunDemo(inputs)} onDataLoaded={handleDataLoaded} onSave={handleSaveProject} onLoad={handleLoadProject} loading={loading || isSaving} inputs={inputs} setInputs={setInputs} isProjectLoaded={!!currentProject} />
            </aside>
            <main className="flex-1 p-4 md:p-6 overflow-y-auto">
              {renderMainPanel()}
            </main>
          </div>
        </>
      );
    };

    export default WellTestDataAnalyzer;