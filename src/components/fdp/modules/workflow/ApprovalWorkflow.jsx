import React from 'react';
import { useFDP } from '@/contexts/FDPContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Clock } from 'lucide-react';

const ApprovalWorkflow = () => {
    const { state } = useFDP();
    const { approvals } = state.workflow;

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Approval Requests</h3>
            
            <div className="space-y-4">
                {approvals.map((approval) => (
                    <Card key={approval.id} className="bg-slate-900 border-slate-800">
                        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-full ${
                                    approval.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                                    approval.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                    {approval.status === 'Pending' ? <Clock className="w-6 h-6" /> : 
                                     approval.status === 'Approved' ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">{approval.title}</h4>
                                    <div className="flex gap-4 text-sm text-slate-400 mt-1">
                                        <span>Requestor: <span className="text-slate-300">{approval.requestor}</span></span>
                                        <span>Submitted: <span className="text-slate-300">{new Date(approval.submittedAt).toLocaleDateString()}</span></span>
                                    </div>
                                    <div className="mt-2 text-sm text-slate-500">
                                        Approvers: {approval.approvers.join(', ')}
                                    </div>
                                </div>
                            </div>

                            {approval.status === 'Pending' && (
                                <div className="flex gap-3">
                                    <Button variant="outline" className="border-red-900 text-red-400 hover:bg-red-900/20 hover:text-red-300">
                                        Reject
                                    </Button>
                                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                                        Approve
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ApprovalWorkflow;