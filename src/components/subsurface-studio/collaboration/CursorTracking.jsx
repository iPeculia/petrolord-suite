import React from 'react';
import { useWebSocket } from './WebSocketManager';
import { MousePointer2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { AnimatePresence, motion } from 'framer-motion';

const CursorTracking = () => {
    const { cursors, onlineUsers } = useWebSocket();
    const { user: currentUser } = useAuth();

    return (
        <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
            <AnimatePresence>
                {Object.entries(cursors).map(([userId, pos]) => {
                    if (userId === currentUser?.id) return null; // Don't show own cursor
                    const user = onlineUsers[userId];
                    if (!user || !pos) return null;

                    return (
                        <motion.div 
                            key={userId}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                            className="absolute flex flex-col items-start"
                            style={{ 
                                left: `${pos.x}%`, 
                                top: `${pos.y}%`,
                                color: user.color || '#f0f' 
                            }}
                        >
                            <MousePointer2 className="w-4 h-4 fill-current" style={{ transform: 'rotate(-15deg)' }} />
                            <div 
                                className="px-1.5 py-0.5 rounded text-[10px] text-white font-bold shadow-sm whitespace-nowrap"
                                style={{ backgroundColor: user.color || '#f0f' }}
                            >
                                {user.email?.split('@')[0]}
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default CursorTracking;