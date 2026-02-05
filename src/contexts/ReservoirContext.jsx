import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { supabase } from '@/lib/customSupabaseClient';

    const ReservoirContext = createContext();

    export const useReservoir = () => useContext(ReservoirContext);

    export const ReservoirProvider = ({ children }) => {
      const [reservoir, setReservoir] = useState({ id: null, name: '' });
      const [isReady, setIsReady] = useState(false);
      const location = useLocation();
      const navigate = useNavigate();

      const setReservoirContext = useCallback((newReservoir) => {
        const newId = newReservoir?.id;
        const newName = newReservoir?.name || '';

        setReservoir({ id: newId, name: newName });

        if (newId) {
          localStorage.setItem('current_reservoir_id', newId);
          localStorage.setItem('current_reservoir_name', newName);
          const searchParams = new URLSearchParams(location.search);
          if (searchParams.get('reservoir_id') !== newId) {
            searchParams.set('reservoir_id', newId);
            navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
          }
        } else {
          localStorage.removeItem('current_reservoir_id');
          localStorage.removeItem('current_reservoir_name');
          const searchParams = new URLSearchParams(location.search);
          if (searchParams.has('reservoir_id')) {
            searchParams.delete('reservoir_id');
            navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
          }
        }
      }, [location.pathname, location.search, navigate]);

      useEffect(() => {
        const hydrateFromUrlOrStorage = async () => {
          setIsReady(false);
          const searchParams = new URLSearchParams(location.search);
          const urlId = searchParams.get('reservoir_id');
          const storageId = localStorage.getItem('current_reservoir_id');
          const targetId = urlId || storageId;

          if (targetId && targetId !== 'undefined' && targetId !== 'null') {
            if (reservoir.id !== targetId) {
              try {
                const { data, error } = await supabase.functions.invoke('reservoir-engine', { body: { action: 'get', reservoirId: targetId } });
                if (error) throw error;
                if (data.error) throw new Error(data.error);
                setReservoir({ id: data.id, name: data.name });
              } catch (error) {
                console.error("Failed to hydrate reservoir:", error);
                const storageName = localStorage.getItem('current_reservoir_name') || 'Unknown';
                setReservoir({ id: targetId, name: storageName });
              }
            }
          } else {
            setReservoir({ id: null, name: '' });
          }
          setIsReady(true);
        };

        hydrateFromUrlOrStorage();
      }, [location.search, reservoir.id]);

      const value = {
        reservoir,
        setReservoir: setReservoirContext,
        isReady,
      };

      return (
        <ReservoirContext.Provider value={value}>
          {children}
        </ReservoirContext.Provider>
      );
    };