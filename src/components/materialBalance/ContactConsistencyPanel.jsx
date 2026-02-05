import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ContactConsistencyPanel = () => {
  const { contactConsistency, contactObservations } = useMaterialBalance();
  const { score, issues } = contactConsistency || { score: 100, issues: [] };

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (!contactObservations.dates) return [];
    return contactObservations.dates.map((date, i) => ({
      date,
      GOC: contactObservations.measuredGOC[i],
      OWC: contactObservations.measuredOWC[i],
    }));
  }, [contactObservations]);

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50">
        <CardTitle className="text-xs font-bold text-slate-300 uppercase">Contact Consistency</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-3 overflow-y-auto flex flex-col gap-4">
        
        {/* Score Indicator */}
        <div className="flex items-center gap-3 p-3 bg-slate-950 rounded border border-slate-800">
          <div className="relative w-12 h-12 flex items-center justify-center">
             <svg className="w-full h-full -rotate-90">
               <circle cx="24" cy="24" r="20" className="stroke-slate-800" strokeWidth="4" fill="transparent" />
               <circle 
                 cx="24" cy="24" r="20" 
                 className={score > 80 ? "stroke-green-500" : score > 50 ? "stroke-yellow-500" : "stroke-red-500"} 
                 strokeWidth="4" fill="transparent"
                 strokeDasharray={`${score * 1.25} 125`} 
               />
             </svg>
             <span className="absolute text-xs font-bold text-white">{score}</span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-300">Consistency Score</div>
            <div className="text-[10px] text-slate-500">{score > 80 ? "Good Match" : score > 50 ? "Review Needed" : "Inconsistent"}</div>
          </div>
        </div>

        {/* Mini Plot */}
        <div className="h-32 w-full border border-slate-800 rounded bg-slate-950/50 p-1">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={chartData}>
               <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
               <XAxis dataKey="date" hide />
               <YAxis reversed hide domain={['auto', 'auto']} />
               <Tooltip contentStyle={{backgroundColor: '#0f172a', fontSize: '10px'}} />
               <Line type="monotone" dataKey="GOC" stroke="#ef4444" dot={{r:2}} strokeWidth={1} />
               <Line type="monotone" dataKey="OWC" stroke="#3b82f6" dot={{r:2}} strokeWidth={1} />
             </LineChart>
           </ResponsiveContainer>
        </div>

        {/* Issues List */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
          <div className="text-[10px] text-slate-500 font-semibold">DETECTED ISSUES</div>
          {issues.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-green-400 p-2">
              <CheckCircle className="w-4 h-4" /> No inconsistencies found.
            </div>
          ) : (
            issues.map((issue, idx) => (
              <div key={idx} className={`p-2 rounded border text-[10px] flex gap-2 ${issue.severity === 'error' ? 'bg-red-900/20 border-red-900/50 text-red-300' : 'bg-yellow-900/20 border-yellow-900/50 text-yellow-300'}`}>
                <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold mb-0.5">{issue.date}</div>
                  {issue.message}
                </div>
              </div>
            ))
          )}
        </div>

      </CardContent>
    </Card>
  );
};

export default ContactConsistencyPanel;