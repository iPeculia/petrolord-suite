import React from 'react';
    import { useDropzone } from 'react-dropzone';
    import { motion } from 'framer-motion';
    import { UploadCloud, Loader2 } from 'lucide-react';

    const EmptyState = ({ onFileUpload, isLoading }) => {
      const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          onFileUpload(acceptedFiles[0]);
        }
      };

      const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/octet-stream': ['.sgy', '.segy'] },
        multiple: false,
        disabled: isLoading,
      });

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full flex items-center justify-center"
        >
          <div
            {...getRootProps()}
            className={`w-3/4 max-w-2xl p-12 border-4 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-amber-400 bg-amber-900/30 scale-105'
                : 'border-gray-600 hover:border-amber-500 hover:bg-gray-800/20'
            }`}
          >
            <input {...getInputProps()} />
            {isLoading ? (
              <>
                <Loader2 className="mx-auto h-16 w-16 text-amber-400 animate-spin mb-4" />
                <h2 className="text-2xl font-bold text-white">Processing...</h2>
                <p className="text-gray-400 mt-2">Please wait while the seismic data is being processed.</p>
              </>
            ) : (
              <>
                <UploadCloud className="mx-auto h-16 w-16 text-gray-500 mb-4" />
                <h2 className="text-2xl font-bold text-white">Upload Seismic Data</h2>
                <p className="text-gray-400 mt-2">
                  Drag and drop a SEG-Y file here, or click to select a file to begin your interpretation session.
                </p>
              </>
            )}
          </div>
        </motion.div>
      );
    };

    export default EmptyState;