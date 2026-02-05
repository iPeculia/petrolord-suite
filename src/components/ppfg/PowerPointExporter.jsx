import React from 'react';
import { Button } from '@/components/ui/button';
import { Presentation, Download } from 'lucide-react';
import { generateReport } from '@/utils/reportGenerator';
import { useToast } from '@/components/ui/use-toast';

const PowerPointExporter = ({ data }) => {
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleExport = async () => {
        setIsGenerating(true);
        try {
            const blob = await generateReport('pptx', data, { title: 'PPFG Presentation' });
            // Mock download logic since it's a JSON blob in our mock implementation
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'presentation_data.json'; 
            a.click();
            toast({ title: "Presentation Data Exported", description: "Slide deck data generated." });
        } catch (e) {
            toast({ title: "Error", description: "Failed to generate presentation.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6 p-4 bg-slate-900 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
                <Presentation className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold text-slate-200">PowerPoint Exporter</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
                Generate editable slide decks for stakeholder meetings. Includes summary slides, key charts, and risk matrices.
            </p>
            <Button 
                className="w-full bg-orange-600 hover:bg-orange-500 text-white"
                onClick={handleExport}
                disabled={isGenerating}
            >
                {isGenerating ? 'Building Slides...' : <><Download className="w-4 h-4 mr-2" /> Export to PowerPoint</>}
            </Button>
        </div>
    );
};

export default PowerPointExporter;