import React from 'react';
import { useDeclineCurve } from '@/contexts/DeclineCurveContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplets, Flame, Waves } from 'lucide-react';

const DCAMultiStreamAnalysis = () => {
  const { selectedStream, setSelectedStream } = useDeclineCurve();

  return (
    <div className="mb-4">
      <label className="text-xs font-medium text-slate-400 uppercase mb-2 block">Production Stream</label>
      <Tabs value={selectedStream} onValueChange={setSelectedStream} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="oil" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            <Droplets size={14} className="mr-2" /> Oil
          </TabsTrigger>
          <TabsTrigger value="gas" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
            <Flame size={14} className="mr-2" /> Gas
          </TabsTrigger>
          <TabsTrigger value="water" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Waves size={14} className="mr-2" /> Water
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DCAMultiStreamAnalysis;