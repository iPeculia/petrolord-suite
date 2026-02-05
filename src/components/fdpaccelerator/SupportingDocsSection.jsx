import React, { useRef } from 'react';
import CollapsibleSection from './CollapsibleSection';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';

const SupportingDocsSection = ({ formState, setFormState }) => {
  const fileInputRef = useRef(null);
  const { supportingFiles } = formState;

  const handleFileChange = (event) => {
    setFormState(prev => ({ ...prev, supportingFiles: Array.from(event.target.files) }));
  };

  const removeFile = (fileName) => {
    setFormState(prev => ({ ...prev, supportingFiles: prev.supportingFiles.filter(file => file.name !== fileName) }));
  };

  return (
    <CollapsibleSection title="Supporting Documents">
      <div>
        <Label htmlFor="supporting-files">Upload Files</Label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
          <div className="text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-500" aria-hidden="true" />
            <div className="mt-4 flex text-sm leading-6 text-gray-400">
              <label htmlFor="supporting-files" className="relative cursor-pointer rounded-md bg-slate-800 font-semibold text-lime-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-lime-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 hover:text-lime-300">
                <span>Select files</span>
                <input id="supporting-files" ref={fileInputRef} name="supporting-files" type="file" className="sr-only" multiple onChange={handleFileChange} accept=".pdf,.docx,.csv" />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-400">PDF, DOCX, CSV up to 10MB each</p>
          </div>
        </div>
        {supportingFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-white">Selected files:</h4>
            <ul className="mt-2 space-y-2">
              {supportingFiles.map(file => (
                <li key={file.name} className="flex items-center justify-between rounded-md bg-white/5 p-2">
                  <span className="text-sm text-slate-300 truncate">{file.name}</span>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(file.name)} className="text-red-400 hover:bg-red-500/10 h-6 w-6">
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
};

export default SupportingDocsSection;