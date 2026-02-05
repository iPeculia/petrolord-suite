import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { CollaborationEngine } from '../services/CollaborationEngine';
import { useMultiWell } from './MultiWellContext';

const CollaborationContext = createContext(null);

export const CollaborationProvider = ({ children }) => {
    const { state: mwState } = useMultiWell();
    const projectId = mwState.activeProject?.id; 
    const [currentUser, setCurrentUser] = useState(null);
    
    const [activeUsers, setActiveUsers] = useState([]);
    const [cursors, setCursors] = useState({});
    const [activityLog, setActivityLog] = useState([]);
    const [comments, setComments] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const engineRef = useRef(null);
    const timeoutRef = useRef(null);

    // Fetch current authenticated user
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setCurrentUser(user);
        };
        getUser();
    }, []);

    const fetchInitialData = useCallback(async () => {
        if (!projectId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        // Safety timeout: Force loading to finish after 5 seconds
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsLoading(false);
            // Don't necessarily set error, just stop spinning. 
            // Users will see empty states if data didn't arrive.
            console.warn("Collaboration data fetch timed out (5s limit)");
        }, 5000);

        try {
            // Fetch Team Members
            const { data: members, error: memberError } = await supabase
                .from('bf_team_members')
                .select('*, user:user_id(email, raw_user_meta_data)')
                .eq('project_id', projectId);
            
            if (memberError) throw memberError;
            setTeamMembers(members || []);

            // Fetch Activity Log
            const { data: activities, error: activityError } = await supabase
                .from('bf_activity_log')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false })
                .limit(50);

            if (activityError) throw activityError;
            setActivityLog(activities || []);

            // Fetch Comments
            const { data: comms, error: commsError } = await supabase
                .from('bf_comments')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: true });
            
            if (commsError) throw commsError;
            setComments(comms || []);

            // Fetch Notifications
            if (currentUser) {
                const { data: notes, error: notesError } = await supabase
                    .from('bf_activity_log')
                    .select('*')
                    .eq('project_id', projectId)
                    .neq('user_id', currentUser.id)
                    .order('created_at', { ascending: false })
                    .limit(10);
                
                if (notesError) throw notesError;
                setNotifications(notes || []);
            }

            // Clear timeout if successful
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

        } catch (error) {
            console.error("Error fetching collaboration data:", error);
            setError(error.message || "Failed to load collaboration data");
        } finally {
            setIsLoading(false);
        }
    }, [projectId, currentUser]);

    // Initial fetch
    useEffect(() => {
        fetchInitialData();
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [fetchInitialData]);

    // Real-time subscriptions
    useEffect(() => {
        if (!currentUser || !projectId) return;

        const engine = new CollaborationEngine(
            projectId,
            currentUser.id,
            (users) => {
                setActiveUsers(users.map(u => ({ 
                    ...u, 
                    name: u.userId.slice(0, 6), 
                    color: '#' + Math.floor(Math.random()*16777215).toString(16) 
                })));
            },
            (event, payload) => {
                if (event === 'cursor-pos') {
                    setCursors(prev => ({ ...prev, [payload.payload.userId]: { x: payload.payload.x, y: payload.payload.y } }));
                }
            }
        );

        engine.connect();
        engineRef.current = engine;

        const channel = supabase
            .channel('bf-db-changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bf_comments', filter: `project_id=eq.${projectId}` }, payload => {
                setComments(prev => [...prev, payload.new]);
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bf_activity_log', filter: `project_id=eq.${projectId}` }, payload => {
                setActivityLog(prev => [payload.new, ...prev]);
                if (payload.new.user_id !== currentUser.id) {
                    setNotifications(prev => [payload.new, ...prev]);
                }
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bf_team_members', filter: `project_id=eq.${projectId}` }, payload => {
                setTeamMembers(prev => [...prev, payload.new]);
            })
            .subscribe();

        return () => {
            engine.disconnect();
            supabase.removeChannel(channel);
        };
    }, [currentUser, projectId]);

    const broadcastCursor = useCallback((x, y) => {
        if (engineRef.current) engineRef.current.updateCursor(x, y);
    }, []);

    const logActivity = async (action, details) => {
        if (!currentUser || !projectId) return;
        const { error } = await supabase.from('bf_activity_log').insert([{
            project_id: projectId,
            user_id: currentUser.id,
            action,
            details
        }]);
        if (error) console.error("Error logging activity", error);
    };

    const addComment = async (message, context = 'general') => {
        if (!currentUser || !projectId) return;
        const { error } = await supabase.from('bf_comments').insert([{
            project_id: projectId,
            user_id: currentUser.id,
            message,
            context,
            resolved: false
        }]);
        if (error) console.error("Error adding comment", error);
    };

    const inviteMember = async (email, role = 'viewer') => {
        if (!projectId) return;
        logActivity('MEMBER_INVITED', { email, role });
        // Simulate adding for UI feedback since we don't have full backend invite logic
        setTeamMembers(prev => [...prev, {
            id: Math.random().toString(),
            user_id: 'pending',
            role,
            user: { email }
        }]);
        return true;
    };

    const retryFetch = () => {
        fetchInitialData();
    };

    return (
        <CollaborationContext.Provider value={{
            activeUsers,
            cursors,
            activityLog,
            comments,
            teamMembers,
            notifications,
            broadcastCursor,
            logActivity,
            addComment,
            inviteMember,
            currentUser,
            isLoading,
            error,
            retryFetch,
            projectId
        }}>
            {children}
        </CollaborationContext.Provider>
    );
};

export const useCollaboration = () => {
    const context = useContext(CollaborationContext);
    if (!context) throw new Error('useCollaboration must be used within CollaborationProvider');
    return context;
};