import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

const WellErrorHandler = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-4 border-red-900 bg-red-900/10 text-red-200">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2 font-semibold">
        {error.title || "Error"}
      </AlertTitle>
      <AlertDescription className="mt-2 text-sm opacity-90">
        {error.description}
        {onRetry && (
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="border-red-800 hover:bg-red-900/50 hover:text-white text-red-200"
            >
              <RefreshCw className="w-3 h-3 mr-2" />
              Retry Operation
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default WellErrorHandler;