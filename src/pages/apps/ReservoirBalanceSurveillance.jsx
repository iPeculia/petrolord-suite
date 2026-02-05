import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Helmet } from 'react-helmet';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
    import { Button } from '@/components/ui/button';
    import { FolderOpen, Save, BarChart3, Database, Droplets, TrendingUp, Compass, SlidersHorizontal, FileText, ChevronLeft, HelpCircle } from 'lucide-react';
    
    import { useReservoir } from '@/contexts/ReservoirContext';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    
    import DataHub from '@/components/reservoirbalance/DataHub';
    import PvtRock from '@/components/reservoirbalance/PvtRock';
    import EnergyBalance from '@/components/reservoirbalance/EnergyBalance';
    import AquiferModel from '@/components/reservoirbalance/AquiferModel';
    import ContactsTracker from '@/components/reservoirbalance/ContactsTracker';
    import ForecastScenarios from '@/components/reservoirbalance/ForecastScenarios';
    import ReportsExport from '@/components/reservoirbalance/ReportsExport';
    import LoadProjectDialog from '@/components/reservoirbalance/LoadProjectDialog';
    import HelpGuideDialog from '@/components/reservoirbalance/HelpGuideDialog';
    import { sampleProductionData, samplePressureData, samplePvtData } from '@/data/sampleReservoirData';
    
    const ReservoirBalanceSurveillance = () => {
      const { reservoir } = useReservoir();
      const navigate = useNavigate();
      const { toast } = useToast();
    
      const [projectName, setProjectName] = useState('New Project');
      const [productionData, setProductionData] = useState(sampleProductionData);
      const [pressureData, setPressureData] = useState(samplePressureData);
      const [pvtData, setPvtData] = useState(samplePvtData);
      
      const [mbalResults, setMbalResults] = useState(null);
      const [aquiferResults, setAquiferResults] = useState(null);
      const [contactsResults, setContactsResults] = useState(null);
      const [forecastResults, setForecastResults] = useState(null);
      
      const [isLoadProjectOpen, setLoadProjectOpen] = useState(false);
      const [isHelpOpen, setHelpOpen] = useState(false);
    
      const handleProjectLoaded = (project) => {
        setProjectName(project.project_name);
        setProductionData(project.inputs_data?.productionData || null);
        setPressureData(project.inputs_data?.pressureData || null);
        setPvtData(project.inputs_data?.pvtData || null);
        
        setMbalResults(project.results_data?.mbalResults || null);
        setAquiferResults(project.results_data?.aquiferResults || null);
        setContactsResults(project.results_data?.contactsResults || null);
        setForecastResults(project.results_data?.forecastResults || null);
        
        toast({ title: 'Project Loaded', description: `Successfully loaded '${project.project_name}'.` });
        setLoadProjectOpen(false);
      };
    
      const handleSaveProject = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast({ title: 'Authentication Error', description: 'You must be logged in to save a project.', variant: 'destructive'});
            return;
        }
    
        const inputs_data = { productionData, pressureData, pvtData };
        const results_data = { mbalResults, aquiferResults, contactsResults, forecastResults };
    
        const { data, error } = await supabase
            .from('saved_reservoir_balance_projects')
            .upsert({ 
                user_id: user.id,
                project_name: projectName,
                inputs_data: inputs_data,
                results_data: results_data,
                updated_at: new Date().toISOString(),
             }, { onConflict: 'user_id, project_name' });
    
        if (error) {
            toast({ title: 'Error Saving Project', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: 'Project Saved', description: `Successfully saved '${projectName}'.` });
        }
      };
      
      const TABS = [
          { id: 'data-hub', title: 'Data Hub', icon: Database, component: <DataHub productionData={productionData} setProductionData={setProductionData} pressureData={pressureData} setPressureData={setPressureData} pvtData={pvtData} setPvtData={setPvtData} /> },
          { id: 'pvt-rock', title: 'PVT & Rock Properties', icon: Droplets, component: <PvtRock pvtData={pvtData} onPvtDataChange={setPvtData} /> },
          { id: 'mbal', title: 'Material Balance', icon: BarChart3, component: <EnergyBalance productionData={productionData} pressureData={pressureData} pvtData={pvtData} aquiferResults={aquiferResults} onResultsChange={setMbalResults} mbalResults={mbalResults} /> },
          { id: 'aquifer-model', title: 'Aquifer Model', icon: TrendingUp, component: <AquiferModel pressureData={pressureData} pvtData={pvtData} onResultsChange={setAquiferResults} aquiferResults={aquiferResults} /> },
          { id: 'contact-tracker', title: 'Contact Tracker', icon: Compass, component: <ContactsTracker mbalResults={mbalResults} pvtData={pvtData} onResultsChange={setContactsResults} contactsResults={contactsResults} /> },
          { id: 'forecast', title: 'Forecast & Scenario', icon: SlidersHorizontal, component: <ForecastScenarios productionData={productionData} mbalResults={mbalResults} onResultsChange={setForecastResults} forecastResults={forecastResults} /> },
          { id: 'reports', title: 'Reports & Export', icon: FileText, component: <ReportsExport projectName={projectName} mbalResults={mbalResults} aquiferResults={aquiferResults} forecastResults={forecastResults} /> }
      ];
    
      return (
        <>
          <Helmet>
            <title>Material Balance Studio</title>
            <meta name="description" content="An integrated studio for material balance, aquifer modeling, and reservoir surveillance." />
          </Helmet>
          <div className="flex flex-col h-screen bg-gray-900 text-white">
            <header className="flex items-center justify-between p-2 border-b border-slate-700 bg-slate-800/50">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/reservoir')}><ChevronLeft className="w-5 h-5" /></Button>
                <h1 className="text-lg font-semibold ml-2">Material Balance Studio</h1>
                {reservoir.name && <span className="ml-4 text-sm text-lime-400 font-mono bg-lime-900/50 px-2 py-1 rounded">{reservoir.name}</span>}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setHelpOpen(true)}><HelpCircle className="w-4 h-4 mr-2"/>Help</Button>
                <Button variant="outline" size="sm" onClick={() => setLoadProjectOpen(true)}><FolderOpen className="w-4 h-4 mr-2"/>Load</Button>
                <Button variant="outline" size="sm" onClick={handleSaveProject}><Save className="w-4 h-4 mr-2"/>Save</Button>
              </div>
            </header>
    
            <main className="flex-1 p-4 overflow-auto">
              <Tabs defaultValue="data-hub" className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
                  {TABS.map(tab => (
                    <TabsTrigger key={tab.id} value={tab.id}>
                        <tab.icon className="w-4 h-4 mr-2" />
                        {tab.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <AnimatePresence mode="wait">
                  {TABS.map(tab => (
                    <TabsContent key={tab.id} value={tab.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {tab.component}
                      </motion.div>
                    </TabsContent>
                  ))}
                </AnimatePresence>
              </Tabs>
            </main>
          </div>
          <LoadProjectDialog 
            isOpen={isLoadProjectOpen} 
            onOpenChange={setLoadProjectOpen} 
            onProjectLoaded={handleProjectLoaded} 
          />
          <HelpGuideDialog isOpen={isHelpOpen} onOpenChange={setHelpOpen} />
        </>
      );
    };
    
    export default ReservoirBalanceSurveillance;