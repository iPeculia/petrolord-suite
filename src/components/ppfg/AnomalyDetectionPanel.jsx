import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

const AnomalyDetectionPanel = ({ anomalies }) => {
  const getIcon = (severity) => {
      switch(severity) {
          case 'Critical': return <AlertCircle className="w-4 h-4 text-red-500" />;
          case 'Major': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
          default: return <Info className="w-4 h-4 text-blue-500" />;
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-t border-slate-800">
        <div className="p-2 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Detected Anomalies</h3>
            <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">{anomalies?.length || 0} Items</Badge>
        </div>
        <ScrollArea className="flex-1 p-0">
            <table className="w-full text-xs text-left">
                <thead className="text-slate-500 bg-slate-900 sticky top-0">
                    <tr>
                        <th className="p-2 font-medium w-10"></th>
                        <th className="p-2 font-medium">Well</th>
                        <th className="p-2 font-medium">Depth</th>
                        <th className="p-2 font-medium">Type</th>
                        <th className="p-2 font-medium">Details</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {anomalies && anomalies.map((anomaly, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50 transition-colors group">
                            <td className="p-2 text-center">{getIcon(anomaly.severity)}</td>
                            <td className="p-2 font-mono text-emerald-400 font-medium">{anomaly.wellName}</td>
                            <td className="p-2 text-slate-400">{Math.round(anomaly.depth)} ft</td>
                            <td className="p-2 text-slate-300">{anomaly.type}</td>
                            <td className="p-2 text-slate-500 italic group-hover:text-slate-300 transition-colors">{anomaly.details}</td>
                        </tr>
                    ))}
                    {(!anomalies || anomalies.length === 0) && (
                        <tr>
                            <td colSpan={5} className="p-4 text-center text-slate-600 italic">No anomalies detected in current selection.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </ScrollArea>
    </div>
  );
};

export default AnomalyDetectionPanel;