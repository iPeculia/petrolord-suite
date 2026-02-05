import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Settings, HelpCircle, Shield } from 'lucide-react';

const MobileProfile = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="p-4 bg-slate-950 min-h-full pb-24">
      <div className="flex flex-col items-center py-8">
        <Avatar className="w-24 h-24 mb-4 bg-blue-600 border-4 border-slate-900">
            <AvatarFallback className="text-2xl text-white bg-transparent">
                {user?.email?.[0]?.toUpperCase()}
            </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold text-white">{user?.user_metadata?.full_name || 'User'}</h2>
        <p className="text-sm text-slate-500">{user?.email}</p>
      </div>

      <div className="space-y-2">
        <div className="bg-slate-900 rounded-lg overflow-hidden">
            <button className="w-full p-4 flex items-center gap-3 text-slate-300 hover:bg-slate-800 transition-colors text-left border-b border-slate-800">
                <Settings className="w-5 h-5 text-slate-500" />
                <span>App Settings</span>
            </button>
            <button className="w-full p-4 flex items-center gap-3 text-slate-300 hover:bg-slate-800 transition-colors text-left border-b border-slate-800">
                <Shield className="w-5 h-5 text-slate-500" />
                <span>Privacy & Security</span>
            </button>
            <button className="w-full p-4 flex items-center gap-3 text-slate-300 hover:bg-slate-800 transition-colors text-left">
                <HelpCircle className="w-5 h-5 text-slate-500" />
                <span>Help & Support</span>
            </button>
        </div>

        <Button 
            variant="destructive" 
            className="w-full mt-8 flex items-center gap-2"
            onClick={() => signOut()}
        >
            <LogOut className="w-4 h-4" /> Sign Out
        </Button>
      </div>
      
      <div className="text-center text-xs text-slate-700 mt-8">
        Version 1.0.0 (PWA)
      </div>
    </div>
  );
};

export default MobileProfile;