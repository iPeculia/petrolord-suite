import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const IntegrationContext = createContext();

export const useIntegration = () => useContext(IntegrationContext);

export const IntegrationProvider = ({ children }) => {
  const { toast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Publish data to the shared registry
  const publishData = useCallback(async ({ 
    sourceAppId, 
    sourceRecordId, 
    category, 
    name, 
    data, 
    wellId = null, 
    reservoirId = null,
    description = '' 
  }) => {
    setIsPublishing(true);
    try {
      const { data: response, error } = await supabase.functions.invoke('data-exchange', {
        body: {
          action: 'publish',
          payload: {
            source_app_id: sourceAppId,
            source_record_id: sourceRecordId,
            data_category: category,
            data_name: name,
            payload: data,
            well_id: wellId,
            reservoir_id: reservoirId,
            description
          }
        }
      });

      if (error) throw error;
      if (response.error) throw new Error(response.error);

      toast({
        title: "Data Published Successfully",
        description: `${name} is now available to other applications.`,
      });
      return response.record;

    } catch (error) {
      console.error("Publish Error:", error);
      toast({
        title: "Publish Failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsPublishing(false);
    }
  }, [toast]);

  // Search for shared data
  const searchSharedData = useCallback(async ({ category, wellId, reservoirId }) => {
    setIsFetching(true);
    try {
      const { data: response, error } = await supabase.functions.invoke('data-exchange', {
        body: {
          action: 'search',
          payload: { category, well_id: wellId, reservoir_id: reservoirId }
        }
      });

      if (error) throw error;
      if (response.error) throw new Error(response.error);

      return response.results;
    } catch (error) {
      console.error("Search Error:", error);
      toast({
        title: "Data Retrieval Failed",
        description: error.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setIsFetching(false);
    }
  }, [toast]);

  return (
    <IntegrationContext.Provider value={{ publishData, searchSharedData, isPublishing, isFetching }}>
      {children}
    </IntegrationContext.Provider>
  );
};