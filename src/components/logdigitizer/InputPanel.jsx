import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

const InputPanel = ({ onFileDrop, fileName }) => {
  const onDrop = React.useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileDrop(acceptedFiles[0]);
    }
  }, [onFileDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.gif'] },
    multiple: false
  });

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-lime-400 bg-lime-900/50' : 'border-gray-600 hover:border-gray-500'}`}
      >
        <input {...getInputProps()} id="file-input" />
        <Upload className="w-10 h-10 text-gray-400 mb-2" />
        <p className="text-center text-sm text-gray-400">
          {isDragActive ? 'Drop the image here ...' : 'Drag & drop an image, or click to select'}
        </p>
        {fileName && <p className="text-xs text-lime-300 mt-2 truncate max-w-full">{fileName}</p>}
      </div>
    </div>
  );
};

export default InputPanel;