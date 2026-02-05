import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LayoutGrid, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import UnsavedChangesDialog from './UnsavedChangesDialog';

const BackToGeoscienceDashboard = ({ className, collapsed = false, hasUnsavedChanges = false }) => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const performNavigation = useCallback(() => {
    navigate('/dashboard/geoscience');
  }, [navigate]);

  const handleNavigationAttempt = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowDialog(true);
    } else {
      performNavigation();
    }
  }, [hasUnsavedChanges, performNavigation]);

  // Keyboard shortcut: Alt + B
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleNavigationAttempt();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigationAttempt]);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={collapsed ? "icon" : "sm"}
              className={cn(
                "text-slate-400 hover:text-white hover:bg-slate-800 transition-colors",
                className
              )}
              onClick={handleNavigationAttempt}
            >
              {collapsed ? (
                <LayoutGrid className="w-5 h-5" />
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span>Back to Dashboard</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Back to Geoscience Hub (Alt+B)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <UnsavedChangesDialog 
        isOpen={showDialog}
        onSave={() => {
          // Trigger save logic here if connected to context
          console.log("Saving...");
          setShowDialog(false);
          performNavigation();
        }}
        onDiscard={() => {
          setShowDialog(false);
          performNavigation();
        }}
        onCancel={() => setShowDialog(false)}
      />
    </>
  );
};

export default BackToGeoscienceDashboard;