import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Activity, AlertTriangle, FileText, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react';

const PPFGIntegrationPanel = ({ project, onRefresh }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const handleImportRisks = async () => {
    setLoading(true);
    // Simulate checking PPFG app for risks
    // In a real scenario, we would query 'ppfg_risks' table or similar
    
    const newRisks = [
        {
            project_id: project.id,
            title: 'PPFG: High Overpressure Zone Detected',
            description: 'Significant ramp in pore pressure detected at 3200m based on Eaton calculation.',
            category: 'Drilling',
            probability: 4,
            impact: 5,
            risk_score: 20,
            ppfg_source: true,
            status: 'Open'
        },
        {
            project_id: project.id,
            title: 'PPFG: Narrow Drilling Window',
            description: 'Fracture gradient and pore pressure convergence at reservoir top.',
            category: 'Drilling',
            probability: 5,
            impact: 4,
            risk_score: 20,
            ppfg_source: true,
            status: 'Open'
        }
    ];

    const { error } = await supabase.from('risks').insert(newRisks);
    
    // Log integration
    await supabase.from('pm_integration_logs').insert({
        project_id: project.id,
        app_name: 'PPFG',
        action: 'Import Risks',
        status: error ? 'Failed' : 'Success',
        details: error ? error.message : 'Imported 2 critical risks'
    });

    setLoading(false);

    if (error) {
        toast({ variant: 'destructive', title: 'Import Failed', description: error.message });
    } else {
        toast({ title: 'Risks Imported', description: '2 high-priority risks added to register.' });
        onRefresh();
    }
  };

  const handleCreateDeliverable = async () => {
      setLoading(true);
      const { error } = await supabase.from('pm_deliverables').insert({
          project_id: project.id,
          name: `PPFG Prognosis Report - ${new Date().toISOString().split('T')[0]}`,
          app_source: 'PPFG',
          status: 'Draft',
          version: 'v1.0'
      });
      setLoading(false);
      if(!error) {
          toast({ title: 'Deliverable Created', description: 'Prognosis report added to deliverables.' });
          onRefresh();
      }
  };

  const handleCreateTasks = async () => {
      setLoading(true);
      const tasks = [
          { project_id: project.id, name: 'Calibrate Eaton Model', owner: 'Pore Pressure Specialist', status: 'To Do', planned_start_date: new Date(), planned_end_date: new Date() },
          { project_id: project.id, name: 'Update Pre-drill Risk Chart', owner: 'Drilling Engineer', status: 'To Do', planned_start_date: new Date(), planned_end_date: new Date() }
      ];
      const { error } = await supabase.from('tasks').insert(tasks);
      setLoading(false);
      if(!error) {
          toast({ title: 'Tasks Created', description: 'Workflows generated from PPFG requirements.' });
          onRefresh();
      }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-base flex items-center gap-2 text-white">
                        <Activity className="w-5 h-5 text-blue-400" />
                        Pore Pressure (PPFG) Integration
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        Sync prognosis, risks, and drilling windows.
                    </CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Connected
                </Badge>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-800/50 rounded border border-slate-700 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-300 font-medium text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-400" /> Risk Management
                    </div>
                    <p className="text-xs text-slate-500">Auto-detect hazards from pre-risk charts.</p>
                    <Button size="sm" variant="secondary" onClick={handleImportRisks} disabled={loading} className="w-full mt-auto">
                        {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Scan & Import Risks'}
                    </Button>
                </div>

                <div className="p-3 bg-slate-800/50 rounded border border-slate-700 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-300 font-medium text-sm">
                        <FileText className="w-4 h-4 text-blue-400" /> Deliverables
                    </div>
                    <p className="text-xs text-slate-500">Link prognosis reports to stage gates.</p>
                    <Button size="sm" variant="secondary" onClick={handleCreateDeliverable} disabled={loading} className="w-full mt-auto">
                        Generate Prognosis
                    </Button>
                </div>

                 <div className="p-3 bg-slate-800/50 rounded border border-slate-700 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-300 font-medium text-sm">
                        <RefreshCw className="w-4 h-4 text-purple-400" /> Workflows
                    </div>
                    <p className="text-xs text-slate-500">Generate calibration and update tasks.</p>
                    <Button size="sm" variant="secondary" onClick={handleCreateTasks} disabled={loading} className="w-full mt-auto">
                        Create Tasks
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
  );
};

export default PPFGIntegrationPanel;