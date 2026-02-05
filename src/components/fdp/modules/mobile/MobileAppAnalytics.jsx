import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileAnalyticsService } from '@/services/mobile/MobileAnalyticsService';

const MobileAppAnalytics = () => {
    const stats = MobileAnalyticsService.getStats();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-sm">Session Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Avg Session Duration</span>
                                <span className="text-white font-mono">{stats.avgSessionDuration}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Daily Active Users</span>
                                <span className="text-white font-mono">{stats.dailyActiveUsers}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-sm">Stability</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Crash Free Rate</span>
                                <span className="text-green-400 font-mono">{stats.crashFreeSessions}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Current Version</span>
                                <span className="text-white font-mono">{stats.appVersion}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="flex items-center justify-center h-[300px] text-slate-500">
                    User Retention Chart Visualization Placeholder
                </CardContent>
            </Card>
        </div>
    );
};

export default MobileAppAnalytics;