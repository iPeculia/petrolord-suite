import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download } from 'lucide-react';
import { generateReport } from '@/utils/reportGenerator';
import { useToast } from '@/components/ui/use-toast';

const ReportGenerator = ({ data }) => {
    const { toast } = useToast();
    const [sections, setSections] = React.useState(['summary', 'results']);
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleToggle = (section) => {
        setSections(prev => prev.includes(section) 
            ? prev.filter(s => s !== section)
            : [...prev, section]
        );
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const blob = await generateReport('pdf', data, { title: 'PPFG Analysis Report', sections });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ppfg_report.pdf';
            a.click();
            toast({ title: "Report Generated", description: "PDF downloaded successfully." });
        } catch (e) {
            toast({ title: "Error", description: "Failed to generate report.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6 p-4 bg-slate-900 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-200">PDF Report Builder</h3>
            </div>

            <div className="space-y-3">
                <div className="text-xs text-slate-400 uppercase font-bold">Sections to Include</div>
                <div className="grid grid-cols-2 gap-2">
                    {['summary', 'methodology', 'results', 'conclusions', 'appendices'].map(sec => (
                        <div key={sec} className="flex items-center space-x-2">
                            <Checkbox 
                                id={sec} 
                                checked={sections.includes(sec)}
                                onCheckedChange={() => handleToggle(sec)}
                                className="border-slate-600"
                            />
                            <Label htmlFor={sec} className="text-sm capitalize text-slate-300">{sec}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs text-slate-400">Template Style</Label>
                <Select defaultValue="standard">
                    <SelectTrigger className="bg-slate-950 border-slate-700 h-8 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="standard">Standard Corporate</SelectItem>
                        <SelectItem value="detailed">Detailed Technical</SelectItem>
                        <SelectItem value="compact">Compact Executive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                onClick={handleGenerate}
                disabled={isGenerating}
            >
                {isGenerating ? 'Generating...' : <><Download className="w-4 h-4 mr-2" /> Generate PDF</>}
            </Button>
        </div>
    );
};

export default ReportGenerator;