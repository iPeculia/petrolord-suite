import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DollarSign, Plus, BarChart3, PieChart, GitMerge, Activity, ClipboardX as ClipboardPen, Briefcase } from 'lucide-react';

const EconomicAndRisk = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFeatureClick = (feature, appId = null) => {
    if (appId) {
      if (appId.startsWith('apps/')) {
        navigate(`/dashboard/${appId}`);
      } else {
        navigate(`/dashboard/economic-project-management/${appId}`);
      }
    } else {
      toast({
        title: "🚧 Feature Coming Soon!",
        description: `${feature} isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`,
        duration: 4000,
      });
    }
  };

  const economicApps = [
    { name: 'Enterprise Petroleum Economics (EPE)', description: 'Full-cycle economic modeling from volumes to cash flow.', icon: Briefcase, color: 'from-indigo-500 to-purple-500', appId: 'epe/cases' },
    { name: 'Well-Cost Snap Pro', description: 'AI-assisted well cost estimation with benchmarking and probabilistic forecasts.', icon: ClipboardPen, color: 'from-teal-500 to-cyan-500', appId: 'apps/wellcostsnappro' },
    { name: 'NPV Scenario Builder', description: 'Interactive CAPEX/OPEX and price-deck scenarios with instant NPV/IRR.', icon: BarChart3, color: 'from-green-500 to-lime-500', appId: 'npv-scenario-builder' },
    { name: 'Risked Reserves Valuation', description: 'P10/P50/P90-based Monte Carlo NPV ranges in a simple web form.', icon: PieChart, color: 'from-blue-500 to-cyan-500', appId: 'risked-reserves-valuation' },
    { name: 'Fiscal Regime Comparator', description: 'Side-by-side royalty/tax cash-flow comparisons for different contract terms.', icon: DollarSign, color: 'from-purple-500 to-pink-500', appId: 'fiscal-regime-comparator' },
    { name: 'Value of Information Analyzer', description: 'Quantify the value of new data with decision tree analysis and Monte Carlo simulation.', icon: GitMerge, color: 'from-sky-500 to-indigo-500', appId: 'voi-analyzer' },
    { name: 'Probabilistic Breakeven Analyzer', description: 'Probabilistically analyze breakeven prices.', icon: Activity, color: 'from-orange-500 to-red-500', appId: 'breakeven-analyzer'},
  ];
  
  const AppCard = ({ app }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer group"
        onClick={() => handleFeatureClick(app.name, app.appId)}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className={`bg-gradient-to-r ${app.color} p-2 rounded-lg`}>
            <app.icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">{app.name}</h3>
            <span className={`text-xs ${app.appId ? 'text-green-300' : 'text-lime-300'}`}>
              {app.appId ? 'Ready to Launch' : 'Coming Soon'}
            </span>
          </div>
        </div>
        <p className="text-lime-200 text-xs leading-relaxed group-hover:text-lime-100 transition-colors">
          {app.description}
        </p>
      </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Economic Evaluation & Project Management - Petrolord Suite</title>
        <meta name="description" content="Financial modeling, project management, and risk analysis for optimal decision-making." />
      </Helmet>

      <div className="p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-to-r from-green-500 to-lime-500 p-3 rounded-xl">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Economic Evaluation & Project Management</h1>
              <p className="text-lime-200 text-lg">Financial modeling, investment analysis, and risk management</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-12">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Economic & Decision Analysis Applications</h2>
                    <Button onClick={() => handleFeatureClick('New Economic Model')} className="bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700">
                    <Plus className="w-4 h-4 mr-2" /> New Analysis
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {economicApps.map((app) => <AppCard key={app.name} app={app} />)}
                </div>
            </motion.div>
        </div>
      </div>
    </>
  );
};

export default EconomicAndRisk;