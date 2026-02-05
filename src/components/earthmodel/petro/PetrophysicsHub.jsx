import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Droplet, Activity, TrendingUp, Zap, FileSpreadsheet, BarChart2, Plus, Layers, Wind } from 'lucide-react';
import PetrophysicalCrossPlot from './PetrophysicalCrossPlot';
import PetrophysicalDepthProfile from './PetrophysicalDepthProfile';
import CapillaryPressureCurveViewer from './CapillaryPressureCurveViewer';

const AnalysisCard = ({ title, description, icon: Icon, color, onClick }) => (
  <Card 
    className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
    onClick={onClick}
  >
    <CardContent className="p-6">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </CardContent>
  </Card>
);

const PetrophysicsHub = ({ onViewChange }) => {
  return (
    <div className="h-full bg-slate-950 p-6 flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Petrophysics Hub</h1>
          <p className="text-slate-400">Advanced rock property analysis and fluid saturation modeling.</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-500" onClick={() => onViewChange('properties')}>
          <Plus className="w-4 h-4 mr-2" /> New Analysis
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Module Selection */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnalysisCard 
              title="Property Definition" 
              description="Manage porosity, permeability models."
              icon={FileSpreadsheet}
              color="bg-blue-500"
              onClick={() => onViewChange('properties')}
            />
            <AnalysisCard 
              title="Porosity Analysis" 
              description="Total vs Effective porosity."
              icon={Layers}
              color="bg-orange-500"
              onClick={() => onViewChange('porosity')}
            />
            <AnalysisCard 
              title="Cross-Plot Analysis" 
              description="Multi-well regression tools."
              icon={TrendingUp}
              color="bg-pink-500"
              onClick={() => onViewChange('crossplots')}
            />
            <AnalysisCard 
              title="Rock Physics" 
              description="Gassmann fluid substitution."
              icon={Activity}
              color="bg-rose-500"
              onClick={() => onViewChange('rockphysics')}
            />
          </div>

          {/* Preview Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-80">
            <PetrophysicalCrossPlot />
            <CapillaryPressureCurveViewer />
          </div>
        </div>

        {/* Side Panel: Logs & Recent */}
        <div className="flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 min-h-[300px]">
            <PetrophysicalDepthProfile />
          </div>
          
          <Card className="bg-slate-900 border-slate-800 shrink-0">
            <CardHeader>
              <CardTitle className="text-white">Recent Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-slate-800 text-purple-400">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-white">Porosity_Model_v{i}</h4>
                        <p className="text-[10px] text-slate-500">2h ago • Well-A{i}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Valid</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PetrophysicsHub;