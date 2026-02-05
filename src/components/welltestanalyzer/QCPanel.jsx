import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import CollapsibleSection from './CollapsibleSection';
import { Line, Scatter } from 'react-chartjs-2';
import { SlidersHorizontal, Droplets, Check, X, BarChart } from 'lucide-react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, CategoryScale, LogarithmicScale } from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend, CategoryScale, LogarithmicScale);

const QCPanel = ({ data, headers, fileName, onConfirm, onCancel, defaultValues }) => {
  const [timeCol, setTimeCol] = useState(headers.find(h => h.toLowerCase().includes('time')) || '');
  const [pressureCol, setPressureCol] = useState(headers.find(h => h.toLowerCase().includes('press')) || '');
  const [rateCol, setRateCol] = useState(headers.find(h => h.toLowerCase().includes('rate')) || '');
  const [model, setModel] = useState('homogeneous_wbs_skin');
  const [inputs, setInputs] = useState(defaultValues);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const chartData = {
    labels: data.map(row => row[timeCol] || 0),
    datasets: [
      {
        label: 'Pressure',
        data: data.map(row => row[pressureCol] || null),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'yPressure',
        type: 'line',
        pointRadius: 1,
      },
      {
        label: 'Rate',
        data: data.map(row => row[rateCol] || null),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        yAxisID: 'yRate',
        type: 'line',
        stepped: true,
        pointRadius: 1,
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#e2e8f0' } },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { 
        type: 'logarithmic',
        title: { text: `Time (${timeCol || 'N/A'})`, display: true, color: '#94a3b8' }, 
        ticks: { color: '#94a3b8' }, 
        grid: { color: 'rgba(255, 255, 255, 0.1)' } 
      },
      yPressure: { 
        position: 'left',
        title: { text: `Pressure (${pressureCol || 'N/A'})`, display: true, color: '#94a3b8' }, 
        ticks: { color: '#94a3b8' }, 
        grid: { color: 'rgba(255, 255, 255, 0.1)' } 
      },
      yRate: {
        position: 'right',
        title: { text: `Rate (${rateCol || 'N/A'})`, display: true, color: '#94a3b8' },
        ticks: { color: '#94a3b8' },
        grid: { drawOnChartArea: false },
      }
    }
  };

  const handleConfirm = () => {
    const mappedData = data.map(row => ({
      time: parseFloat(row[timeCol]),
      pressure: parseFloat(row[pressureCol]),
      rate: parseFloat(row[rateCol] || 0)
    })).filter(row => !isNaN(row.time) && !isNaN(row.pressure));
    onConfirm(mappedData, inputs, model);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row gap-6 h-full text-white">
      <div className="w-full lg:w-1/3 space-y-4 flex-shrink-0">
        <h2 className="text-2xl font-bold">Data Quality Control</h2>
        <p className="text-sm text-slate-400">File: <span className="font-semibold text-lime-400">{fileName}</span></p>

        <CollapsibleSection title="Column Mapping" icon={<BarChart />} defaultOpen>
          <div className="space-y-4 p-2">
            <div><Label className="text-slate-300">Time Column</Label><Select onValueChange={setTimeCol} defaultValue={timeCol}><SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue placeholder="Select time..." /></SelectTrigger><SelectContent className="bg-slate-800 text-white border-slate-600">{headers.map(h => <SelectItem className="hover:bg-slate-700 focus:bg-slate-600" key={h} value={h}>{h}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className="text-slate-300">Pressure Column</Label><Select onValueChange={setPressureCol} defaultValue={pressureCol}><SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue placeholder="Select pressure..." /></SelectTrigger><SelectContent className="bg-slate-800 text-white border-slate-600">{headers.map(h => <SelectItem className="hover:bg-slate-700 focus:bg-slate-600" key={h} value={h}>{h}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className="text-slate-300">Rate Column (Optional)</Label><Select onValueChange={setRateCol} defaultValue={rateCol}><SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue placeholder="Select rate..." /></SelectTrigger><SelectContent className="bg-slate-800 text-white border-slate-600">{headers.map(h => <SelectItem className="hover:bg-slate-700 focus:bg-slate-600" key={h} value={h}>{h}</SelectItem>)}</SelectContent></Select></div>
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Model & Fit" icon={<SlidersHorizontal />} defaultOpen>
          <div className="p-2">
            <Label className="text-slate-300">Analysis Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-slate-800 text-white border-slate-600">
                <SelectItem className="hover:bg-slate-700 focus:bg-slate-600" value="homogeneous_wbs_skin">Homogeneous + WBS/Skin</SelectItem>
                <SelectItem className="hover:bg-slate-700 focus:bg-slate-600" value="dual_porosity">Dual Porosity (PSSH)</SelectItem>
                <SelectItem className="hover:bg-slate-700 focus:bg-slate-600" value="vertical_wells_nf">Vertical Well, Natural Fractures</SelectItem>
                <SelectItem className="hover:bg-slate-700 focus:bg-slate-600" value="horizontal_well">Horizontal Well</SelectItem>
                <SelectItem className="hover:bg-slate-700 focus:bg-slate-600" value="linear_boundary">Linear Boundary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Fluid & Reservoir Properties" icon={<Droplets />}>
          <div className="grid grid-cols-2 gap-4 p-2">
            <div><Label className="text-slate-300">Viscosity (cP)</Label><Input type="number" step="0.1" value={inputs.viscosity} onChange={(e) => handleInputChange('viscosity', Number(e.target.value))} /></div>
            <div><Label className="text-slate-300">Comp. (1/psi)</Label><Input type="number" step="1e-6" value={inputs.compressibility} onChange={(e) => handleInputChange('compressibility', Number(e.target.value))} /></div>
            <div><Label className="text-slate-300">FVF (bbl/STB)</Label><Input type="number" step="0.01" value={inputs.fvf} onChange={(e) => handleInputChange('fvf', Number(e.target.value))} /></div>
            <div><Label className="text-slate-300">Porosity (fr)</Label><Input type="number" step="0.01" value={inputs.porosity} onChange={(e) => handleInputChange('porosity', Number(e.target.value))} /></div>
            <div><Label className="text-slate-300">Thickness (ft)</Label><Input type="number" value={inputs.thickness} onChange={(e) => handleInputChange('thickness', Number(e.target.value))} /></div>
            <div><Label className="text-slate-300">Radius (ft)</Label><Input type="number" step="0.05" value={inputs.wellboreRadius} onChange={(e) => handleInputChange('wellboreRadius', Number(e.target.value))} /></div>
            <div className="col-span-2"><Label className="text-slate-300">Initial Pressure (psi)</Label><Input type="number" value={inputs.initialPressure} onChange={(e) => handleInputChange('initialPressure', Number(e.target.value))} /></div>
          </div>
        </CollapsibleSection>

        <div className="flex space-x-2 pt-4">
          <Button onClick={handleConfirm} className="w-full bg-lime-600 hover:bg-lime-700 text-slate-900 font-bold" disabled={!timeCol || !pressureCol}>
            <Check className="w-4 h-4 mr-2" /> Confirm & Fit
          </Button>
          <Button onClick={onCancel} variant="outline" className="w-full text-slate-300 border-slate-600 hover:bg-slate-700">
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-slate-800/30 rounded-lg p-4 border border-slate-700 flex flex-col min-h-0">
        <h3 className="text-lg font-semibold text-white mb-2">QC Plot & Data Preview</h3>
        <div className="relative h-64 md:h-1/2">
            {timeCol && pressureCol ? <Line data={chartData} options={chartOptions} /> : <div className="flex items-center justify-center h-full text-slate-500">Please select time and pressure columns to see a preview.</div>}
        </div>
        <div className="flex-grow min-h-0 mt-4">
          <ScrollArea className="h-full">
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-800/50">
                        {headers.map(h => <TableHead key={h} className="text-slate-400">{h}</TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.slice(0, 100).map((row, i) => (
                        <TableRow key={i} className="border-slate-700 hover:bg-slate-800/50">
                           {headers.map(h => <TableCell key={h} className="text-slate-300 text-xs">{row[h]}</TableCell>)}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </motion.div>
  );
};

export default QCPanel;