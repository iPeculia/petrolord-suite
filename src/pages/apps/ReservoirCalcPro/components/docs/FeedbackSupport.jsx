import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const FeedbackSupport = () => (
    <div className="space-y-6">
        <h1>Feedback & Support</h1>
        
        <section className="bg-slate-900 p-6 rounded border border-slate-800">
            <h2 className="mb-4">Contact Support</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-slate-400">Name</label>
                        <Input className="bg-slate-950" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-400">Email</label>
                        <Input className="bg-slate-950" />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-slate-400">Message / Bug Report</label>
                    <Textarea className="bg-slate-950 min-h-[100px]" placeholder="Describe your issue or suggestion..." />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Submit Ticket</Button>
            </div>
        </section>

        <section>
            <h2>Community</h2>
            <p className="text-slate-400">Join the <a href="#" className="text-blue-400 hover:underline">Petrolord User Forum</a> to discuss workflows and tips.</p>
        </section>
    </div>
);

export default FeedbackSupport;