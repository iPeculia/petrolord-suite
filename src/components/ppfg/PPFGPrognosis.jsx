import React, { useRef } from 'react';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Scatter } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';

const PPFGPrognosis = ({ data, markers }) => {
  const chartRef = useRef(null);

  const handleExport = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'PPFG_Prognosis.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">PPFG Prognosis Chart</h3>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" onClick={handleExport}><Download className="w-4 h-4 mr-2"/> PNG</Button>
        </div>
      </div>
      
      <div className="flex-1 min-h-[500px]" ref={chartRef}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            layout="vertical"
            data={data}
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              type="number" 
              domain={[8, 20]} 
              orientation="top" 
              label={{ value: 'Pressure Gradient (ppg)', position: 'top', offset: 10, fill: '#475569' }} 
              stroke="#475569"
            />
            <YAxis 
              type="number" 
              dataKey="depth" 
              reversed={true} 
              label={{ value: 'Depth (ft)', angle: -90, position: 'insideLeft', fill: '#475569' }}
              stroke="#475569"
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '6px', border: '1px solid #e2e8f0' }}
              labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Legend verticalAlign="top" height={36} />

            {/* Overburden */}
            <Line dataKey="obg" stroke="#1e293b" strokeWidth={2} name="Overburden (OBG)" dot={false} />

            {/* Pore Pressure Envelope */}
            <Area dataKey="pp_high" dataKey1="pp_low" stroke="none" fill="#3b82f6" fillOpacity={0.1} name="PP Uncertainty" />
            <Line dataKey="pp" stroke="#3b82f6" strokeWidth={2} name="Pore Pressure (PP)" dot={false} />

            {/* Fracture Gradient Envelope */}
            <Area dataKey="fg_high" dataKey1="fg_low" stroke="none" fill="#ef4444" fillOpacity={0.1} name="FG Uncertainty" />
            <Line dataKey="fg" stroke="#ef4444" strokeWidth={2} name="Fracture Gradient (FG)" dot={false} />

            {/* Min Stress */}
            <Line dataKey="min_stress" stroke="#8b5cf6" strokeDasharray="5 5" strokeWidth={1.5} name="Min Stress (Shmin)" dot={false} />

            {/* Markers */}
            {markers && markers.map((marker, idx) => (
              <ReferenceLine 
                key={idx} 
                y={marker.depth} 
                stroke={marker.type === 'LOT' ? '#f59e0b' : marker.type === 'RFT' ? '#10b981' : '#6366f1'} 
                strokeDasharray="3 3" 
                label={{ position: 'insideRight', value: `${marker.type}: ${marker.value}`, fill: '#475569', fontSize: 10 }} 
              />
            ))}
            
            {/* Scatter for marker points just to visualize them on x-axis if needed */}
             <Scatter name="Calibration Points" data={markers} fill="#f59e0b" shape="circle" />

          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PPFGPrognosis;