import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileCode, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const LasFileUploader = ({ onFileSelect, file, onClear, isLoading }) => {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'text/plain': ['.las', '.LAS'] },
    multiple: false,
    disabled: isLoading
  });

  if (file) {
    return (
      <div className="border rounded-lg p-4 bg-slate-900 border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900/30 rounded">
              <FileCode className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          {!isLoading && (
            <Button variant="ghost" size="icon" onClick={onClear} className="hover:bg-slate-800">
              <X className="w-4 h-4 text-slate-400" />
            </Button>
          )}
        </div>
        {isLoading && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-blue-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              Parsing file...
            </div>
            <Progress value={45} className="h-1" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-950/10' : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <UploadCloud className={`w-10 h-10 ${isDragActive ? 'text-blue-400' : 'text-slate-500'}`} />
        <p className="text-sm font-medium text-slate-300">
          {isDragActive ? "Drop LAS file here" : "Drag & Drop LAS file"}
        </p>
        <p className="text-xs text-slate-500">or click to browse</p>
      </div>
    </div>
  );
};

export default LasFileUploader;