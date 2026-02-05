import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const MobileAppConfiguration = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-sm">General Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">App Name</Label>
                            <Input className="bg-slate-800 border-slate-700" defaultValue="FDP Companion" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Bundle ID</Label>
                            <Input className="bg-slate-800 border-slate-700" defaultValue="com.petrolord.fdp" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Version</Label>
                            <Input className="bg-slate-800 border-slate-700" defaultValue="2.1.0" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-sm">Feature Toggles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-white">Offline Mode</Label>
                                <p className="text-xs text-slate-400">Allow users to access data without internet</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-white">Biometric Auth</Label>
                                <p className="text-xs text-slate-400">FaceID / TouchID login</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-white">Push Notifications</Label>
                                <p className="text-xs text-slate-400">Alerts for approvals and tasks</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-white">Location Services</Label>
                                <p className="text-xs text-slate-400">Track field personnel location</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" /> Save Configuration
                </Button>
            </div>
        </div>
    );
};

export default MobileAppConfiguration;