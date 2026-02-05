import React from 'react';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

const ProgressIndicator = ({ status }) => {
    const statusConfig = {
        idle: { icon: <Clock className="h-4 w-4" />, text: 'Idle', color: 'text-slate-400' },
        running: { icon: <Loader2 className="h-4 w-4 animate-spin" />, text: 'Calculating...', color: 'text-blue-400' },
        completed: { icon: <CheckCircle className="h-4 w-4" />, text: 'Completed', color: 'text-green-400' },
        failed: { icon: <XCircle className="h-4 w-4" />, text: 'Failed', color: 'text-red-400' },
    };

    const currentStatus = statusConfig[status] || statusConfig.idle;

    return (
        <div className={`flex items-center gap-2 text-sm font-medium ${currentStatus.color}`}>
            {currentStatus.icon}
            <span>{currentStatus.text}</span>
        </div>
    );
};

export default ProgressIndicator;