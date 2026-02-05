import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BarChart, ArrowLeft, DollarSign, TrendingUp, Clock, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const KpiCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white/5 p-4 rounded-lg flex items-center space-x-4">
    <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-slate-300">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const EpeResultsViewer = () => {
  const { runId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [results, setResults] = useState(null);
  const [runDetails, setRunDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const { data: runData, error: runError } = await supabase
        .from('epe_runs')
        .select('*, epe_cases(case_name)')
        .eq('id', runId)
        .single();

      if (runError) {
        toast({ title: 'Error', description: 'Could not fetch run details.', variant: 'destructive' });
        navigate('/dashboard/economic-project-management/epe/cases');
        return;
      }
      setRunDetails(runData);

      const { data: resultData, error: resultError } = await supabase
        .from('epe_results')
        .select('*')
        .eq('run_id', runId)
        .single();
      
      if (resultError) {
        toast({ title: 'Error', description: 'Could not fetch results for this run.', variant: 'destructive' });
      } else {
        setResults(resultData);
      }
      setLoading(false);
    };

    fetchResults();
  }, [runId, toast, navigate]);

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#e2e8f0' } },
      title: { display: true, text: 'Annual Cash Flow', color: '#f8fafc', font: { size: 16 } },
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
    },
  };

  const chartData = {
    labels: results?.cash_flow_data?.map(d => d.year) || [],
    datasets: [
      {
        label: 'Net Cash Flow',
        data: results?.cash_flow_data?.map(d => d.netCashFlow) || [],
        backgroundColor: 'rgba(74, 222, 128, 0.6)',
        borderColor: 'rgba(74, 222, 128, 1)',
        borderWidth: 1,
      },
      {
        label: 'Revenue',
        data: results?.cash_flow_data?.map(d => d.revenue) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        hidden: true,
      },
      {
        label: 'CAPEX',
        data: results?.cash_flow_data?.map(d => d.capex) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        hidden: true,
      },
      {
        label: 'OPEX',
        data: results?.cash_flow_data?.map(d => d.opex) || [],
        backgroundColor: 'rgba(249, 115, 22, 0.6)',
        hidden: true,
      },
    ],
  };

  if (loading) {
    return <div className="p-8 text-white">Loading results...</div>;
  }

  return (
    <>
      <Helmet><title>EPE Results: {runDetails?.run_name} - Petrolord</title></Helmet>
      <div className="p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link to={`/dashboard/economic-project-management/epe/cases/${runDetails?.case_id}`}>
              <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Case</Button>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-500 to-cyan-500 p-3 rounded-xl"><BarChart className="w-8 h-8 text-white" /></div>
            <div>
              <h1 className="text-4xl font-bold text-white">{runDetails?.run_name}</h1>
              <p className="text-lime-200 text-lg">Results for case: {runDetails?.epe_cases?.case_name}</p>
            </div>
          </div>
        </motion.div>

        {results ? (
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard icon={DollarSign} title="NPV @ 10%" value={formatCurrency(results.kpis.npv)} color="from-green-500 to-lime-500" />
                <KpiCard icon={TrendingUp} title="IRR" value={results.kpis.irr ? `${results.kpis.irr.toFixed(2)}%` : 'N/A'} color="from-blue-500 to-cyan-500" />
                <KpiCard icon={Clock} title="Payback" value={results.kpis.payback} color="from-orange-500 to-amber-500" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Cash Flow Analysis</h2>
              <div className="h-96">
                <Bar options={chartOptions} data={chartData} />
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-white">No Results Found</h3>
              <p className="text-lime-300 mt-2">Could not load the results for this economic run.</p>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default EpeResultsViewer;