import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, AlertTriangle, TrendingDown, Activity, FileText, Eye, BarChart3, PieChart } from 'lucide-react';

const RiskAnalysis = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFeatureClick = (feature, appId = null) => {
    if (appId) {
      if(appId.startsWith('economic/')) {
        navigate(`/dashboard/${appId}`);
      } else {
        navigate(`/dashboard/risk/${appId}`);
      }
      return;
    }
    toast({
      title: "🚧 Feature Coming Soon!",
      description: `${feature} isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`,
      duration: 4000,
    });
  };

  const riskApps = [
    {
      name: 'BayesRisk Profiler',
      description: 'Bayesian-network uncertainty quantification across P, S, G parameters.',
      icon: BarChart3,
      color: 'from-red-500 to-orange-500',
      status: 'Available'
    },
    {
      name: 'ContractGuard',
      description: 'AI scan & highlight of high-risk clauses in JV and service agreements.',
      icon: FileText,
      color: 'from-orange-500 to-amber-500',
      status: 'Available'
    },
    {
      name: 'HSE Predict',
      description: 'ML-forecast of rig/facility incident likelihood from historical data.',
      icon: AlertTriangle,
      color: 'from-yellow-500 to-orange-500',
      status: 'Available'
    },
    {
      name: 'BlowoutSim',
      description: 'Web-based blowout-risk simulator with shut-in and kill-method scenarios.',
      icon: Activity,
      color: 'from-red-600 to-red-500',
      status: 'Available'
    },
    {
      name: 'IntegrityWatch',
      description: 'Live IoT-fed corrosion & integrity scoring for wells and pipelines.',
      icon: Eye,
      color: 'from-blue-500 to-cyan-500',
      status: 'Available'
    },
    {
      name: 'MarketVol Forecast',
      description: 'Short-term oil-price and FX volatility predictions via time-series ML.',
      icon: TrendingDown,
      color: 'from-purple-500 to-pink-500',
      status: 'Available'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Risk Analysis - Petrolord Suite</title>
        <meta name="description" content="Comprehensive risk assessment, uncertainty quantification, and predictive analytics for oil & gas operations." />
      </Helmet>

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Risk Analysis</h1>
              <p className="text-lime-200 text-lg">Comprehensive risk assessment and predictive analytics</p>
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
                <h2 className="text-2xl font-bold text-white">Risk Analysis Applications</h2>
                <Button
                  onClick={() => handleFeatureClick('New Risk Assessment')}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Assessment
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {riskApps.map((app, index) => (
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
                        <span className={`text-xs ${app.appId ? 'text-green-300' : 'text-lime-300'}`}>
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
              <h2 className="text-2xl font-bold text-white mb-6">Risk Dashboard</h2>
              <div className="bg-white/5 rounded-lg p-8 text-center">
                <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <p className="text-lime-200 mb-4">Comprehensive risk monitoring and analytics dashboard</p>
                <Button
                  onClick={() => handleFeatureClick('Risk Dashboard')}
                  variant="outline"
                  className="border-red-400/50 text-red-300 hover:bg-red-500/20"
                >
                  View Dashboard
                </Button>
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
              <h3 className="text-xl font-bold text-white mb-4">Risk Alerts</h3>
              <div className="space-y-3">
                {[
                  { level: 'Critical', message: 'Blowout risk elevated in Well A-12', color: 'red' },
                  { level: 'High', message: 'Contract clause flagged in JV agreement', color: 'orange' },
                  { level: 'Medium', message: 'Corrosion rate increasing in Pipeline B', color: 'yellow' },
                  { level: 'Low', message: 'Market volatility within normal range', color: 'green' }
                ].map((alert, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg bg-${alert.color}-500/10 border border-${alert.color}-500/20`}>
                    <AlertTriangle className={`w-4 h-4 text-${alert.color}-400`} />
                    <div>
                      <p className={`text-${alert.color}-300 font-medium text-sm`}>{alert.level} Risk</p>
                      <p className="text-lime-200 text-xs">{alert.message}</p>
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
              <h3 className="text-xl font-bold text-white mb-4">Risk Metrics</h3>
              <div className="space-y-4">
                {[
                  { metric: 'Overall Risk Score', value: '7.2/10', trend: 'stable' },
                  { metric: 'HSE Incidents (30d)', value: '2', trend: 'down' },
                  { metric: 'Contract Risks', value: '5 Active', trend: 'up' },
                  { metric: 'Market Volatility', value: '12.5%', trend: 'stable' }
                ].map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-lime-200 text-sm">{metric.metric}</p>
                      <p className="text-white font-semibold">{metric.value}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      metric.trend === 'up' ? 'bg-red-400' :
                      metric.trend === 'down' ? 'bg-green-400' :
                      'bg-yellow-400'
                    }`}></div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  'Generate Risk Report',
                  'Schedule Risk Assessment',
                  'Update Risk Matrix',
                  'Export Risk Data'
                ].map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => handleFeatureClick(action)}
                    variant="outline"
                    className="w-full justify-start border-white/20 text-lime-200 hover:bg-white/10"
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RiskAnalysis;