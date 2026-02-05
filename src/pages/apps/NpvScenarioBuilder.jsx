import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, ArrowLeft, Briefcase, Calculator, Cable, HelpCircle } from 'lucide-react';
import InputPanel from '@/components/npv/InputPanel';
import ResultsPanel from '@/components/npv/ResultsPanel';
import PortfolioView from '@/components/npv/PortfolioView';
import IntegrationHub from '@/components/npv/IntegrationHub';
import EmptyState from '@/components/npv/EmptyState';
import HelpSystem from '@/components/npv/help/HelpSystem';
import { calculateEconomics, runMonteCarlo, generateScenarios, runSensitivityAnalysis } from '@/utils/npvCalculations';

const NpvScenarioBuilder = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeView, setActiveView] = useState('single'); // 'single', 'portfolio', 'integrations'
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleCalculate = async (inputs, mode) => {
    setLoading(true);
    
    // Use timeout to allow UI to render loading state before heavy calculation
    setTimeout(async () => {
        try {
            // 1. Base Case Deterministic Run
            const detResults = calculateEconomics(inputs);
            
            // 2. Generate Scenarios (Low/Base/High)
            const scenarios = generateScenarios(inputs);

            // 3. Sensitivity Analysis (Tornado/Spider)
            const sensitivity = runSensitivityAnalysis(inputs);

            // 4. Probabilistic Risk Analysis (Monte Carlo)
            // Define default uncertainties
            const uncertainties = { price: 0.2, capex: 0.2, reserves: 0.2 };
            const riskResults = await runMonteCarlo(inputs, { iterations: 1000, uncertainties });

            setResults({
                metrics: detResults.metrics,
                cashflow: detResults.cashflow,
                scenarios,
                sensitivity,
                risk: riskResults
            });

            toast({ title: "Calculation Complete", description: "All economic indicators, scenarios, and risk metrics updated." });
        } catch (err) {
            console.error(err);
            toast({ variant: "destructive", title: "Calculation Error", description: err.message });
        } finally {
            setLoading(false);
        }
    }, 100);
  };

  const handleIntegrationImport = (sourceId) => {
      // Mock: When integration imports data, we could auto-populate inputs
      // For now, we just switch to calculator view to simulate workflow
      setTimeout(() => {
          setActiveView('single');
          toast({ title: "Data Loaded", description: "Project parameters populated from external source." });
      }, 500);
  };

  return (
    <>
      <Helmet>
        <title>NPV Scenario Builder - Petrolord Suite</title>
        <meta name="description" content="Advanced economic modeling with Quick and Expert modes." />
      </Helmet>
      
      <div className="p-4 md:p-6 h-screen flex flex-col overflow-hidden bg-slate-950 text-white">
        {/* Header Section */}
        <div className="flex-shrink-0 mb-4 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-800 pb-4 gap-4">
            <div>
                <div className="flex items-center space-x-4 mb-2">
                    <Link to="/dashboard/economics">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white pl-0">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    </Link>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-green-500 to-lime-500 p-2 rounded-xl shadow-lg shadow-lime-900/20">
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">NPV Scenario Builder</h1>
                        <p className="text-slate-400 text-xs">Advanced Valuation & Portfolio Management</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsHelpOpen(true)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                    <HelpCircle className="w-5 h-5 mr-2" /> Help & Training
                </Button>

                {/* View Switcher */}
                <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex">
                    <Button 
                        variant={activeView === 'single' ? 'secondary' : 'ghost'} 
                        size="sm" 
                        onClick={() => setActiveView('single')}
                        className={activeView === 'single' ? 'bg-slate-800 text-white' : 'text-slate-400'}
                    >
                        <Calculator className="w-4 h-4 mr-2" /> Project Mode
                    </Button>
                    <Button 
                        variant={activeView === 'portfolio' ? 'secondary' : 'ghost'} 
                        size="sm" 
                        onClick={() => setActiveView('portfolio')}
                        className={activeView === 'portfolio' ? 'bg-slate-800 text-white' : 'text-slate-400'}
                    >
                        <Briefcase className="w-4 h-4 mr-2" /> Portfolio View
                    </Button>
                    <Button 
                        variant={activeView === 'integrations' ? 'secondary' : 'ghost'} 
                        size="sm" 
                        onClick={() => setActiveView('integrations')}
                        className={activeView === 'integrations' ? 'bg-slate-800 text-white' : 'text-slate-400'}
                    >
                        <Cable className="w-4 h-4 mr-2" /> Integration Hub
                    </Button>
                </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow overflow-hidden">
            
            {activeView === 'single' && (
                <div className="flex flex-col lg:flex-row gap-6 h-full">
                    {/* Left Input Panel */}
                    <div className="lg:w-1/3 xl:w-[30%] bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-hidden flex flex-col shadow-xl">
                        <InputPanel onCalculate={handleCalculate} loading={loading} />
                    </div>

                    {/* Right Results Panel */}
                    <div className="lg:w-2/3 xl:w-[70%] flex flex-col overflow-hidden">
                        {results ? (
                        <ResultsPanel results={results} />
                        ) : (
                        <EmptyState />
                        )}
                    </div>
                </div>
            )}

            {activeView === 'portfolio' && (
                <div className="h-full overflow-y-auto">
                    <PortfolioView />
                </div>
            )}

            {activeView === 'integrations' && (
                <div className="h-full overflow-y-auto max-w-4xl mx-auto pt-8">
                    <h2 className="text-2xl font-bold mb-6">Integration Hub</h2>
                    <p className="text-slate-400 mb-8">Connect your economic models to live data sources across the Petrolord Suite.</p>
                    <IntegrationHub onImport={handleIntegrationImport} />
                </div>
            )}

        </div>
        
        {/* Help System Modal */}
        <HelpSystem open={isHelpOpen} onOpenChange={setIsHelpOpen} />
      </div>
    </>
  );
};

export default NpvScenarioBuilder;