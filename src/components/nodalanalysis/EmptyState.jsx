import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { GitBranch, Play, TrendingUp, Target } from 'lucide-react';

    const EmptyState = ({ onAnalyze }) => {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-800/30 rounded-xl shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.2 }}
            className="relative p-6 rounded-full bg-blue-600/80 shadow-lg mb-8"
          >
            <GitBranch className="w-16 h-16 text-white" />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="absolute -top-2 -right-2 p-2 bg-lime-400 rounded-full"
            >
              <TrendingUp className="w-6 h-6 text-slate-900" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="absolute -bottom-2 -left-2 p-2 bg-purple-400 rounded-full"
            >
              <Target className="w-6 h-6 text-slate-900" />
            </motion.div>
          </motion.div>

          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Unleash Production Potential
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mb-8">
            Dive deep into your well's performance. Configure reservoir, wellbore, and surface parameters to pinpoint optimal operating points, diagnose issues, and forecast future production with precision.
          </p>
          <Button
            onClick={onAnalyze}
            className="bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-slate-900 font-bold py-4 px-10 text-xl rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <Play className="w-6 h-6 mr-3" />
            Run Analysis
          </Button>
        </motion.div>
      );
    };

    export default EmptyState;