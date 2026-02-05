import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand as MagicWand, Sparkles, GitCompare } from 'lucide-react';
import SimilarityAnalyzer from './SimilarityAnalyzer';
import HorizonSuggestions from './HorizonSuggestions';

const CorrelationAssistant = () => {
  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 w-80">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-slate-200">Correlation AI</h3>
        </div>
        <p className="text-xs text-slate-500">Automated insights & suggestions</p>
      </div>

      <Tabs defaultValue="similarity" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 bg-slate-950 p-1">
          <TabsTrigger value="similarity" className="text-xs">Similarity</TabsTrigger>
          <TabsTrigger value="suggestions" className="text-xs">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="similarity" className="flex-1 p-0">
          <SimilarityAnalyzer />
        </TabsContent>
        
        <TabsContent value="suggestions" className="flex-1 p-0">
          <HorizonSuggestions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CorrelationAssistant;