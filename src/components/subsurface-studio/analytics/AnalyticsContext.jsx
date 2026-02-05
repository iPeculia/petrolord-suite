import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useStudio } from '@/contexts/StudioContext';

const AnalyticsContext = createContext();

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider = ({ children }) => {
    const { user } = useAuth();
    const { activeProject } = useStudio();
    const [metrics, setMetrics] = useState({
        interactions: 0,
        apiCalls: 0,
        errors: 0,
        featureUsage: {},
        sessionStart: Date.now(),
        lastAction: null
    });

    const trackAction = (actionType, details = {}) => {
        setMetrics(prev => ({
            ...prev,
            interactions: prev.interactions + 1,
            lastAction: { type: actionType, timestamp: Date.now() },
            featureUsage: {
                ...prev.featureUsage,
                [actionType]: (prev.featureUsage[actionType] || 0) + 1
            }
        }));

        // In production, we would debounce this or push to a logging service/Supabase table
        // console.log(`[Analytics] ${actionType}`, details);
    };

    const trackError = (error) => {
        setMetrics(prev => ({ ...prev, errors: prev.errors + 1 }));
        console.error('[Analytics Error]', error);
    };

    const getSessionDuration = () => {
        return Math.round((Date.now() - metrics.sessionStart) / 1000); // seconds
    };

    const generateSummary = () => {
        const sortedFeatures = Object.entries(metrics.featureUsage).sort((a,b) => b[1] - a[1]);
        return {
            user: user?.email,
            project: activeProject?.name,
            durationSeconds: getSessionDuration(),
            totalInteractions: metrics.interactions,
            mostUsedFeature: sortedFeatures.length > 0 ? sortedFeatures[0][0] : 'None',
            errorCount: metrics.errors
        };
    };

    return (
        <AnalyticsContext.Provider value={{ metrics, trackAction, trackError, generateSummary }}>
            {children}
        </AnalyticsContext.Provider>
    );
};