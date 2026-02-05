import React from 'react';
import { useWebSocket } from './WebSocketManager';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Users, Wifi, WifiOff } from 'lucide-react';

const PresenceAwareness = () => {
    const { onlineUsers, status } = useWebSocket();
    const userList = Object.values(onlineUsers);

    const getStatusIndicator = () => {
        switch (status) {
            case 'SUBSCRIBED':
                return <Wifi className="w-3 h-3 text-green-400" />;
            case 'CHANNEL_ERROR':
                return <WifiOff className="w-3 h-3 text-red-400" />;
            default:
                return <WifiOff className="w-3 h-3 text-yellow-400" />;
        }
    };

    return (
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800 h-full">
            <div className="flex -space-x-2">
                <TooltipProvider>
                    {userList.map((user) => (
                        <Tooltip key={user.user_id}>
                            <TooltipTrigger>
                                <Avatar className="w-6 h-6 border-2 border-slate-900">
                                    <AvatarImage src={user.avatar_url} />
                                    <AvatarFallback className="text-[10px] text-white font-bold" style={{ backgroundColor: user.color }}>
                                        {user.email ? user.email.substring(0, 2).toUpperCase() : '??'}
                                    </AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{user.email}</p>
                                <p className="text-[10px] text-slate-400">Online since {new Date(user.online_at).toLocaleTimeString()}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <div className={`flex items-center gap-1 text-xs`}>
                            {getStatusIndicator()}
                            <span className="text-slate-400">{userList.length}</span>
                         </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Real-time connection: <span className="font-bold">{status}</span></p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default PresenceAwareness;