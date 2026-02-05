import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Download, Save } from 'lucide-react';

const EditorPanel = ({ document, setDocument }) => {
  const { toast } = useToast();

  const handleExport = (format) => {
    toast({
      title: 'Export Initiated',
      description: `Generating ${format} document... This is a demo.`,
    });
  };

  const handleSave = () => {
    toast({
      title: 'Draft Saved!',
      description: 'Your changes to the report have been saved.',
    });
  };

  return (
    <div className="h-full flex flex-col bg-white/5 rounded-xl border border-white/10">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Report Editor</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} className="border-lime-400 text-lime-400 hover:bg-lime-400/10 hover:text-lime-300">
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('Word')} className="border-blue-400 text-blue-400 hover:bg-blue-400/10 hover:text-blue-300">
            <Download className="w-4 h-4 mr-2" /> Export (.docx)
          </Button>
        </div>
      </div>
      <div className="flex-grow p-4">
        <Textarea
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          className="w-full h-full bg-slate-900/80 border-white/20 text-white/90 rounded-lg p-4 resize-none focus-visible:ring-lime-400"
          placeholder="Generated report will appear here..."
        />
      </div>
    </div>
  );
};

export default EditorPanel;