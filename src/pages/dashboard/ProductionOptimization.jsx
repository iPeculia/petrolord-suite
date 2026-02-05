import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { TrendingUp, Timer, Activity, Beaker, FileText, ChevronsUp, FlaskConical } from 'lucide-react';

const ProductionOptimization = () => {
  const { toast } = useToast();

  const handleFeatureClick = (feature) => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: `${feature} isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`,
      duration: 4000,
    });
  };

  const productionApps = [
    {
      name: 'Production Uptime Tracker',
      description: 'Track and analyze production uptime to minimize downtime and maximize efficiency.',
      icon: Timer,
      color: 'from-cyan-500 to-blue-500',
      status: 'Available'
    },
    {
      name: 'Production Anomaly Detector',
      description: 'Automatically detect anomalies in production data to prevent issues and ensure stability.',
      icon: Activity,
      color: 'from-red-500 to-orange-500',
      status: 'Available'
    },
    {
      name: 'PVT QuickLook',
      description: 'Quickly analyze fluid properties with standard PVT correlations and visualizations.',
      icon: Beaker,
      color: 'from-purple-500 to-pink-500',
      status: 'Available'
    },
    {
      name: 'Well Test Data Analyzer',
      description: 'Analyze pressure transient data from well tests to determine reservoir characteristics.',
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      status: 'Available'
    },
    {
      name: 'Artificial Lift System Selector',
      description: 'Select the optimal artificial lift system (ESP, Gas Lift, etc.) for your wells.',
      icon: ChevronsUp,
      color: 'from-blue-500 to-sky-500',
      status: 'Available'
    },
    {
      name: 'Production Chemical Dosing Calculator',
      description: 'Calculate optimal chemical dosing for production assurance and flow integrity.',
      icon: FlaskConical,
      color: 'from-yellow-500 to-amber-500',
      status: 'Available'
    },
  ];

  return (
    <>
      <Helmet>
        <title>Production Optimization - Petrolord Suite</title>
        <meta name="description" content="Real-time production monitoring, artificial lift design, and well performance enhancement." />
      </Helmet>

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Production Optimization</h1>
              <p className="text-lime-200 text-lg">Real-time monitoring and performance enhancement</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Optimization Applications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productionApps.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors cursor-pointer group flex flex-col"
                onClick={() => handleFeatureClick(app.name)}
              >
                <div className="flex-grow">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`bg-gradient-to-r ${app.color} p-3 rounded-lg`}>
                      <app.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{app.name}</h3>
                      <span className="text-xs text-green-300">{app.status}</span>
                    </div>
                  </div>
                  <p className="text-lime-200 text-sm leading-relaxed group-hover:text-lime-100 transition-colors">
                    {app.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProductionOptimization;