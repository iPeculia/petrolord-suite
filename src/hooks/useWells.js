import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { wellLogger } from '@/utils/wellLogger';
import { getWellErrorMessage } from '@/utils/wellErrorMessages';
import { validateWellData } from '@/utils/wellValidation';

export const useWells = (projectId) => {
  const [wells, setWells] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchWells = useCallback(async () => {
    if (!projectId || !user) return;
    
    const startTime = performance.now();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('em_wells')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setWells(data || []);
      wellLogger.logPerformance('fetchWells', performance.now() - startTime);
    } catch (err) {
      const formattedError = getWellErrorMessage(err);
      setError(formattedError);
      wellLogger.error('Fetch wells failed', err);
      
      toast({
        title: formattedError.title,
        description: formattedError.description,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, user, toast]);

  const addWell = useCallback(async (wellData) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return null;
    }

    const validation = validateWellData(wellData, wells);
    if (!validation.isValid) {
      toast({ title: "Validation Error", description: validation.errors[0], variant: "destructive" });
      return null;
    }

    setIsLoading(true);
    wellLogger.logSecurityEvent('INSERT_ATTEMPT', 'INIT', { userId: user.id, project: projectId });

    try {
      // 1. Prepare payload with explicit user_id for RLS
      const payload = {
        ...wellData,
        project_id: projectId,
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      // 2. Attempt Insert
      const { data, error: insertError } = await supabase
        .from('em_wells')
        .insert([payload])
        .select()
        .single();

      if (insertError) throw insertError;

      // 3. Success
      setWells(prev => [data, ...prev]);
      wellLogger.logSecurityEvent('INSERT_ATTEMPT', 'SUCCESS', { wellId: data.id });
      toast({
        title: "Well Created",
        description: `Well "${data.name}" has been added successfully.`,
        variant: "success" // Assuming enhanced toast or standard default
      });
      
      return data;

    } catch (err) {
      // 4. Error Handling
      const formattedError = getWellErrorMessage(err);
      wellLogger.logSecurityEvent('INSERT_ATTEMPT', 'FAILED', { error: err.message });
      setError(formattedError);
      
      toast({
        title: formattedError.title,
        description: formattedError.description,
        variant: "destructive",
        action: <button onClick={() => addWell(wellData)} className="text-xs underline">Retry</button>
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [projectId, user, wells, toast]);

  return {
    wells,
    isLoading,
    error,
    fetchWells,
    addWell
  };
};