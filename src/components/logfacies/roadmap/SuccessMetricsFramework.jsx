import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const metrics = [
    { phase: 1, kpi: "Data Ingestion Success Rate", target: "> 99%", current: "98.5%", status: "On Track" },
    { phase: 1, kpi: "QC Automated Flags", target: "100% of files", current: "100%", status: "Achieved" },
    { phase: 2, kpi: "Model Accuracy (F1)", target: "> 0.85", current: "0.82", status: "At Risk" },
    { phase: 2, kpi: "Training Time (1000 pts)", target: "< 5s", current: "2.1s", status: "Achieved" },
    { phase: 3, kpi: "Viz Render FPS", target: "60 FPS", current: "55 FPS", status: "On Track" },
    { phase: 3, kpi: "User UI Satisfaction", target: "> 4.5/5", current: "N/A", status: "Pending" },
    { phase: 4, kpi: "Report Gen Speed", target: "< 2s", current: "N/A", status: "Pending" },
    { phase: 5, kpi: "Explainability Coverage", target: "100% of predictions", current: "N/A", status: "Pending" },
    { phase: 6, kpi: "Concurrent Editors", target: "> 10", current: "N/A", status: "Pending" },
    { phase: 7, kpi: "API Uptime", target: "99.9%", current: "N/A", status: "Pending" },
];

const SuccessMetricsFramework = () => {
    return (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg h-full overflow-hidden flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">Key Performance Indicators</h3>
            <div className="overflow-auto flex-1">
                <Table>
                    <TableHeader className="bg-slate-950">
                        <TableRow className="hover:bg-slate-950 border-slate-800">
                            <TableHead className="w-[80px]">Phase</TableHead>
                            <TableHead>KPI Description</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Current</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {metrics.map((m, i) => (
                            <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50">
                                <TableCell className="font-mono text-slate-400">P{m.phase}</TableCell>
                                <TableCell className="font-medium text-slate-200">{m.kpi}</TableCell>
                                <TableCell className="text-slate-400">{m.target}</TableCell>
                                <TableCell className="text-slate-300">{m.current}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={
                                        m.status === 'Achieved' ? 'text-green-400 border-green-900 bg-green-900/20' :
                                        m.status === 'On Track' ? 'text-blue-400 border-blue-900 bg-blue-900/20' :
                                        m.status === 'At Risk' ? 'text-orange-400 border-orange-900 bg-orange-900/20' :
                                        'text-slate-500 border-slate-700'
                                    }>
                                        {m.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default SuccessMetricsFramework;