import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Apple, Smartphone, Globe } from 'lucide-react';

const MobileAppDeployment = () => {
    return (
        <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Deployment Pipeline</h3>
                        <Button className="bg-green-600 hover:bg-green-700">
                            <Play className="w-4 h-4 mr-2" /> Trigger New Build
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <Apple className="w-5 h-5 text-slate-300" />
                                    <span className="font-medium text-white">iOS Production</span>
                                </div>
                                <Badge className="bg-green-900 text-green-300">Deployed</Badge>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Version: 2.1.0</span>
                                <span>Last deployed: 2 days ago</span>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-5 h-5 text-green-400" />
                                    <span className="font-medium text-white">Android Production</span>
                                </div>
                                <Badge className="bg-green-900 text-green-300">Deployed</Badge>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Version: 2.1.0</span>
                                <span>Last deployed: 2 days ago</span>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-blue-400" />
                                    <span className="font-medium text-white">Web PWA</span>
                                </div>
                                <Badge className="bg-yellow-900 text-yellow-300">Building...</Badge>
                            </div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2">
                                <div className="bg-yellow-500 h-1.5 rounded-full w-[45%]"></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MobileAppDeployment;