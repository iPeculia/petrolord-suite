import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, Clock, FileSearch } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProductionAllocationEngine = ({ allocationData }) => {
  const { toast } = useToast();

  if (!allocationData) {
    return <div className="text-center text-lime-300 p-8">Run an analysis to view production allocation.</div>;
  }
  
  const handleToast = (feature) => {
    toast({
        title: "🚧 Feature Coming Soon!",
        description: `${feature} isn't implemented yet.`,
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-lime-300">Production Allocation Engine</CardTitle>
                    <CardDescription>Distributing facility production back to individual wells based on the latest valid tests.</CardDescription>
                </div>
                <Button variant="outline" onClick={() => handleToast('View Audit Trail')}><FileSearch className="mr-2 h-4 w-4" />View Audit Trail</Button>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-800">
                        <TableHead className="text-lime-200">Well Name</TableHead>
                        <TableHead className="text-lime-200 text-right">Oil Rate (stb/d)</TableHead>
                        <TableHead className="text-lime-200 text-right">Gas Rate (Mscf/d)</TableHead>
                        <TableHead className="text-lime-200 text-right">Water Rate (stb/d)</TableHead>
                        <TableHead className="text-lime-200 text-right">Last Test Date</TableHead>
                        <TableHead className="text-lime-200 text-center">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allocationData.wells.map((well) => (
                        <TableRow key={well.wellName} className="border-slate-700 hover:bg-slate-800/50">
                            <TableCell className="font-medium text-white">{well.wellName}</TableCell>
                            <TableCell className="text-right text-white">{well.oilRate}</TableCell>
                            <TableCell className="text-right text-white">{well.gasRate}</TableCell>
                            <TableCell className="text-right text-white">{well.waterRate}</TableCell>
                            <TableCell className="text-right text-white">{well.lastTest}</TableCell>
                            <TableCell className="text-center text-green-400">
                                <span className="flex items-center justify-center"><Check className="h-4 w-4 mr-1"/> Valid</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow className="border-slate-700 font-bold text-white bg-slate-800">
                        <TableCell className="text-white">Total Allocated</TableCell>
                        <TableCell className="text-right text-white">{allocationData.totals.oil}</TableCell>
                        <TableCell className="text-right text-white">{allocationData.totals.gas}</TableCell>
                        <TableCell className="text-right text-white">{allocationData.totals.water}</TableCell>
                        <TableCell colSpan={2}></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </CardContent>
    </Card>
  );
};

export default ProductionAllocationEngine;