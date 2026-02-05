import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Play } from 'lucide-react';

    const EmptyState = ({ onAnalyze }) => {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-700">
          <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-cyan-900 to-blue-900 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Pipeline Sizer</h2>
          <p className="text-slate-400 max-w-md mb-6">
            Define your fluid properties, pipeline geometry, and operating conditions to find the optimal pipeline diameter. The engine analyzes hydraulics, flow assurance, and integrity.
          </p>
          <Button onClick={onAnalyze} className="bg-lime-600 hover:bg-lime-700">
            <Play className="w-4 h-4 mr-2" />
            Run Default Analysis
          </Button>
        </div>
      );
    };

    export default EmptyState;