import React, { useEffect } from 'react';
import { useCasingTubingDesign } from '../../contexts/CasingTubingDesignContext';
import { useToast } from '@/components/ui/use-toast';

const KeyboardShortcuts = () => {
    const { toggleHelp, addLog } = useCasingTubingDesign();
    const { toast } = useToast();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Check if user is typing in an input
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

            // Ctrl/Cmd + H: Toggle Help
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
                e.preventDefault();
                toggleHelp();
            }

            // Ctrl/Cmd + S: Save (Mock)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                toast({ title: "Quick Save", description: "Design saved successfully." });
                addLog("Project saved via keyboard shortcut.");
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleHelp, toast, addLog]);

    return null; // Component does not render anything
};

export default KeyboardShortcuts;