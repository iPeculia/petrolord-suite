import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Check, Loader2, AlertCircle } from 'lucide-react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const MBSaveButton = () => {
  const { saveProject, isSaving, hasChanges, lastSavedTime, currentProject } = useMaterialBalance();

  const handleSave = () => {
    if (currentProject) {
      saveProject();
    }
  };

  const formatTime = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!currentProject) return null;

  return (
    <div className="flex items-center gap-2">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        variant={hasChanges ? "default" : "ghost"} 
                        size="sm" 
                        className={`h-9 text-xs gap-2 transition-all ${
                            hasChanges 
                                ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700'
                        }`}
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : hasChanges ? (
                            <Save className="w-4 h-4" />
                        ) : (
                            <Check className="w-4 h-4 text-green-500" />
                        )}
                        {isSaving ? 'Saving...' : hasChanges ? 'Save' : 'Saved'}
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-800 text-xs">
                    {hasChanges ? 'Unsaved changes' : `Last saved: ${formatTime(lastSavedTime)}`}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        
        {!hasChanges && lastSavedTime && (
            <span className="text-[10px] text-slate-600 hidden lg:inline-block">
                Last saved {formatTime(lastSavedTime)}
            </span>
        )}
    </div>
  );
};

export default MBSaveButton;