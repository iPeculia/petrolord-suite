import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const AuditReportGenerator = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-400" /> Compliance Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
            <div className="space-y-2">
                <Label className="text-xs text-slate-400">Report Type</Label>
                <Select defaultValue="full">
                    <SelectTrigger className="h-8 bg-slate-950 border-slate-700 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="full">Full Audit Trail (All Events)</SelectItem>
                        <SelectItem value="changes">Model Change Log Only</SelectItem>
                        <SelectItem value="access">User Access & Permissions</SelectItem>
                        <SelectItem value="release">Version Release Notes</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="text-xs border-slate-700 justify-start">
                    <Calendar className="w-3 h-3 mr-2" /> Start Date
                </Button>
                <Button variant="outline" className="text-xs border-slate-700 justify-start">
                    <Calendar className="w-3 h-3 mr-2" /> End Date
                </Button>
            </div>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-2">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 h-8 text-xs">
                <Download className="w-3 h-3 mr-2" /> Download PDF Report
            </Button>
            <Button variant="outline" className="w-full border-slate-700 h-8 text-xs text-slate-300">
                Download CSV Data
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditReportGenerator;