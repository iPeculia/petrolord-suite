import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Download, Save, Share2, Wand2, Settings2 } from 'lucide-react';

// --- Mode Selector ---
export const ModeSelector = ({ mode, setMode }) => (
  <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
    <button
      onClick={() => setMode('guided')}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
        mode === 'guided' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      <Wand2 className="w-4 h-4" /> Guided Mode
    </button>
    <button
      onClick={() => setMode('expert')}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
        mode === 'expert' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      <Settings2 className="w-4 h-4" /> Expert Mode
    </button>
  </div>
);

// --- Export Panel ---
export const ExportPanel = () => (
  <Card className="bg-slate-900 border-slate-800">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-slate-200">Export Results</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <Button variant="outline" className="w-full justify-start text-xs border-slate-700">
        <Download className="w-3 h-3 mr-2 text-emerald-400" /> Export LAS (PP/FG Curves)
      </Button>
      <Button variant="outline" className="w-full justify-start text-xs border-slate-700">
        <Share2 className="w-3 h-3 mr-2 text-blue-400" /> Send to Well Planning
      </Button>
      <Button variant="outline" className="w-full justify-start text-xs border-slate-700">
        <Save className="w-3 h-3 mr-2 text-purple-400" /> Save Project Snapshot
      </Button>
    </CardContent>
  </Card>
);

// --- Method Selector (Simple) ---
export const MethodSelector = ({ method, setMethod, type = 'pp' }) => (
  <div className="space-y-2">
    <Label className="text-xs text-slate-400">{type === 'pp' ? 'Pore Pressure Method' : 'Fracture Gradient Method'}</Label>
    <Select value={method} onValueChange={setMethod}>
      <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-700">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-slate-900 border-slate-800">
        {type === 'pp' ? (
          <>
            <SelectItem value="eaton_sonic">Eaton (Sonic)</SelectItem>
            <SelectItem value="eaton_res">Eaton (Resistivity)</SelectItem>
            <SelectItem value="bowers">Bowers (Velocity)</SelectItem>
            <SelectItem value="equivalent_depth">Equivalent Depth</SelectItem>
          </>
        ) : (
          <>
            <SelectItem value="matthews_kelly">Matthews-Kelly</SelectItem>
            <SelectItem value="hubbert_willis">Hubbert-Willis</SelectItem>
            <SelectItem value="eaton_fg">Eaton FG</SelectItem>
          </>
        )}
      </SelectContent>
    </Select>
  </div>
);