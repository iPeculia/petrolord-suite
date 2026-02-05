import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlayCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/customSupabaseClient';

const EpeRunConsole = () => {
  const { id: caseId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [runName, setRunName] = useState(`Run ${new Date().toLocaleString()}`);
  const [params, setParams] = useState({
    discountRate: 10,
    oilPrice: 70,
    gasPrice: 3,
    royalty: 12.5,
    tax: 35,
    inflation: 2,
  });

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated.");

      const { data: functionData, error: functionError } = await supabase.functions.invoke('epe-cash-flow-engine', {
        body: { caseId, params },
      });

      if (functionError) throw functionError;

      const { kpis, cashFlowData } = functionData;

      const { data: runData, error: runError } = await supabase
        .from('epe_runs')
        .insert({
          case_id: caseId,
          user_id: user.id,
          run_name: runName,
          parameters: params,
        })
        .select()
        .single();

      if (runError) throw runError;

      const { error: resultError } = await supabase
        .from('epe_results')
        .insert({
          run_id: runData.id,
          user_id: user.id,
          kpis,
          cash_flow_data: cashFlowData,
        });

      if (resultError) throw resultError;

      toast({ title: 'Success', description: 'Economic analysis completed.' });
      navigate(`/dashboard/economic-project-management/epe/runs/${runData.id}`);

    } catch (error) {
      console.error('Economic run failed:', error);
      toast({
        title: "Run Failed",
        description: error.message || "An unexpected error occurred.",
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <Helmet><title>Run Console: Case {caseId} - EPE</title></Helmet>
      <div className="p-8 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <Link to={`/dashboard/economic-project-management/epe/cases/${caseId}`} className="mb-4 inline-block">
            <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Case Details</Button>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl"><PlayCircle className="w-8 h-8 text-white" /></div>
            <div>
              <h1 className="text-4xl font-bold text-white">Run Console</h1>
              <p className="text-lime-200 text-lg">Case ID: {caseId}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="runName" className="text-white">Run Name</Label>
              <Input id="runName" value={runName} onChange={(e) => setRunName(e.target.value)} className="bg-gray-800 border-slate-600 text-white" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(params).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key} className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                  <Input type="number" id={key} name={key} value={value} onChange={handleParamChange} className="bg-gray-800 border-slate-600 text-white" />
                </div>
              ))}
            </div>
            <Button onClick={handleRun} disabled={isRunning} className="w-full text-lg py-6 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600">
              {isRunning ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <PlayCircle className="mr-2 h-6 w-6" />}
              {isRunning ? 'Running Analysis...' : 'Run Economic Analysis'}
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default EpeRunConsole;