import React, { Suspense } from 'react';
import { MaterialBalanceProvider } from '@/contexts/MaterialBalanceContext';
import MBHeader from '@/components/materialBalance/MBHeader';
import MBBottomPanel from '@/components/materialBalance/MBBottomPanel';
import MBTabs from '@/components/materialBalance/MBTabs';
import MBErrorBoundary from '@/components/materialBalance/MBErrorBoundary';
import { Toaster } from '@/components/ui/toaster';

// Material Balance Pro - Main Application Entry
// Phase 5: Complete Integration with Error Boundaries and Project Management

const MaterialBalancePro = () => {
  return (
    <MBErrorBoundary>
      <MaterialBalanceProvider>
        <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
          {/* Application Header with Project Actions */}
          <MBHeader />
          
          {/* Main Workspace - Tabbed Interface */}
          <div className="flex-1 overflow-hidden relative">
            <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500">Loading Modules...</div>}>
              <MBTabs />
            </Suspense>
          </div>

          {/* Status & Audit Footer */}
          <MBBottomPanel />
          
          <Toaster />
        </div>
      </MaterialBalanceProvider>
    </MBErrorBoundary>
  );
};

export default MaterialBalancePro;