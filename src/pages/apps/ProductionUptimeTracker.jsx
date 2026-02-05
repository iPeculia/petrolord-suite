import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { generateUptimeData } from '@/utils/uptimeTrackerCalculations';
import EmptyState from '@/components/productionsurveillance/EmptyState';
import DataIngestionHub from '@/components/productionsurveillance/DataIngestionHub';
import ProductionAllocationEngine from '@/components/productionsurveillance/ProductionAllocationEngine';
import PerformanceAnalytics from '@/components/productionsurveillance/PerformanceAnalytics';
import FieldOverviewDashboard from '@/components/productionsurveillance/FieldOverviewDashboard';
import ReportsAndAlerts from '@/components/productionsurveillance/ReportsAndAlerts';
import { ArrowLeft, LayoutDashboard, Database, GitBranch, BarChart3, Bell, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const ProductionSurveillanceDashboard = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRunAnalysis = (inputs) => {
    setLoading(true);
    setResults(null);

    setTimeout(() => {
      try {
        const analysisResults = generateUptimeData(inputs);
        setResults(analysisResults);
        toast({
          title: "Analysis Complete!",
          description: "Production surveillance data has been processed.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    }, 1500);
  };
  
  const TABS = [
    { id: "overview", label: "Field Overview", icon: LayoutDashboard, component: <FieldOverviewDashboard results={results} /> },
    { id: "data", label: "Data Hub", icon: Database, component: <DataIngestionHub onRunAnalysis={handleRunAnalysis} loading={loading} /> },
    { id: "allocation", label: "Allocation", icon: GitBranch, component: <ProductionAllocationEngine allocationData={results?.allocationData} /> },
    { id: "analytics", label: "Performance", icon: BarChart3, component: <PerformanceAnalytics paretoData={results?.paretoData} varianceData={results?.varianceData} /> },
    { id: "reports", label: "Reports & Alerts", icon: FileText, component: <ReportsAndAlerts /> },
  ];

  return (
    <>
      <Helmet>
        <title>Production Surveillance Dashboard - Petrolord Suite</title>
        <meta name="description" content="Real-time, integrated platform for monitoring, analyzing, and reporting on daily production performance." />
      </Helmet>
      <div className="flex flex-col h-full bg-slate-900 text-white">
         <header className="p-4 md:p-6 border-b border-white/10 bg-black/20 backdrop-blur-lg">
           <div className="flex items-center space-x-4 mb-4">
            <Link to="/dashboard/production">
              <Button variant="outline" size="sm" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Production
              </Button>
            </Link>
          </div>
          <div className="flex items-start md:items-center space-x-4">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl mt-1">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-white">Production Surveillance Dashboard</h1>
              <p className="text-lime-200 text-sm md:text-md">Monitor, analyze, and report on daily production performance.</p>
            </div>
          </div>
        </header>

        <div className="flex-grow flex flex-col overflow-hidden">
        {!results && !loading ? (
          <div className="flex-grow p-6">
            <EmptyState onRunAnalysis={() => handleRunAnalysis({ projectName: 'Bonga Main Field' })} />
          </div>
        ) : loading ? (
             <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-400 mx-auto"></div>
                      <p className="text-white mt-4 text-lg">Analyzing Field Data...</p>
                      <p className="text-lime-300">Please wait while we process the records.</p>
                  </div>
              </div>
        ) : (
          <Tabs defaultValue="overview" className="flex-grow flex flex-col">
            <div className="px-4 border-b border-slate-700">
                <TabsList className="bg-transparent border-none p-0">
                  {TABS.map(tab => (
                    <TabsTrigger key={tab.id} value={tab.id} className="text-slate-400 data-[state=active]:text-lime-300 data-[state=active]:bg-slate-800/50 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-lime-300 rounded-none">
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
            </div>
            <div className="flex-grow overflow-y-auto">
              {TABS.map(tab => (
                <TabsContent key={tab.id} value={tab.id} className="p-6">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                     {tab.component}
                  </motion.div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        )}
        </div>
      </div>
    </>
  );
};

export default ProductionSurveillanceDashboard;