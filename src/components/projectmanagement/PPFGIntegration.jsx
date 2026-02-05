import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Activity, Import } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const PPFGIntegration = ({ project, onRisksImported }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedRisks, setSelectedRisks] = useState({});

  // Mock PPFG data (In real app, we would query `ppfg_prognosis` table)
  const mockPPFGData = [
    { id: 'ppfg-1', depth: '3200m', description: 'High Overpressure Zone (Ramp Up)', probability: 4, impact: 5, type: 'Kick' },
    { id: 'ppfg-2', depth: '4500m', description: 'Narrow Drilling Window', probability: 5, impact: 4, type: 'Losses' },
    { id: 'ppfg-3', depth: '2800m', description: 'Shale Instability Risk', probability: 3, impact: 3, type: 'Stuck Pipe' },
  ];

  const toggleRisk = (id) => {
    setSelectedRisks(prev => ({
        ...prev,
        [id]: !prev[id]
    }));
  };

  const handleImport = async () => {
    const risksToImport = mockPPFGData.filter(r => selectedRisks[r.id]);
    if (risksToImport.length === 0) {
        toast({ title: "No risks selected" });
        return;
    }

    setLoading(true);
    const payload = risksToImport.map(r => ({
        project_id: project.id,
        title: `PPFG: ${r.type} at ${r.depth}`,
        description: r.description,
        category: 'Drilling',
        probability: r.probability,
        impact: r.impact,
        risk_score: r.probability * r.impact,
        linked_depth_interval: r.depth,
        linked_app: 'PPFG',
        ppfg_source: true,
        status: 'Open',
        owner: 'Drilling Engineer'
    }));

    const { error } = await supabase.from('risks').insert(payload);
    setLoading(false);

    if (error) {
        toast({ variant: "destructive", title: "Import Failed", description: error.message });
    } else {
        toast({ title: "Import Successful", description: `${payload.length} risks imported from PPFG module.` });
        onRisksImported();
        setSelectedRisks({});
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                PPFG Pre-Risk Integration
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-xs text-slate-500 mb-4">
                Detected potential risks from Pore Pressure / Fracture Gradient prognosis. Select items to promote to the Risk Register.
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="border-b-slate-800">
                        <TableHead className="w-[30px]"></TableHead>
                        <TableHead className="text-slate-400">Type</TableHead>
                        <TableHead className="text-slate-400">Depth</TableHead>
                        <TableHead className="text-slate-400">Description</TableHead>
                        <TableHead className="text-slate-400">Score</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockPPFGData.map(r => (
                        <TableRow key={r.id} className="border-b-slate-800">
                            <TableCell>
                                <Checkbox 
                                    checked={!!selectedRisks[r.id]}
                                    onCheckedChange={() => toggleRisk(r.id)}
                                    className="border-slate-600 data-[state=checked]:bg-blue-600"
                                />
                            </TableCell>
                            <TableCell className="text-white font-medium">{r.type}</TableCell>
                            <TableCell className="text-slate-300">{r.depth}</TableCell>
                            <TableCell className="text-slate-300">{r.description}</TableCell>
                            <TableCell className="text-red-400 font-bold">{r.probability * r.impact}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
                <Button onClick={handleImport} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    <Import className="w-4 h-4 mr-2" />
                    Import Selected Risks
                </Button>
            </div>
        </CardContent>
    </Card>
  );
};

export default PPFGIntegration;