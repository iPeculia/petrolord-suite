import { supabase } from '@/lib/customSupabaseClient';

export class CollaborationEngine {
    constructor(projectId, userId, onPresenceChange, onBroadcast) {
        this.projectId = projectId;
        this.userId = userId;
        this.channel = null;
        this.onPresenceChange = onPresenceChange;
        this.onBroadcast = onBroadcast;
    }

    connect() {
        if (!this.projectId) return;

        this.channel = supabase.channel(`room:basinflow:${this.projectId}`, {
            config: {
                presence: {
                    key: this.userId,
                },
            },
        });

        this.channel
            .on('presence', { event: 'sync' }, () => {
                const state = this.channel.presenceState();
                // Transform presence state to user list
                const users = [];
                for (const key in state) {
                    state[key].forEach(presence => {
                        users.push({ 
                            userId: key, 
                            ...presence 
                        });
                    });
                }
                if (this.onPresenceChange) this.onPresenceChange(users);
            })
            .on('broadcast', { event: 'cursor-pos' }, (payload) => {
                if (this.onBroadcast) this.onBroadcast('cursor-pos', payload);
            })
            .on('broadcast', { event: 'selection-change' }, (payload) => {
                if (this.onBroadcast) this.onBroadcast('selection-change', payload);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await this.channel.track({ 
                        online_at: new Date().toISOString(),
                        cursor: null 
                    });
                }
            });
            
        return () => {
            supabase.removeChannel(this.channel);
        };
    }

    async updateCursor(x, y) {
        if (this.channel) {
            await this.channel.send({
                type: 'broadcast',
                event: 'cursor-pos',
                payload: { userId: this.userId, x, y }
            });
        }
    }

    async updateSelection(selectionId) {
        if (this.channel) {
            await this.channel.send({
                type: 'broadcast',
                event: 'selection-change',
                payload: { userId: this.userId, selectionId }
            });
        }
    }
    
    disconnect() {
        if (this.channel) supabase.removeChannel(this.channel);
    }
}