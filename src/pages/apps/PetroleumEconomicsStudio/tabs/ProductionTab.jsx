import React, { useState } from 'react';
import ExcelLikeTable from '@/components/PetroleumEconomicsStudio/ExcelLikeTable';
import { usePetroleumEconomics } from '../contexts/PetroleumEconomicsContext';
import { Button } from '@/components/ui/button';
import { Upload, Copy, RotateCcw, BarChart3, List } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProductionTab = () => {
  const { productionData, setProductionData, modelSettings, streams } = usePetroleumEconomics();
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'charts'

  const columns = [
    { key: 'year', title: 'Year', readOnly: true, width: '80px', type: 'number' },
    ...streams.filter(s => s.active).map(s => ({
        key: `${s.id}_rate`,
        title: `${s.name} Rate`,
        width: '120px',
        type: 'number',
        formatter: (val) => val ? val.toLocaleString() : '-'
    })),
    { key: 'notes', title: 'Notes', width: '200px', type: 'text' }
  ];

  // Helper to reset data
  const handleReset = () => {
      // Basic reset to zero
      const newData = productionData.map(d => ({
          ...d,
          oil_rate: 0,
          gas_rate: 0,
          condensate_rate: 0
      }));
      setProductionData(newData);
  };

  const chartData = {
    labels: productionData.map(d => d.year),
    datasets: streams.filter(s => s.active).map((s, idx) => ({
        label: s.name,
        data: productionData.map(d => d[`${s.id}_rate`]),
        borderColor: idx === 0 ? '#10b981' : idx === 1 ? '#3b82f6' : '#f59e0b',
        backgroundColor: idx === 0 ? '#10b98150' : idx === 1 ? '#3b82f650' : '#f59e0b50',
        tension: 0.3
    }))
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'top', labels: { color: '#cbd5e1' } },
        title: { display: true, text: 'Production Profile', color: '#f1f5f9' },
    },
    scales: {
        y: {
            grid: { color: '#334155' },
            ticks: { color: '#94a3b8' }
        },
        x: {
            grid: { color: '#334155' },
            ticks: { color: '#94a3b8' }
        }
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center px-1">
        <div className="flex gap-2">
            <Button 
                variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('table')}
            >
                <List className="w-4 h-4 mr-2" /> Table Input
            </Button>
            <Button 
                variant={viewMode === 'charts' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('charts')}
            >
                <BarChart3 className="w-4 h-4 mr-2" /> Visuals
            </Button>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800">
                <Upload className="w-4 h-4 mr-2" /> Import CSV
            </Button>
            <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
        </div>
      </div>

      <Card className="flex-1 bg-slate-900 border-slate-800 overflow-hidden relative">
        {viewMode === 'table' ? (
            <div className="absolute inset-0 p-4">
                <ExcelLikeTable 
                    columns={columns} 
                    data={productionData} 
                    onDataChange={setProductionData} 
                    rowKey="year"
                />
            </div>
        ) : (
            <div className="absolute inset-0 p-6 flex flex-col">
                <div className="flex-1 min-h-0">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        )}
      </Card>
    </div>
  );
};

export default ProductionTab;