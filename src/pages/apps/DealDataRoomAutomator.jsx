import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { generateDataRoomAnalytics } from '@/utils/dataRoomGenerator';
import InputPanel from '@/components/dataroom/InputPanel';
import DashboardPanel from '@/components/dataroom/DashboardPanel';
import EmptyState from '@/components/dataroom/EmptyState';

const DealDataRoomAutomator = () => {
  const [dataRoom, setDataRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = (inputs) => {
    setLoading(true);
    setDataRoom(null);

    setTimeout(() => {
      try {
        const analytics = generateDataRoomAnalytics(inputs);
        setDataRoom({ inputs, analytics });
        toast({
          title: "Data Room Analytics Generated!",
          description: "Your Deal Data Room dashboard is ready.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    }, 2500);
  };

  const initialInputs = {
    dataRoomName: "Deepwater Block A Divestment",
    seller: "Petrolord Inc.",
    description: "Divestment of 50% non-operated interest in Deepwater Block A.",
    region: "Nigeria",
  };

  return (
    <>
      <Helmet>
        <title>Deal Data Room Automator - Petrolord Suite</title>
        <meta name="description" content="Intelligently manage virtual data rooms for M&A and farm-outs." />
      </Helmet>
      <div className="flex h-full">
        <div className="w-full md:w-2/5 xl:w-1/3 p-6 bg-slate-900/50 backdrop-blur-lg border-r border-white/10 overflow-y-auto">
          <InputPanel onGenerate={handleGenerate} loading={loading} initialInputs={initialInputs} />
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {!dataRoom && !loading && (
            <EmptyState onGenerate={() => handleGenerate(initialInputs)} />
          )}
          {loading && (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-400 mx-auto"></div>
                    <p className="text-white mt-4 text-lg">Setting Up Data Room...</p>
                    <p className="text-lime-300">Generating structure and analytics dashboard.</p>
                </div>
            </div>
          )}
          {dataRoom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <DashboardPanel dataRoom={dataRoom} />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default DealDataRoomAutomator;