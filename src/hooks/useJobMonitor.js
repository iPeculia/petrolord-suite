import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useJobMonitor = (jobId) => {
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    const fetchInitialJob = async () => {
      if (!jobId) return;
      try {
        const { data, error } = await supabase
          .from('ss_jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (error) throw error;
        setJob(data);
      } catch (err) {
        console.error('Error fetching initial job state:', err);
        setError('Failed to fetch initial job state.');
      }
    };

    const setupSubscription = () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
      
      if (jobId) {
        fetchInitialJob();

        subscriptionRef.current = supabase
          .channel(`ss_jobs_monitor_${jobId}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'ss_jobs',
              filter: `id=eq.${jobId}`,
            },
            (payload) => {
              setJob(payload.new);
            }
          )
          .subscribe((status, err) => {
            if (status === 'SUBSCRIBED') {
              console.log(`Subscribed to job ${jobId}`);
            }
            if (status === 'CHANNEL_ERROR') {
              console.error('Subscription error:', err);
              setError('Real-time connection failed.');
            }
          });
      }
    };

    setJob(null);
    setError(null);
    setupSubscription();

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [jobId]);

  return { job, error, isLoading: jobId && !job && !error };
};