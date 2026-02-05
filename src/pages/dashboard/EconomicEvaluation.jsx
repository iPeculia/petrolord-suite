import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calculator, Plus, BarChart3, PieChart, DollarSign, FileText, Leaf, Presentation, ClipboardX as ClipboardPen } from 'lucide-react';

const EconomicEvaluation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFeatureClick = (feature, appId = null) => {
    if (appId) {
      if (appId.startsWith('apps/')) {
        navigate(`/dashboard/${appId}`);
      } else {
        navigate(`/dashboard/economic/${appId}`);
      }
      return;
    }
    
    toast({
      title: "🚧 Feature Coming Soon!",
      description: `${feature} isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`,
      duration: 4000,
    });
  };

  const economicApps = [
    {
      name: 'Well-Cost Snap Pro',
      description: 'AI-assisted well cost estimation with benchmarking and probabilistic forecasts.',
      icon: ClipboardPen,
      color: 'from-teal-500 to-cyan-500',
      status: 'Available',
      appId: 'apps/wellcostsnappro'
    },
    {
      name: 'NPV Scenario Builder',
      description: 'Interactive CAPEX/OPEX and price-deck scenarios with instant NPV/IRR.',
      icon: BarChart3,
      color: 'from-green-500 to-lime-500',
      status: 'Available',
      appId: 'npv-scenario-builder'
    },
    {
      name: 'Risked Reserves Valuation',
      description: 'P10/P50/P90-based Monte Carlo NPV ranges in a simple web form.',
      icon: PieChart,
      color: 'from-blue-500 to-cyan-500',
      status: 'Available',
      appId: 'risked-reserves-valuation'
    },
    {
      name: 'Fiscal Regime Comparator',
      description: 'Side-by-side royalty/tax cash-flow comparisons for different contract terms.',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500',
      status: 'Available',
      appId: 'fiscal-regime-comparator'
    },
    {
      name: 'Abandonment Cost Estimator',
      description: 'Conceptual plug & abandonment liability forecasts from a few key inputs.',
      icon: FileText,
      color: 'from-orange-500 to-red-500',
      status: 'Available'
    },
    {
      name: 'Carbon Tax & Footprint Analyzer',
      description: 'Emissions + carbon-pricing "what-if" for project-level ESG costing.',
      icon: Leaf,
      color: 'from-green-600 to-emerald-500',
      status: 'Available'
    },
    {
      name: 'Auto-Pitch Generator',
      description: 'From your assumptions to polished executive summaries and slide decks.',
      icon: Presentation,
      color: 'from-indigo-500 to-purple-500',
      status: 'Available'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Economic Evaluation - Petrolord Suite</title>
        <meta name="description" content="Financial modeling, NPV analysis, and investment decision support for oil & gas projects." />
      </Helmet>

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-to-r from-green-500 to-lime-500 p-3 rounded-xl">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Economic Evaluation</h1>
              <p className="text-lime-200 text-lg">Financial modeling and investment analysis</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Economic Applications</h2>
                <Button
                  onClick={() => handleFeatureClick('New Economic Model')}
                  className="bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Analysis
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {economicApps.map((app, index) => (
                  <motion.div
                    key={app.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer group"
                    onClick={() => handleFeatureClick(app.name, app.appId)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`bg-gradient-to-r ${app.color} p-2 rounded-lg`}>
                        <app.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-sm">{app.name}</h3>
                        <span className={`text-xs ${
                          app.appId ? 'text-green-300' : 'text-lime-300'
                        }`}>
                          {app.appId ? 'Ready to Launch' : app.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-lime-200 text-xs leading-relaxed group-hover:text-lime-100 transition-colors">
                      {app.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Active Projects</h2>
              <div className="space-y-4">
                {[
                  { name: 'North Field Development', npv: '$125.5M', irr: '18.2%', status: 'Active', tool: 'NPV Scenario Builder' },
                  { name: 'Offshore Platform Extension', npv: '$89.3M', irr: '15.7%', status: 'Review', tool: 'Risked Reserves' },
                  { name: 'Enhanced Recovery Project', npv: '$67.8M', irr: '22.1%', status: 'Approved', tool: 'Fiscal Comparator' }
                ].map((project, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer"
                       onClick={() => handleFeatureClick(project.name)}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-white font-semibold">{project.name}</h3>
                        <p className="text-lime-300 text-sm">{project.tool}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Active' ? 'bg-green-500/20 text-green-300' :
                        project.status === 'Review' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-lime-200">
                      <span>NPV: {project.npv}</span>
                      <span>IRR: {project.irr}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Key Metrics</h3>
              <div className="space-y-4">
                {[
                  { metric: 'Total Portfolio NPV', value: '$282.6M', icon: DollarSign },
                  { metric: 'Average IRR', value: '18.7%', icon: BarChart3 },
                  { metric: 'Risk-Adjusted NPV', value: '$245.1M', icon: Calculator }
                ].map((metric, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                    <div className="bg-gradient-to-r from-green-500 to-lime-500 p-2 rounded-lg">
                      <metric.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-lime-200 text-sm">{metric.metric}</p>
                      <p className="text-white font-semibold">{metric.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  'NPV scenario completed for Field A',
                  'Monte Carlo analysis finished',
                  'Fiscal regime comparison updated',
                  'Auto-pitch generated for Project B'
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="text-lime-200 text-sm">{activity}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EconomicEvaluation;