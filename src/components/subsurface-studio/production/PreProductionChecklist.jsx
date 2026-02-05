import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ClipboardCheck } from 'lucide-react';

const PreProductionChecklist = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <ClipboardCheck className="w-5 h-5 mr-2 text-green-400" /> Go-Live Checklist
        </h3>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-0 divide-y divide-slate-800">
                {[
                    "Verify database backup schedule is active",
                    "Confirm SSL certificates are valid > 30 days",
                    "Check API rate limits are configured",
                    "Validate production secrets in Vault",
                    "Ensure error tracking (Sentry) is receiving events",
                    "Load test critical paths (Login, Upload, Viz)",
                    "Review audit log retention policy",
                    "Sign-off from Security Team"
                ].map((item, i) => (
                    <div key={i} className="p-4 flex items-center gap-3 hover:bg-slate-900/50">
                        <Checkbox id={`check-${i}`} />
                        <label htmlFor={`check-${i}`} className="text-sm text-slate-300 cursor-pointer select-none">
                            {item}
                        </label>
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
);

export default PreProductionChecklist;