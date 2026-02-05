import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { debounce } from 'lodash';

const WellPlanningContext = createContext(null);

export const WellPlanningProvider = ({ wellId, children }) => {
  const { toast } = useToast();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Initial State for Drafts
  const [targetsDraft, setTargetsDraft] = useState(null);
  const [trajectoryDraft, setTrajectoryDraft] = useState(null);
  
  // Undo/Redo History Stacks for Trajectory
  const [trajectoryHistory, setTrajectoryHistory] = useState([]);
  const [trajectoryFuture, setTrajectoryFuture] = useState([]);

  // Load draft from local storage on mount or wellId change
  useEffect(() => {
    if (!wellId) return;
    
    const savedDraft = localStorage.getItem(`well_planning_draft_${wellId}`);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.targets) setTargetsDraft(parsed.targets);
        if (parsed.trajectory) {
          setTrajectoryDraft(parsed.trajectory);
          setTrajectoryHistory([parsed.trajectory]); // Initialize history
        }
        if (parsed.timestamp) {
            setLastSaved(new Date(parsed.timestamp));
        }
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    } else {
      // Reset if no draft
      setTargetsDraft(null);
      setTrajectoryDraft(null);
      setTrajectoryHistory([]);
      setTrajectoryFuture([]);
      setHasUnsavedChanges(false);
    }
  }, [wellId]);

  // Persist to local storage
  const persistDraft = useCallback((data) => {
    if (!wellId) return;
    
    const payload = {
      timestamp: new Date().toISOString(),
      ...data
    };
    
    localStorage.setItem(`well_planning_draft_${wellId}`, JSON.stringify(payload));
    setLastSaved(new Date());
    setHasUnsavedChanges(false); // Changes are "saved" to draft (locally)
  }, [wellId]);

  // Debounced Save
  const debouncedSave = useCallback(
    debounce((data) => {
      persistDraft(data);
    }, 1000),
    [persistDraft]
  );

  const updateTargetsDraft = (data) => {
    setTargetsDraft(data);
    setHasUnsavedChanges(true);
    if (autoSaveEnabled) {
      const currentDraft = JSON.parse(localStorage.getItem(`well_planning_draft_${wellId}`)) || {};
      debouncedSave({ ...currentDraft, targets: data });
    }
  };

  const updateTrajectoryDraft = (data, saveToHistory = true) => {
    setTrajectoryDraft(data);
    setHasUnsavedChanges(true);
    
    if (saveToHistory) {
      setTrajectoryHistory(prev => {
        const newHistory = [...prev, data];
        // Limit history size to 50
        if (newHistory.length > 50) return newHistory.slice(newHistory.length - 50);
        return newHistory;
      });
      setTrajectoryFuture([]); // Clear redo stack on new change
    }

    if (autoSaveEnabled) {
      const currentDraft = JSON.parse(localStorage.getItem(`well_planning_draft_${wellId}`)) || {};
      debouncedSave({ ...currentDraft, trajectory: data });
    }
  };

  const undoTrajectory = () => {
    if (trajectoryHistory.length <= 1) return;
    
    const current = trajectoryHistory[trajectoryHistory.length - 1];
    const previous = trajectoryHistory[trajectoryHistory.length - 2];
    
    setTrajectoryHistory(prev => prev.slice(0, -1));
    setTrajectoryFuture(prev => [current, ...prev]);
    setTrajectoryDraft(previous);
    
    // Auto-save the undo state
    const currentDraft = JSON.parse(localStorage.getItem(`well_planning_draft_${wellId}`)) || {};
    debouncedSave({ ...currentDraft, trajectory: previous });
  };

  const redoTrajectory = () => {
    if (trajectoryFuture.length === 0) return;
    
    const next = trajectoryFuture[0];
    
    setTrajectoryFuture(prev => prev.slice(1));
    setTrajectoryHistory(prev => [...prev, next]);
    setTrajectoryDraft(next);
    
    // Auto-save the redo state
    const currentDraft = JSON.parse(localStorage.getItem(`well_planning_draft_${wellId}`)) || {};
    debouncedSave({ ...currentDraft, trajectory: next });
  };

  const clearDraft = () => {
    if (wellId) {
      localStorage.removeItem(`well_planning_draft_${wellId}`);
      setTargetsDraft(null);
      setTrajectoryDraft(null);
      setTrajectoryHistory([]);
      setTrajectoryFuture([]);
      setHasUnsavedChanges(false);
    }
  };

  // Browser close warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Context-aware save method (stub for now, connects to main app logic)
  const saveVersion = async (note) => {
      // In a real implementation, this would trigger the save to DB logic
      console.log(`Saving version: ${note}`);
      // Clear unsaved changes flag
      setHasUnsavedChanges(false);
  };

  return (
    <WellPlanningContext.Provider
      value={{
        hasUnsavedChanges,
        setHasUnsavedChanges,
        lastSaved,
        autoSaveEnabled,
        setAutoSaveEnabled,
        targetsDraft,
        updateTargetsDraft,
        trajectoryDraft,
        updateTrajectoryDraft,
        undoTrajectory,
        redoTrajectory,
        canUndo: trajectoryHistory.length > 1,
        canRedo: trajectoryFuture.length > 0,
        clearDraft,
        wellId,
        saveVersion
      }}
    >
      {children}
    </WellPlanningContext.Provider>
  );
};

export const useWellPlanning = () => {
  const context = useContext(WellPlanningContext);
  if (!context) {
    throw new Error('useWellPlanning must be used within a WellPlanningProvider');
  }
  return context;
};