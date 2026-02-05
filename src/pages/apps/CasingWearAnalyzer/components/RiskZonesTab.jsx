import React, { useMemo } from 'react';
import { useCasingWearAnalyzer } from '../contexts/CasingWearAnalyzerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertTriangle, TrendingUp, Cpu, Hash } from 'lucide-react';
import { identifyHighRiskZones } from '../utils/riskZoneAnalysis';
import { generateMitigationSuggestions } from '../utils/mitigationSuggestions';

const getRiskColor = (score) => {
  if (score > 75) return 'text-red-400 bg-red-900/20 border-red-500/30';
  if (score > 50) return 'text-orange-400 bg-orange-900/20 border-orange-500/30';
  if (score > 25) return 'text-amber-400 bg-amber-900/20 border-amber-500/30';
  return 'text-emerald-400 bg-emerald-900/20 border-emerald-500/30';
};

const RiskZonesTab = () => {
  const { wearProfile, selectedCasingString, operationParams, derivedLoads, wearProfile: baseWearProfile, scenarios } = useCasingWearAnalyzer();

  const highRiskZones = useMemo(() => {
    if (!wearProfile || !selectedCasingString || !operationParams || !derivedLoads) return [];
    return identifyHighRiskZones(wearProfile, selectedCasingString, operationParams, derivedLoads, { riskScore: 25 });
  }, [wearProfile, selectedCasingString, operationParams, derivedLoads]);

  const riskSummary = useMemo(() => {
    if (highRiskZones.length === 0) return { count: 0, totalLength: 0, highestRisk: 0, commonCause: 'N/A' };
    const causeCounts = highRiskZones.reduce((acc, zone) => {
      acc[zone.probableCause] = (acc[zone.probableCause] || 0) + 1;
      return acc;
    }, {});
    const commonCause = Object.entries(causeCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    return {
      count: highRiskZones.length,
      totalLength: highRiskZones.reduce((acc, z) => acc + (z.md_end - z.md_start), 0),
      highestRisk: Math.max(...highRiskZones.map(z => z.maxRiskScore)),
      commonCause,
    };
  }, [highRiskZones]);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-xs text-slate-400">High-Risk Zones</CardTitle><Hash className="w-4 h-4 text-slate-500" /></CardHeader>
          <CardContent><p className="text-2xl font-bold text-white">{riskSummary.count}</p></CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-xs text-slate-400">Total Length at Risk</CardTitle><AlertTriangle className="w-4 h-4 text-slate-500" /></CardHeader>
          <CardContent><p className="text-2xl font-bold text-white">{riskSummary.totalLength.toFixed(0)} m</p></CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-xs text-slate-400">Highest Risk Score</CardTitle><TrendingUp className="w-4 h-4 text-slate-500" /></CardHeader>
          <CardContent><p className="text-2xl font-bold text-white">{riskSummary.highestRisk.toFixed(0)}</p></CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-xs text-slate-400">Most Common Cause</CardTitle><Cpu className="w-4 h-4 text-slate-500" /></CardHeader>
          <CardContent><p className="text-sm text-white truncate pt-1">{riskSummary.commonCause}</p></CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader><CardTitle className="text-sm">Detailed Risk Zone Analysis</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">MD Interval (m)</TableHead>
                <TableHead className="text-slate-400">Max Wear (mm)</TableHead>
                <TableHead className="text-slate-400">Min Rem. WT (mm)</TableHead>
                <TableHead className="text-slate-400">Min SF</TableHead>
                <TableHead className="text-slate-400">Risk Score</TableHead>
                <TableHead className="text-slate-400">Probable Cause</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <Accordion type="single" collapsible className="w-full">
            {highRiskZones.length > 0 ? highRiskZones.map((zone, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-0">
                <AccordionTrigger className="hover:no-underline p-0">
                  <Table className="w-full">
                    <TableBody>
                      <TableRow className="border-slate-800 hover:bg-slate-800/40">
                        <TableCell className="text-xs font-mono text-slate-300">{`${zone.md_start.toFixed(0)} - ${zone.md_end.toFixed(0)}`}</TableCell>
                        <TableCell className="text-xs font-mono">{zone.maxWear.toFixed(2)}</TableCell>
                        <TableCell className="text-xs font-mono">{zone.minWT.toFixed(2)}</TableCell>
                        <TableCell className={`text-xs font-mono font-bold ${zone.minSF < 1.25 ? 'text-red-400' : 'text-emerald-400'}`}>{zone.minSF.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${getRiskColor(zone.maxRiskScore)}`}>{zone.maxRiskScore.toFixed(0)}</span>
                        </TableCell>
                        <TableCell className="text-xs text-slate-400">{zone.probableCause}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </AccordionTrigger>
                <AccordionContent className="bg-slate-950 p-4 border border-slate-800 rounded-b-md">
                  <h4 className="text-sm font-semibold mb-3 text-amber-400">Mitigation Suggestions</h4>
                   <div className="space-y-3">
                    {generateMitigationSuggestions(zone, selectedCasingString, operationParams, derivedLoads.bhaSummary, baseWearProfile.originalWallThickness_mm).map((s, i) => (
                      <div key={i} className="text-xs p-3 bg-slate-900 border border-slate-800 rounded">
                        <p className="font-bold text-slate-300">{s.title}</p>
                        <p className="text-slate-400 mt-1">{s.suggestion}</p>
                        {s.details && <p className="text-slate-500 italic mt-1">{s.details}</p>}
                      </div>
                    ))}
                   </div>
                </AccordionContent>
              </AccordionItem>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500 py-10">No high-risk zones identified.</TableCell>
              </TableRow>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskZonesTab;