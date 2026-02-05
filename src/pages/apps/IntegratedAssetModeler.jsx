import React, { useState, useEffect, useRef } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useLocation, Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Save, ArrowLeft, Workflow } from 'lucide-react';
    import InputPanel from '@/components/nodalanalysis/InputPanel';
    import ResultsPanel from '@/components/nodalanalysis/ResultsPanel';
    import EmptyState from '@/components/nodalanalysis/EmptyState';

    const IntegratedAssetModeler = () => {
      const [results, setResults] = useState(null);
      const [loading, setLoading] = useState(false);
      const [inputs, setInputs] = useState(null);
      const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
      const [projectName, setProjectName] = useState("New IAM Project");
      const { toast } = useToast();
      const { user } = useAuth();
      const location = useLocation();
      const analysisHasRun = useRef(false);

      const handleAnalyze = async (analysisInputs) => {
        setLoading(true);
        setResults(null);
        setInputs(analysisInputs);
        analysisHasRun.current = true;

        try {
          const { data, error } = await supabase.functions.invoke('nodal-analysis-engine', {
            body: { inputs: analysisInputs },
          });

          if (error) throw new Error(`Edge function error: ${error.message}`);
          if (data.error) throw new Error(`Analysis error: ${data.error}`);

          setResults(data);
          setProjectName(analysisInputs.projectName);
          toast({
            title: "Analysis Complete!",
            description: "Integrated Asset Model results are ready.",
          });
        } catch (error) {
          console.error("IAM analysis failed:", error);
          toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: error.message,
          });
          setResults(null);
        } finally {
          setLoading(false);
        }
      };

      const runDefaultAnalysis = () => {
        const defaultInputs = {
            projectName: "Integrated Asset Model - Example",
            wellName: "Well-12",
            
            tubingID: 2.441,
            casingID: 6.366,
            tubingLength: 8200,
            wellDeviation: 10,
            perforationInterval: 200,
            hasGravelPack: false,

            flowlineID: 4,
            flowlineLength: 5000,
            separatorPressure: 200,
            chokeSize: 64, 

            liftMethod: "None",
            gasLiftInjectionRate: 0,
            espPumpDepth: 5000,
            espPressureBoost: 0,

            reservoirPressure: 4000,
            reservoirTemperature: 180,
            driveMechanism: "Water Drive",

            iprModel: "Vogel",
            
            permeability: 50,
            reservoirThickness: 100,
            drainageRadius: 1000,
            wellboreRadius: 0.328,
            skin: 5,

            bubblePoint: 3000,
            testRate: 1000,
            testPwf: 2500,

            oilApi: 35,
            gasGravity: 0.7,
            waterSalinity: 30000,
            gasOilRatio: 800,
            waterCut: 20,
            oilViscosity: 0.8,
            oilFvf: 1.4,

            actualRate: 850,
            actualPwf: 2800,

            forecastDuration: 10,
            pressureDeclineRate: 50,
        };
        handleAnalyze(defaultInputs);
      };
      
      useEffect(() => {
        if (location.state?.loadedProject) {
          const { project_name, inputs_data, results_data } = location.state.loadedProject;
          setProjectName(project_name);
          setInputs(inputs_data);
          setResults(results_data);
          analysisHasRun.current = true;
          toast({
            title: "Project Loaded",
            description: `Successfully loaded "${project_name}".`,
          });
        } else if (!analysisHasRun.current) {
            runDefaultAnalysis();
        }
      }, [location.state]);

      const handleSaveProject = async () => {
        if (!user || !inputs || !results) {
          toast({ variant: "destructive", title: "Cannot Save", description: "User not logged in or no data to save." });
          return;
        }
        const { data, error } = await supabase
          .from('saved_nodal_analysis_projects')
          .insert([{
            user_id: user.id,
            project_name: projectName,
            inputs_data: inputs,
            results_data: results,
          }]);

        if (error) {
          toast({ variant: "destructive", title: "Save Failed", description: error.message });
        } else {
          toast({ title: "Project Saved!", description: `"${projectName}" has been saved.` });
        }
        setIsSaveDialogOpen(false);
      };

      return (
        <>
          <Helmet>
            <title>Integrated Asset Modeler - Petrolord Suite</title>
            <meta name="description" content="Comprehensive production system modeling, from sandface to separator." />
          </Helmet>
          <div className="flex h-full flex-col bg-slate-900 text-white">
            <div className="flex-shrink-0 bg-slate-900/70 backdrop-blur-lg border-b border-white/10 p-2 flex items-center justify-between">
              <Link to="/dashboard/production">
                <Button variant="outline" size="sm" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Production
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-lime-300" />
                <h1 className="text-lg font-bold text-white">Integrated Asset Modeler (IAM)</h1>
              </div>
              <Button onClick={() => setIsSaveDialogOpen(true)} disabled={!results}>
                <Save className="w-4 h-4 mr-2" />
                Save Project
              </Button>
            </div>
            <div className="flex flex-grow overflow-hidden">
              <div className="w-full md:w-1/3 xl:w-1/4 p-4 bg-slate-900/50 border-r border-white/10 overflow-y-auto">
                <InputPanel onAnalyze={handleAnalyze} loading={loading} initialInputs={inputs} />
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-400 mx-auto"></div>
                          <p className="text-white mt-4 text-lg">Running System Analysis...</p>
                          <p className="text-lime-300">Integrating reservoir, well, and surface models...</p>
                      </div>
                  </div>
                ) : results ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <ResultsPanel results={results} inputs={inputs} />
                  </motion.div>
                ) : (
                  <EmptyState onAnalyze={runDefaultAnalysis} />
                )}
              </div>
            </div>
          </div>
          <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
            <DialogContent className="bg-slate-900 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Save Project</DialogTitle>
                <DialogDescription>Enter a name for your Integrated Asset Model project.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Project Name</Label>
                  <Input id="name" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="col-span-3 bg-slate-800 border-slate-600 text-white" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveProject}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    };

    export default IntegratedAssetModeler;