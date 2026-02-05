import { supabase } from '@/lib/customSupabaseClient';

class SubscriptionManager {
    constructor() {
        this.channels = new Map();
    }

    subscribeOnce(channelKey) {
        if (this.channels.has(channelKey)) {
            const existing = this.channels.get(channelKey);
            if (existing.state === 'joined') {
                return existing;
            }
        }

        const channel = supabase.channel(channelKey, {
            config: {
                presence: {
                    key: Math.random().toString(36).substring(2),
                },
            },
        });

        this.channels.set(channelKey, channel);
        return channel;
    }

    async unsubscribe(channelKey) {
        const channel = this.channels.get(channelKey);
        if (channel) {
            try {
                await supabase.removeChannel(channel);
            } catch (error) {
                console.error(`Error unsubscribing from ${channelKey}:`, error.message);
            } finally {
                this.channels.delete(channelKey);
            }
        }
    }

    async unsubscribeAll() {
        const unsubscribePromises = [];
        this.channels.forEach((channel) => {
            unsubscribePromises.push(supabase.removeChannel(channel));
        });
        await Promise.all(unsubscribePromises);
        this.channels.clear();
    }

    getActiveChannelKeys() {
        return Array.from(this.channels.keys());
    }
}

export const subscriptionManager = new SubscriptionManager();