import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const WebSocketContext = createContext();
export const useWebSocket = () => useContext(WebSocketContext);

// Custom hook for debouncing
function useDebouncedCallback(callback, delay) {
    const callbackRef = useRef(callback);
    const timeoutRef = useRef();

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callbackRef.current(...args);
        }, delay);
    }, [delay]);
}


export const WebSocketManager = ({ children, projectId }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [status, setStatus] = useState('DISCONNECTED');
    const channelRef = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [cursors, setCursors] = useState({});

    const broadcastCursor = useCallback((position) => {
        if (channelRef.current && channelRef.current.state === 'joined' && user) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'cursor-move',
                payload: { userId: user.id, position }
            });
        }
    }, [user]);

    const debouncedBroadcastCursor = useDebouncedCallback(broadcastCursor, 50);

    useEffect(() => {
        if (!user || !projectId) return;

        const channel = supabase.channel(`project:${projectId}`, {
            config: {
                presence: {
                    key: user.id,
                },
                broadcast: {
                    ack: true,
                }
            },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const newState = channel.presenceState();
                const users = {};
                const cursorData = {};
                
                if (newState) {
                    Object.keys(newState).forEach(key => {
                        // Defensive check for array access
                        if (newState[key] && newState[key].length > 0) {
                            const state = newState[key][0];
                            if (state) {
                                users[key] = state;
                                if (state.cursor) cursorData[key] = state.cursor;
                            }
                        }
                    });
                }
                
                setOnlineUsers(users);
                setCursors(cursorData);
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                // Defensive check: Ensure newPresences is an array and has elements
                if (newPresences && newPresences.length > 0) {
                    const newUser = newPresences[0];
                    toast({ 
                        title: "User Joined", 
                        description: `${newUser?.email?.split('@')[0] || 'A collaborator'} has joined the session.`,
                        className: "bg-blue-950 border-blue-800 text-blue-100"
                    });
                }
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                // Defensive check: Ensure leftPresences is an array and has elements
                if (leftPresences && leftPresences.length > 0) {
                    const leftUser = leftPresences[0];
                    if(leftUser){
                        toast({ 
                            title: "User Left", 
                            description: `${leftUser?.email?.split('@')[0] || 'A collaborator'} has left the session.`,
                            variant: 'destructive',
                        });
                    }
                }
            })
            .on('broadcast', { event: 'cursor-move' }, ({ payload }) => {
                if (payload && payload.userId) {
                    setCursors(prev => ({ ...prev, [payload.userId]: payload.position }));
                }
            })
            .subscribe((status, err) => {
                setStatus(status);
                if (status === 'SUBSCRIBED') {
                    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
                    channel.track({ 
                        user_id: user.id, 
                        email: user.email, 
                        online_at: new Date().toISOString(),
                        color: randomColor
                    });
                }
                if (err) {
                    console.error('Realtime subscription error:', err);
                    setStatus('CHANNEL_ERROR');
                }
            });

        channelRef.current = channel;

        const handleMouseMove = (e) => {
            const rect = document.body.getBoundingClientRect();
            const x = (e.clientX / rect.width) * 100;
            const y = (e.clientY / rect.height) * 100;
            debouncedBroadcastCursor({ x, y });
        };
        
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current).catch(console.error);
                channelRef.current = null;
            }
        };
    }, [user, projectId, toast, debouncedBroadcastCursor]);

    const broadcastSelection = useCallback((selection) => {
        if (channelRef.current && channelRef.current.state === 'joined' && user) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'selection-change',
                payload: { userId: user.id, selection }
            });
        }
    }, [user]);

    return (
        <WebSocketContext.Provider value={{ status, onlineUsers, cursors, broadcastCursor: debouncedBroadcastCursor, broadcastSelection, channel: channelRef.current }}>
            {children}
        </WebSocketContext.Provider>
    );
};