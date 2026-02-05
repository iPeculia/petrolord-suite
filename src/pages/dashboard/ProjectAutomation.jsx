import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, Plus, Briefcase, FileText, DollarSign, Activity, Lightbulb } from 'lucide-react';

const ProjectAutomation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFeatureClick = (feature, appId = null) => {
    if (appId) {
      if (appId.startsWith('apps/')) {
        navigate(`/dashboard/${appId}`);
      } else {
        navigate(`/dashboard/automation/${appId}`);
      }
    } else {
      toast({
        title: "🚧 Feature Coming Soon!",
        description: `${feature} isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`,
        duration: 4000,
      });
    }
  };

  const automationApps = [
    { name: 'Oil Block Bid Optimizer', description: 'Optimize bidding strategy for oil blocks using advanced analytics.', icon: DollarSign, color: 'from-green-500 to-lime-500', appId: 'bid-optimizer' },
    { name: 'Competitor Intelligence Hub', description: 'Gain insights into competitor activities and market trends.', icon: Activity, color: 'from-orange-500 to-red-500', appId: 'competitor-hub' },
    { name: 'Deal Data Room Automator', description: 'Streamline the creation and management of virtual data rooms for deals.', icon: Lightbulb, color: 'from-yellow-500 to-amber-500', appId: 'dataroom-automator' },
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
        <title>Project Automation & BD - Petrolord Suite</title>
        <meta name="description" content="Automate project workflows and enhance business development strategies." />
      </Helmet>

      <div className="p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-to-r from-fuchsia-500 to-purple-500 p-3 rounded-xl">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Project Automation & BD</h1>
              <p className="text-lime-200 text-lg">Streamline workflows and boost business development</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-12">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Automation & BD Applications</h2>
                    <Button onClick={() => handleFeatureClick('New Automation Tool')} className="bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700">
                    <Plus className="w-4 h-4 mr-2" /> New Tool
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {automationApps.map((app) => <AppCard key={app.name} app={app} />)}
                </div>
            </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProjectAutomation;