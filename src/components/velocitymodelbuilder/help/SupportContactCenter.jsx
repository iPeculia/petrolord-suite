import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Phone, Mail, LifeBuoy } from 'lucide-react';

const SupportContactCenter = () => {
  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Submit a Support Ticket</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-400">Name</Label>
                            <Input className="bg-slate-950 border-slate-700" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-400">Email</Label>
                            <Input className="bg-slate-950 border-slate-700" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-400">Subject</Label>
                        <Input className="bg-slate-950 border-slate-700" placeholder="e.g., Error importing LAS file" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-400">Description</Label>
                        <Textarea className="bg-slate-950 border-slate-700 min-h-[150px]" placeholder="Describe the issue in detail..." />
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-500">Submit Ticket</Button>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-blue-900/20 rounded-full text-blue-400"><MessageSquare className="w-6 h-6" /></div>
                    <div>
                        <h4 className="font-bold text-white">Live Chat</h4>
                        <p className="text-xs text-slate-500">Available 9am - 5pm GMT</p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full border-slate-700">Start Chat</Button>
                </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-emerald-900/20 rounded-full text-emerald-400"><Mail className="w-6 h-6" /></div>
                    <div>
                        <h4 className="font-bold text-white">Email Us</h4>
                        <p className="text-xs text-slate-500">support@petrolord.com</p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full border-slate-700">Copy Email</Button>
                </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-purple-900/20 rounded-full text-purple-400"><LifeBuoy className="w-6 h-6" /></div>
                    <div>
                        <h4 className="font-bold text-white">Community</h4>
                        <p className="text-xs text-slate-500">Join our user forum</p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full border-slate-700">Visit Forum</Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default SupportContactCenter;