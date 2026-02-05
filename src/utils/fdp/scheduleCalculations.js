/**
 * Schedule Calculations Utility
 * Implements Critical Path Method (CPM) and other schedule metrics.
 */

import { addDays, differenceInDays, parseISO, format } from 'date-fns';

export const calculateProjectDuration = (activities) => {
    if (!activities || activities.length === 0) return 0;
    const endDates = activities.map(a => new Date(a.endDate).getTime());
    const startDates = activities.map(a => new Date(a.startDate).getTime());
    
    const minStart = Math.min(...startDates);
    const maxEnd = Math.max(...endDates);
    
    return Math.ceil((maxEnd - minStart) / (1000 * 60 * 60 * 24));
};

export const calculateCPM = (activities) => {
    // Simplified CPM: 
    // 1. Map activities to efficient structure
    // 2. Forward Pass (ES, EF)
    // 3. Backward Pass (LS, LF)
    // 4. Float = LS - ES
    
    // Note: Real CPM requires strict dependencies. We'll infer or use provided dependencies.
    // For this MVP, we'll focus on Float based on user input dates vs inferred dates if strict logic existed.
    // Since user inputs dates directly in this UI, we calculate "Theoretical" Critical Path based on 0-float logic
    // assuming end-to-start dependencies are tightest constraints.
    
    // Returning placeholder logic for highlighting
    return activities.map(a => ({
        ...a,
        isCritical: a.float === 0 || a.float === undefined, // Default to critical if not calculated
        float: a.float || 0
    }));
};

export const calculateResourceRequirements = (activities) => {
    // Aggregate resources by time period (e.g. monthly)
    const resourceProfile = {};
    
    activities.forEach(activity => {
        if (!activity.resources) return;
        
        // Simplified: just summing total required, not time-distributed
        const { crew, cost } = activity.resources;
        // ... implementation would distribute over activity duration
    });

    return resourceProfile;
};

export const identifyMilestones = (activities) => {
    return activities.filter(a => a.type === 'Milestone' || a.duration === 0);
};