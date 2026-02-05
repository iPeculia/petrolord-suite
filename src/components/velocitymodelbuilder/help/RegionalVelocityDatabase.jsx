import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Globe, TrendingUp } from 'lucide-react';

const RegionalVelocityDatabase = () => {
  const regions = [
    { region: "North Sea (Central)", formation: "Chalk", v0: "2800 - 3200 m/s", k: "0.3 - 0.5 s⁻¹", type: "Carbonate" },
    { region: "Gulf of Mexico (Shelf)", formation: "Miocene Sands", v0: "1600 - 1800 m/s", k: "0.6 - 0.8 s⁻¹", type: "Clastic" },
    { region: "West Africa (Deep)", formation: "Turbidites", v0: "1550 - 1700 m/s", k: "0.5 - 0.7 s⁻¹", type: "Clastic" },
    { region: "Middle East (Onshore)", formation: "Khuff Carbonates", v0: "4500 - 6000 m/s", k: "0.1 - 0.2 s⁻¹", type: "Carbonate" },
    { region: "Australia (NWS)", formation: "Mungaroo", v0: "2200 - 2500 m/s", k: "0.4 - 0.5 s⁻¹", type: "Clastic" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-2">
            <Globe className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Regional Velocity Trends</h2>
        </div>
        <p className="text-slate-400 text-sm">
            Baseline parameters derived from global databases. Use these as starting points (priors) when local well control is sparse.
        </p>

        <div className="rounded-md border border-slate-800 bg-slate-900">
            <Table>
                <TableHeader className="bg-slate-950">
                    <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-300">Region</TableHead>
                        <TableHead className="text-slate-300">Target Formation</TableHead>
                        <TableHead className="text-slate-300">Typical V0 (m/s)</TableHead>
                        <TableHead className="text-slate-300">Typical k (Gradient)</TableHead>
                        <TableHead className="text-slate-300">Lithology</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {regions.map((row, i) => (
                        <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50">
                            <TableCell className="font-medium text-slate-200">{row.region}</TableCell>
                            <TableCell className="text-slate-400">{row.formation}</TableCell>
                            <TableCell className="text-emerald-400 font-mono text-xs">{row.v0}</TableCell>
                            <TableCell className="text-blue-400 font-mono text-xs">{row.k}</TableCell>
                            <TableCell className="text-slate-500 text-xs uppercase">{row.type}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Button variant="outline" className="border-slate-700 text-slate-300 h-12">
                <Download className="w-4 h-4 mr-2" /> Download Full Global Database (CSV)
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 h-12">
                <TrendingUp className="w-4 h-4 mr-2" /> View Depth-Velocity Crossplots
            </Button>
        </div>
    </div>
  );
};

export default RegionalVelocityDatabase;