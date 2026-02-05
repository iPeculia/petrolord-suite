import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, List, Layers, BarChart3, Map, FileText, 
  Settings, RefreshCw, CheckCircle, AlertTriangle,
  Briefcase, Wand2, Zap, Share2, History,
  LayoutTemplate, Calculator, ChevronRight, Database
} from 'lucide-react';

// Sub-components (Simulated imports for single-file structure, but would be separate files in production)
import WellToSeismicTieHub from '@/components/welltoseismictie/WellToSeismicTieHub';
import QuickTieWorkflow from '@/components/welltoseismictie/QuickTieWorkflow';
import AdvancedTieLabWorkspace from '@/components/welltoseismictie/AdvancedTieLabWorkspace';
import SurveyDashboard from '@/components/welltoseismictie/SurveyDashboard';
import TieTemplateLibrary from '@/components/welltoseismictie/TieTemplateLibrary';

const WellToSeismicTie = () => {
  const [activeMode, setActiveMode] = useState('hub'); // hub, quick, advanced, dashboard, templates
  const [selectedWellId, setSelectedWellId] = useState(null);
  const [projectStats, setProjectStats] = useState({
    totalWells: 24,
    tiedWells: 14,
    avgCorrelation: 0.72,
    pendingReview: 5
  });

  // Navigation handler
  const handleNavigate = (mode, wellId = null) => {
    setActiveMode(mode);
    if (wellId) setSelectedWellId(wellId);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
      {/* Application Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-900/30 rounded-lg border border-purple-700/50">
            <Activity className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Well to Seismic Tie</h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>GeoScience Analytics</span>
              <span className="text-slate-600">•</span>
              <span>Project: North Sea Volve</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {activeMode !== 'hub' && (
            <Button variant="ghost" onClick={() => setActiveMode('hub')} className="text-slate-400 hover:text-white">
              Back to Hub
            </Button>
          )}
          <div className="h-6 w-px bg-slate-800 mx-2"></div>
          <Badge variant="outline" className="bg-emerald-950/30 text-emerald-400 border-emerald-800">
            <CheckCircle className="w-3 h-3 mr-1" /> System Online
          </Badge>
          <Button variant="outline" size="sm" className="border-slate-700">
            <Settings className="w-4 h-4 mr-2" /> Settings
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeMode === 'hub' && (
          <WellToSeismicTieHub 
            stats={projectStats} 
            onNavigate={handleNavigate} 
          />
        )}
        
        {activeMode === 'quick' && (
          <QuickTieWorkflow 
            onComplete={() => setActiveMode('hub')}
            onCancel={() => setActiveMode('hub')}
          />
        )}

        {activeMode === 'advanced' && (
          <AdvancedTieLabWorkspace 
            wellId={selectedWellId}
            onClose={() => setActiveMode('hub')}
          />
        )}

        {activeMode === 'dashboard' && (
          <SurveyDashboard 
            stats={projectStats}
          />
        )}

        {activeMode === 'templates' && (
          <TieTemplateLibrary />
        )}
      </div>
    </div>
  );
};

export default WellToSeismicTie;