import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const usePetrophysicsCollaboration = (projectId, toast) => {
    const { user } = useAuth();
    const [team, setTeam] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [comments, setComments] = useState([]);
    const [versions, setVersions] = useState([]);
    const [channels, setChannels] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeChannelId, setActiveChannelId] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [wikiPages, setWikiPages] = useState([]);
    const [userRole, setUserRole] = useState(null); // 'owner', 'admin', 'editor', 'viewer'
    const [loading, setLoading] = useState(false);

    // Determine Role
    useEffect(() => {
        if (!projectId || !user) return;

        const fetchRole = async () => {
            // Check if owner
            const { data: project } = await supabase.from('petrophysics_projects').select('user_id').eq('id', projectId).single();
            if (project && project.user_id === user.id) {
                setUserRole('owner');
                return;
            }

            // Check team member role
            const { data: member } = await supabase.from('petrophysics_team_members').select('role').eq('project_id', projectId).eq('user_id', user.id).single();
            if (member) {
                setUserRole(member.role);
            } else {
                setUserRole(null);
            }
        };
        fetchRole();
    }, [projectId, user]);

    // 1. Team Management
    const fetchTeam = useCallback(async () => {
        if (!projectId) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('petrophysics_team_members')
            .select(`
                id, role, user_id, created_at,
                users:public_users(email, display_name)
            `) // Assuming relation to public_users view or similar mechanism in this env
            .eq('project_id', projectId);

        if (error) {
            // Fallback fetch without join if view not available
            const { data: simpleData } = await supabase.from('petrophysics_team_members').select('*').eq('project_id', projectId);
            if (simpleData) {
                const enriched = await Promise.all(simpleData.map(async (m) => {
                    const { data: u } = await supabase.from('users').select('email').eq('id', m.user_id).single(); // Fallback to direct auth fetch if permissible or cached logic
                    return { ...m, email: u?.email || 'User', name: u?.email?.split('@')[0] };
                }));
                setTeam(enriched);
            }
        } else {
            const formatted = data.map(m => ({
                ...m,
                email: m.users?.email || 'User',
                name: m.users?.display_name || m.users?.email?.split('@')[0]
            }));
            setTeam(formatted);
        }
        setLoading(false);
    }, [projectId]);

    const addMember = async (email, role) => {
        if (!['owner', 'admin'].includes(userRole)) {
            toast({ variant: 'destructive', title: 'Permission Denied', description: 'Only admins can add members.' });
            return;
        }
        
        // Find user by email (requires admin access or unrestricted read on users usually, assuming env allows looking up by email for invite flow)
        // In Supabase real-world, we often use edge functions for invites. Here we simulate direct lookup if permitted.
        // Assuming we invite by just inserting if ID known, or create an invite token. 
        // For this "self-sufficient" demo, we'll just simulate adding if user exists in Auth table.
        
        // Mocking ID lookup for demo functionality in restricted env
        const { data: users } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
        
        if (!users) {
            toast({ variant: 'destructive', title: 'User Not Found', description: 'User must be registered first.' });
            return;
        }

        const { error } = await supabase.from('petrophysics_team_members').insert({
            project_id: projectId,
            user_id: users.id,
            role
        });

        if (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } else {
            toast({ title: 'Member Added', description: `${email} added as ${role}.` });
            fetchTeam();
            logActivity('member_added', `Added user ${email} as ${role}`);
        }
    };

    const updateMemberRole = async (memberId, newRole) => {
        if (!['owner', 'admin'].includes(userRole)) return;
        const { error } = await supabase.from('petrophysics_team_members').update({ role: newRole }).eq('id', memberId);
        if (!error) {
            fetchTeam();
            toast({ title: 'Role Updated' });
        }
    };

    const removeMember = async (memberId) => {
        if (!['owner', 'admin'].includes(userRole)) return;
        const { error } = await supabase.from('petrophysics_team_members').delete().eq('id', memberId);
        if (!error) {
            fetchTeam();
            toast({ title: 'Member Removed' });
            logActivity('member_removed', 'Removed a team member');
        }
    };

    // 2. Activity Log
    const fetchActivity = useCallback(async () => {
        if (!projectId) return;
        const { data } = await supabase
            .from('petrophysics_activity_log')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false })
            .limit(50);
        
        if (data) {
            const enriched = await Promise.all(data.map(async (log) => {
                // Try to get email simply
                return { ...log }; 
            }));
            setActivityLog(enriched);
        }
    }, [projectId]);

    const logActivity = async (actionType, description, metadata = {}) => {
        if (!projectId || !user) return;
        await supabase.from('petrophysics_activity_log').insert({
            project_id: projectId,
            user_id: user.id,
            action_type: actionType,
            description,
            metadata
        });
        fetchActivity(); 
    };

    // 3. Comments
    const fetchComments = useCallback(async () => {
        if (!projectId) return;
        const { data } = await supabase
            .from('petrophysics_comments')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true });
            
        if (data) {
            // Enrich with user info locally if needed
            setComments(data);
        }
    }, [projectId]);

    const addComment = async (content, targetType = 'general', targetId = null) => {
        if (!projectId) return;
        const { error } = await supabase.from('petrophysics_comments').insert({
            project_id: projectId,
            user_id: user.id,
            content,
            target_type: targetType,
            target_id: targetId
        });
        if (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } else {
            fetchComments();
            logActivity('comment_added', `Added comment on ${targetType}`);
        }
    };

    // 4. Version Control
    const fetchVersions = useCallback(async () => {
        if (!projectId) return;
        const { data } = await supabase
            .from('petrophysics_project_versions')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });
        setVersions(data || []);
    }, [projectId]);

    const createSnapshot = async (name, fullState) => {
        if (!['owner', 'admin', 'editor'].includes(userRole)) {
            toast({ variant: 'destructive', title: 'Permission Denied', description: 'Viewers cannot create snapshots.' });
            return;
        }
        
        const snapshot = {
            wells: fullState.wells,
            markers: fullState.markers,
            activeWellId: fullState.activeWellId,
        };

        const { error } = await supabase.from('petrophysics_project_versions').insert({
            project_id: projectId,
            created_by: user.id,
            name,
            version_number: versions.length + 1,
            data_snapshot: snapshot
        });

        if (error) {
            toast({ variant: 'destructive', title: 'Snapshot Failed', description: error.message });
        } else {
            toast({ title: 'Snapshot Created', description: `Version '${name}' saved.` });
            fetchVersions();
            logActivity('version_created', `Created version: ${name}`);
        }
    };

    // 5. Messaging (Chat)
    const fetchChannels = useCallback(async () => {
        if (!projectId) return;
        const { data } = await supabase.from('petrophysics_channels').select('*').eq('project_id', projectId);
        if (data && data.length === 0) {
            // Create default channel if none
            const { data: newChannel } = await supabase.from('petrophysics_channels').insert({
                project_id: projectId,
                name: 'General',
                description: 'General project discussion',
                created_by: user.id
            }).select().single();
            setChannels([newChannel]);
            setActiveChannelId(newChannel?.id);
        } else if (data) {
            setChannels(data);
            if (!activeChannelId && data.length > 0) setActiveChannelId(data[0].id);
        }
    }, [projectId, user, activeChannelId]);

    const fetchMessages = useCallback(async () => {
        if (!activeChannelId) return;
        const { data } = await supabase
            .from('petrophysics_messages')
            .select('*')
            .eq('channel_id', activeChannelId)
            .order('created_at', { ascending: true });
        
        if (data) {
             // Simple enrichment simulation
             const enriched = data.map(m => ({
                 ...m,
                 user_email: team.find(t => t.user_id === m.user_id)?.email || 'User'
             }));
             setMessages(enriched);
        }
    }, [activeChannelId, team]);

    const sendMessage = async (content) => {
        if (!activeChannelId || !content.trim()) return;
        const { error } = await supabase.from('petrophysics_messages').insert({
            channel_id: activeChannelId,
            user_id: user.id,
            content
        });
        if (!error) fetchMessages();
    };

    const createChannel = async (name, description) => {
        const { error } = await supabase.from('petrophysics_channels').insert({
            project_id: projectId,
            name, 
            description,
            created_by: user.id
        });
        if (!error) {
            fetchChannels();
            toast({ title: 'Channel Created' });
        }
    };

    // 6. Notifications
    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        const { data } = await supabase
            .from('petrophysics_notifications')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_read', false)
            .order('created_at', { ascending: false });
        setNotifications(data || []);
    }, [user]);

    const markNotificationRead = async (id) => {
        await supabase.from('petrophysics_notifications').update({ is_read: true }).eq('id', id);
        fetchNotifications();
    };

    // 7. Wiki / Knowledge Base
    const fetchWiki = useCallback(async () => {
        if (!projectId) return;
        const { data } = await supabase.from('petrophysics_wiki_pages').select('*').eq('project_id', projectId);
        setWikiPages(data || []);
    }, [projectId]);

    const saveWikiPage = async (title, content, category) => {
        if (!['owner', 'admin', 'editor'].includes(userRole)) return;
        const slug = title.toLowerCase().replace(/ /g, '-');
        const { error } = await supabase.from('petrophysics_wiki_pages').upsert({
            project_id: projectId,
            title,
            slug,
            content,
            category,
            last_updated_by: user.id
        }, { onConflict: 'project_id, slug' });
        
        if (!error) {
            fetchWiki();
            toast({ title: 'Wiki Page Saved' });
        }
    };

    // Realtime Subscription
    useEffect(() => {
        if (!projectId || !activeChannelId) return;
        
        const channel = supabase
            .channel('collab_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'petrophysics_messages', filter: `channel_id=eq.${activeChannelId}` }, (payload) => {
                const newMessage = payload.new;
                // Manually merge user email if possible or just push
                setMessages(prev => [...prev, { ...newMessage, user_email: 'New Message' }]);
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'petrophysics_notifications', filter: `user_id=eq.${user?.id}` }, () => {
                fetchNotifications();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [projectId, activeChannelId, user, fetchNotifications]);


    return {
        userRole,
        team,
        activityLog,
        comments,
        versions,
        channels,
        messages,
        activeChannelId,
        notifications,
        wikiPages,
        loading,
        fetchTeam,
        addMember,
        updateMemberRole,
        removeMember,
        fetchActivity,
        logActivity,
        fetchComments,
        addComment,
        fetchVersions,
        createSnapshot,
        fetchChannels,
        setActiveChannelId,
        sendMessage,
        createChannel,
        fetchNotifications,
        markNotificationRead,
        fetchWiki,
        saveWikiPage
    };
};