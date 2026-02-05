import React from 'react';
import { Download, FileOutput, Table } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const ExportManager = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><FileOutput className="w-4 h-4 text-green-400"/> Data Export</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Format</Label>
                    <Select defaultValue="las">
                        <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="las">LAS 2.0</SelectItem>
                            <SelectItem value="csv">CSV / Excel</SelectItem>
                            <SelectItem value="dlis">DLIS (Binary)</SelectItem>
                            <SelectItem value="json">JSON (API)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Curves to Export</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2"><Checkbox id="e1" defaultChecked/><label htmlFor="e1" className="text-xs text-slate-300">Raw Curves</label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="e2" defaultChecked/><label htmlFor="e2" className="text-xs text-slate-300">Facies Flag</label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="e3" defaultChecked/><label htmlFor="e3" className="text-xs text-slate-300">Probabilities</label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="e4"/><label htmlFor="e4" className="text-xs text-slate-300">QC Flags</label></div>
                    </div>
                </div>
                <Button className="w-full mt-2 bg-slate-800 hover:bg-slate-700 border border-slate-700">
                    <Download className="w-4 h-4 mr-2" /> Download File
                </Button>
            </CardContent>
        </Card>
    );
};

export default ExportManager;