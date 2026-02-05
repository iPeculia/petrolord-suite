import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Zap, Download, Upload, Eye, EyeOff, Share2, Save, ArrowLeft, GitBranch, Workflow } from 'lucide-react';
    import { Link } from 'react-router-dom';

    const Toolbar = ({ onSolve, onExport, onImport, onToggleLayer, readOnly, isReadOnlyView }) => {
      return (
        <motion.div 
          className="flex-shrink-0 bg-slate-900/70 backdrop-blur-lg border-b border-white/10 p-2 flex items-center justify-between"
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="flex items-center space-x-2">
             <Link to="/dashboard/production">
                <Button variant="outline" size="sm" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Production
                </Button>
              </Link>
          </div>
          <div className="flex-grow flex justify-center">
            <h1 className="text-lg font-bold text-white flex items-center">
              {isReadOnlyView ? <><GitBranch className="w-5 h-5 mr-2 text-blue-400"/> Injection Network</> : <><Workflow className="w-5 h-5 mr-2 text-lime-400"/> Network Diagram Pro</>}
              {isReadOnlyView && <span className="ml-2 text-xs font-normal text-blue-300 bg-blue-900/50 px-2 py-1 rounded-md">Read-Only View</span>}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {!readOnly && (
              <>
                <Button onClick={onSolve} className="bg-gradient-to-r from-lime-500 to-green-500">
                  <Zap className="w-4 h-4 mr-2" /> Solve Network
                </Button>
                <Button variant="outline"><Save className="w-4 h-4 mr-2" /> Save</Button>
                <Button variant="outline"><Upload className="w-4 h-4 mr-2" /> Import</Button>
                <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
              </>
            )}
            <Button variant="outline"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
          </div>
        </motion.div>
      );
    };

    export default Toolbar;