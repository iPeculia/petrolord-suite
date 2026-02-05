import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play } from 'lucide-react';
import SimilarityResults from './SimilarityResults';
import { useWellManager } from '@/hooks/useWellCorrelation';

const SimilarityAnalyzer = () => {
  const { wells } = useWellManager();
  const [sourceWell, setSourceWell] = useState(wells[0]?.id);
  const [targetWell, setTargetWell] = useState(wells[1]?.id);
  const [curveType, setCurveType] = useState('GR');
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRun = () => {
    setIsAnalyzing(true);
    // Simulate async analysis
    setTimeout(() => {
      setResult({
        score: 0.85,
        confidence: 'High',
        zones: [
          { start: 1200, end: 1250, similarity: 0.92 },
          { start: 1400, end: 1450, similarity: 0.78 }
        ]
      });
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Source Well</Label>
          <Select value={sourceWell} onValueChange={setSourceWell}>
            <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-800">
              <SelectValue placeholder="Select Well" />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border-slate-800">
              {wells.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Target Well</Label>
          <Select value={targetWell} onValueChange={setTargetWell}>
            <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-800">
              <SelectValue placeholder="Select Well" />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border-slate-800">
              {wells.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Curve to Correlate</Label>
          <Select value={curveType} onValueChange={setCurveType}>
            <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border-slate-800">
              <SelectItem value="GR">Gamma Ray (GR)</SelectItem>
              <SelectItem value="RES">Resistivity (RES)</SelectItem>
              <SelectItem value="NPHI">Neutron (NPHI)</SelectItem>
              <SelectItem value="RHOB">Density (RHOB)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="w-full bg-purple-600 hover:bg-purple-500 text-white" 
          onClick={handleRun}
          disabled={isAnalyzing || !sourceWell || !targetWell}
        >
          {isAnalyzing ? 'Analyzing...' : <><Play className="w-3 h-3 mr-2" /> Run Analysis</>}
        </Button>
      </div>

      <ScrollArea className="flex-1 border-t border-slate-800 pt-4">
        {result && <SimilarityResults data={result} />}
      </ScrollArea>
    </div>
  );
};

export default SimilarityAnalyzer;