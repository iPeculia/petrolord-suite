import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { FileDown, Settings, Bell, Mail, MessageSquare } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const ReportsAndAlerts = () => {
  const { toast } = useToast();

  const handleExport = (format) => {
    toast({
      title: 'Export Initiated',
      description: `Generating Daily Production Report as ${format}...`,
    });
  };
  
  const handleSaveAlerts = () => {
    toast({
      title: "Settings Saved",
      description: "Your alert preferences have been updated.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
                <CardTitle className="text-lime-300">Reports</CardTitle>
                <CardDescription>Generate standardized daily production reports or create custom templates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-white">Daily Production Report</p>
                        <p className="text-sm text-slate-400">Summary of the previous day's performance.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={() => handleExport('PDF')} size="sm" variant="outline"><FileDown className="w-4 h-4 mr-1"/>PDF</Button>
                        <Button onClick={() => handleExport('CSV')} size="sm" variant="outline"><FileDown className="w-4 h-4 mr-1"/>CSV</Button>
                    </div>
                </div>
                 <Button onClick={() => toast({title: "Coming Soon!"})} variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2"/>
                    Customize Report Template
                </Button>
            </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
                <CardTitle className="text-lime-300">Customizable Alerts</CardTitle>
                <CardDescription>Get notified of critical events via email or text message.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <Label htmlFor="email">Email for Notifications</Label>
                    <Input id="email" type="email" placeholder="engineer@company.com" />
                 </div>
                 <div className="space-y-2">
                     <p className="text-sm font-medium text-white">Alert Triggers:</p>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="well-shutin" defaultChecked/>
                        <label htmlFor="well-shutin" className="text-sm text-slate-300">Unexpected Well Shut-in</label>
                     </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="deviation" defaultChecked/>
                        <label htmlFor="deviation" className="text-sm text-slate-300">Significant Deviation from Target</label>
                     </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="data-gap"/>
                        <label htmlFor="data-gap" className="text-sm text-slate-300">Data Gap Detected</label>
                     </div>
                 </div>
                 <Button onClick={handleSaveAlerts} className="w-full bg-gradient-to-r from-yellow-600 to-orange-600">Save Alert Settings</Button>
            </CardContent>
        </Card>
    </div>
  );
};

export default ReportsAndAlerts;