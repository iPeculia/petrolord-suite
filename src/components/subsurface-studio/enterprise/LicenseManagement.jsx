import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CreditCard } from 'lucide-react';

const LicenseManagement = () => {
    return (
        <div className="space-y-4 h-full p-1">
            <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center text-slate-200"><CreditCard className="w-4 h-4 mr-2 text-purple-400"/> Seat Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium text-slate-200">
                            <span>Enterprise Seats</span>
                            <span>85 / 100</span>
                        </div>
                        <Progress value={85} className="h-2" />
                        <p className="text-xs text-slate-500">Renewal Date: Dec 31, 2025</p>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium text-slate-200">
                            <span>Geoscience Module Add-on</span>
                            <span>12 / 20</span>
                        </div>
                        <Progress value={60} className="h-2" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LicenseManagement;