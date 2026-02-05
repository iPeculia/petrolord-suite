import React from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white w-8 h-8">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-slate-900 border-slate-800 p-0 mr-4" align="end">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h4 className="font-semibold text-white">Notifications</h4>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" className="h-6 text-xs text-slate-400 hover:text-red-400" onClick={clearAll}>
              Clear All
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 hover:bg-slate-800/50 transition-colors ${notification.read ? 'opacity-60' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-medium ${notification.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'}`}>
                      {notification.title}
                    </span>
                    <span className="text-[10px] text-slate-500">{notification.time}</span>
                  </div>
                  <p className="text-xs text-slate-300">{notification.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm">
              No new notifications
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;