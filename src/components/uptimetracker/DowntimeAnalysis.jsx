import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import { PieChart, List, BrainCircuit, Search } from 'lucide-react';
import CollapsibleSection from './CollapsibleSection';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DowntimeAnalysis = ({ paretoData, eventLog }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const paretoOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Downtime by Reason', color: '#e2e8f0' },
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
    },
  };

  const paretoChartData = {
    labels: paretoData.labels,
    datasets: [{
      label: 'Downtime Hours',
      data: paretoData.data,
      backgroundColor: 'rgba(239, 68, 68, 0.6)',
      borderColor: 'rgba(239, 68, 68, 1)',
      borderWidth: 1,
    }],
  };
  
  const filteredEvents = eventLog.filter(event => 
    event.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.asset.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAiClick = () => {
    toast({
        title: "🤖 AI Analysis In Progress...",
        description: "Suggesting root causes. This requires a backend with NLP capabilities.",
    });
  };

  return (
    <CollapsibleSection title="Downtime Analysis & Root Cause" icon={<PieChart />} defaultOpen>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96 bg-white/5 p-4 rounded-lg">
          <Bar options={paretoOptions} data={paretoChartData} />
        </div>
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center"><BrainCircuit className="w-5 h-5 mr-2" /> Root Cause Analysis Assistant (AI)</h3>
          <p className="text-sm text-lime-300 mb-4">Select an event and let AI suggest potential root causes.</p>
           <Button onClick={handleAiClick} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">Suggest Root Causes</Button>
        </div>
      </div>
      <div className="mt-6 bg-white/5 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center"><List className="w-5 h-5 mr-2" /> Downtime Event Log</h3>
        <div className="relative mb-4">
            <Input 
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-lime-300 uppercase bg-white/10">
              <tr>
                <th scope="col" className="px-4 py-2">Date</th>
                <th scope="col" className="px-4 py-2">Asset</th>
                <th scope="col" className="px-4 py-2">Duration (Hrs)</th>
                <th scope="col" className="px-4 py-2">Category</th>
                <th scope="col" className="px-4 py-2">Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-2 whitespace-nowrap">{event.date}</td>
                  <td className="px-4 py-2">{event.asset}</td>
                  <td className="px-4 py-2">{event.duration}</td>
                  <td className="px-4 py-2">{event.category}</td>
                  <td className="px-4 py-2">{event.reason}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default DowntimeAnalysis;