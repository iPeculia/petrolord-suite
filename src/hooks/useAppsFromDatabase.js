import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let globalCache = {
    data: null,
    timestamp: 0,
    promise: null
};

export const useAppsFromDatabase = (moduleFilter = null) => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const mounted = useRef(true);

    const applyFilter = useCallback((allApps) => {
        if (!moduleFilter) return allApps;
        return allApps.filter(app => 
            app.module?.toLowerCase() === moduleFilter.toLowerCase()
        );
    }, [moduleFilter]);

    const fetchApps = useCallback(async (forceRefresh = false) => {
        const now = Date.now();

        // Return cached data if valid
        if (!forceRefresh && globalCache.data && (now - globalCache.timestamp < CACHE_DURATION)) {
            if (mounted.current) {
                setApps(applyFilter(globalCache.data));
                setLoading(false);
            }
            return;
        }

        // Deduplicate ongoing requests
        if (globalCache.promise && !forceRefresh) {
            try {
                const data = await globalCache.promise;
                if (mounted.current) {
                    setApps(applyFilter(data));
                    setLoading(false);
                }
            } catch (err) {
                if (mounted.current) setError(err);
            }
            return;
        }

        try {
            setLoading(true);
            const fetchPromise = (async () => {
                const { data, error } = await supabase
                    .from('master_apps')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (error) throw error;

                // Process and normalize data
                const processedApps = data.map(app => ({
                    ...app,
                    isComingSoon: !app.is_built || app.status === 'coming_soon' || app.status === 'Coming Soon',
                    route: app.slug && app.module ? `/dashboard/apps/${app.module}/${app.slug}` : '#'
                }));
                
                return processedApps;
            })();

            globalCache.promise = fetchPromise;
            const result = await fetchPromise;

            globalCache.data = result;
            globalCache.timestamp = Date.now();
            globalCache.promise = null;

            if (mounted.current) {
                setApps(applyFilter(result));
                setError(null);
            }
        } catch (err) {
            console.error("[useAppsFromDatabase] ❌ Error fetching master_apps:", err);
            if (mounted.current) setError(err);
            globalCache.promise = null;
        } finally {
            if (mounted.current) setLoading(false);
        }
    }, [applyFilter, moduleFilter]);

    useEffect(() => {
        mounted.current = true;
        fetchApps();
        return () => { mounted.current = false; };
    }, [fetchApps]);

    return {
        apps,
        loading,
        error,
        refresh: () => fetchApps(true)
    };
};