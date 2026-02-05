import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Sparkles, Check, ArrowRight, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const AIVelocityModelSuggester = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState(null);

  const runAnalysis = () => {
    setAnalyzing(true);
    // Simulate AI processing
    setTimeout(() => {
      setAnalyzing(false);
      setSuggestions([
        { 
          layer: 'Overburden', 
          current: { v0: 1600, k: 0.3 }, 
          suggested: { v0: 1650, k: 0.45 }, 
          confidence: 92, 
          reason: "Regional trend analysis suggests higher shallow compaction." 
        },
        { 
          layer: 'Reservoir Sand', 
          current: { v0: 2800, k: 0.1 }, 
          suggested: { v0: 2750, k: 0.15 }, 
          confidence: 85, 
          reason: "Sonic log correlation indicates slightly lower interval velocity." 
        }
      ]);
    }, 2000);
  };

  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
                <CardTitle className="text-sm font-medium text-slate-200">AI Parameter Suggester</CardTitle>
            </div>
            {suggestions && <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-400" onClick={runAnalysis}><RefreshCw className="w-3 h-3 mr-1"/> Re-run</Button>}
        </div>
        <CardDescription className="text-xs text-slate-500">
            Machine learning model trained on 450+ regional wells to suggest optimal V0 and k parameters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!suggestions && !analyzing && (
            <div className="flex flex-col items-center justify-center h-48 space-y-4 text-center">
                <div className="p-4 bg-slate-950 rounded-full border border-slate-800">
                    <Sparkles className="w-8 h-8 text-purple-500" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm text-slate-300 font-medium">Ready to Analyze</p>
                    <p className="text-xs text-slate-500 max-w-[200px] mx-auto">AI will scan well logs and checkshots to recommend velocity updates.</p>
                </div>
                <Button onClick={runAnalysis} className="bg-purple-600 hover:bg-purple-500 text-xs">
                    <BrainCircuit className="w-3 h-3 mr-2" /> Analyze Current Model
                </Button>
            </div>
        )}

        {analyzing && (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                <p className="text-xs text-slate-400 animate-pulse">Analyzing velocity trends...</p>
            </div>
        )}

        {suggestions && (
            <div className="space-y-4">
                {suggestions.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded border border-slate-800 hover:border-purple-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-slate-200">{item.layer}</span>
                            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/5">
                                {item.confidence}% Confidence
                            </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="p-2 bg-slate-900 rounded border border-slate-800/50">
                                <span className="text-[10px] text-slate-500 block mb-1">Current</span>
                                <div className="text-xs font-mono text-slate-400">V0: {item.current.v0}</div>
                                <div className="text-xs font-mono text-slate-400">k: {item.current.k}</div>
                            </div>
                            <div className="p-2 bg-purple-900/10 rounded border border-purple-500/30 relative">
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 text-slate-600"><ArrowRight className="w-3 h-3"/></div>
                                <span className="text-[10px] text-purple-400 block mb-1 font-bold">AI Suggestion</span>
                                <div className="text-xs font-mono text-white">V0: {item.suggested.v0}</div>
                                <div className="text-xs font-mono text-white">k: {item.suggested.k}</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] text-slate-500 italic flex-1 mr-2">"{item.reason}"</p>
                            <Button size="sm" className="h-6 text-[10px] bg-emerald-600 hover:bg-emerald-500">
                                <Check className="w-3 h-3 mr-1" /> Apply
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIVelocityModelSuggester;