import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail } from 'lucide-react';
import { sendEmailReport } from '@/utils/stakeholderCommunication';
import { useToast } from '@/components/ui/use-toast';

const StakeholderCommunicationPanel = () => {
    const { toast } = useToast();
    const [email, setEmail] = React.useState('');

    const handleSend = async () => {
        if (!email) return;
        await sendEmailReport([email], 'executive', []);
        toast({ title: "Email Sent", description: "Executive summary sent to stakeholder." });
        setEmail('');
    };

    return (
        <div className="p-4 space-y-4 bg-slate-900 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-200">Stakeholder Updates</h3>
            </div>
            
            <div className="space-y-2">
                <Label className="text-xs text-slate-400">Recipient Email</Label>
                <Input 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manager@company.com"
                    className="bg-slate-950 border-slate-700 h-8 text-xs"
                />
            </div>

            <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                onClick={handleSend}
            >
                Send Executive Summary
            </Button>
        </div>
    );
};

export default StakeholderCommunicationPanel;