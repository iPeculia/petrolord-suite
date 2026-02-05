import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReportsPanel = () => {
    return (
         <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-3">
            {['Executive Summary', 'Technical Report', 'Drilling Risks'].map((report) => (
                <Card key={report} className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <FileText className="w-12 h-12 text-slate-600 mb-4" />
                        <h3 className="font-bold text-white mb-2">{report}</h3>
                        <Button variant="outline" className="w-full mt-4">
                            <Download className="w-4 h-4 mr-2" /> Download PDF
                        </Button>
                    </CardContent>
                </Card>
            ))}
         </div>
    );
};

export default ReportsPanel;