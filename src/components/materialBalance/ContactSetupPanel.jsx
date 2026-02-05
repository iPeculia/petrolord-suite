import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';

const ContactSetupPanel = () => {
  const { contactObservations } = useMaterialBalance();

  return (
    <Card className="bg-slate-900 border-slate-800 h-64 mt-4 flex flex-col">
      <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50">
        <CardTitle className="text-xs font-bold text-slate-300 uppercase">Measured Contacts</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        {contactObservations.dates.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            No contact observations recorded.
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <Table>
              <TableHeader className="bg-slate-950 sticky top-0">
                <TableRow className="hover:bg-slate-950 border-b border-slate-800">
                  <TableHead className="text-[10px] h-7 text-slate-400">Date</TableHead>
                  <TableHead className="text-[10px] h-7 text-slate-400 text-right">GOC (ft)</TableHead>
                  <TableHead className="text-[10px] h-7 text-slate-400 text-right">OWC (ft)</TableHead>
                  <TableHead className="text-[10px] h-7 text-slate-400">Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactObservations.dates.map((date, i) => (
                  <TableRow key={i} className="hover:bg-slate-800/50 border-b border-slate-800/50">
                    <TableCell className="text-[10px] py-1 font-mono">{date}</TableCell>
                    <TableCell className="text-[10px] py-1 text-right font-mono">{contactObservations.measuredGOC[i] || '-'}</TableCell>
                    <TableCell className="text-[10px] py-1 text-right font-mono">{contactObservations.measuredOWC[i] || '-'}</TableCell>
                    <TableCell className="text-[10px] py-1">{contactObservations.method[i]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactSetupPanel;