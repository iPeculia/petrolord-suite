import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';

const ResourceAllocationVelocity = () => {
  return (
    <div className="p-4 h-full bg-slate-950 overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-4">Resource & Budget Matrix</h2>
      
      <Card className="bg-slate-900 border-slate-800 mb-6">
        <Table>
            <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400">Role</TableHead>
                    <TableHead className="text-slate-400">FTE</TableHead>
                    <TableHead className="text-slate-400">Phase Focus</TableHead>
                    <TableHead className="text-slate-400">Budget Est.</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-white">Lead Geophysicist</TableCell>
                    <TableCell>1.0</TableCell>
                    <TableCell>All (Physics & QC)</TableCell>
                    <TableCell>$180k/yr</TableCell>
                </TableRow>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-white">Senior Frontend Dev</TableCell>
                    <TableCell>1.0</TableCell>
                    <TableCell>UI/UX, Visualization</TableCell>
                    <TableCell>$160k/yr</TableCell>
                </TableRow>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-white">Backend Engineer</TableCell>
                    <TableCell>0.5</TableCell>
                    <TableCell>API, Database, Perf</TableCell>
                    <TableCell>$80k/yr</TableCell>
                </TableRow>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-white">Data Scientist</TableCell>
                    <TableCell>0.25</TableCell>
                    <TableCell>Algorithms, ML</TableCell>
                    <TableCell>$40k/yr</TableCell>
                </TableRow>
            </TableBody>
        </Table>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
            <h3 className="text-sm font-bold text-blue-400 mb-2">Development Cost</h3>
            <p className="text-2xl font-bold text-white">$460k</p>
            <p className="text-xs text-slate-500">Annual estimated run-rate</p>
        </div>
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
            <h3 className="text-sm font-bold text-purple-400 mb-2">Cloud Infra</h3>
            <p className="text-2xl font-bold text-white">$12k</p>
            <p className="text-xs text-slate-500">Projected Supabase/Compute</p>
        </div>
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
            <h3 className="text-sm font-bold text-emerald-400 mb-2">ROI Projection</h3>
            <p className="text-2xl font-bold text-white">350%</p>
            <p className="text-xs text-slate-500">Based on time saved vs Petrel</p>
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocationVelocity;