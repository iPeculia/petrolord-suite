import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileCheck2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { parse as papaparse } from 'papaparse';
import { read as readXlsx, utils as xlsxUtils } from 'xlsx';
import { parseLAS } from '@/utils/las-parser';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const FileProcessor = ({ file, onProcessed, onProcessingError }) => {
    React.useEffect(() => {
        const process = async () => {
            const extension = file.name.split('.').pop().toLowerCase();
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const content = e.target.result;
                    let parsedData;

                    if (extension === 'las') {
                        parsedData = parseLAS(content);
                        if (!parsedData.log_data || parsedData.log_data.length === 0) {
                            throw new Error("LAS file parsed, but no log data was found.");
                        }
                    } else if (extension === 'csv') {
                        const result = papaparse(content, { header: true, skipEmptyLines: true, dynamicTyping: true });
                        if (result.errors.length) {
                             throw new Error(`CSV Parsing Error: ${result.errors[0].message}`);
                        }
                        parsedData = { log_data: result.data, curves: result.meta.fields };
                    } else if (extension === 'xlsx') {
                        const workbook = readXlsx(content, { type: 'binary' });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];
                        const jsonData = xlsxUtils.sheet_to_json(worksheet);
                        parsedData = { log_data: jsonData, curves: Object.keys(jsonData[0] || {}) };
                    } else if (extension === 'json') {
                         const jsonData = JSON.parse(content);
                         if(!Array.isArray(jsonData) || jsonData.length === 0){
                            throw new Error("JSON must be an array of objects and not be empty.");
                         }
                         parsedData = { log_data: jsonData, curves: Object.keys(jsonData[0] || {}) };
                    } else {
                        throw new Error(`Unsupported file type: .${extension}`);
                    }
                    
                    if (!parsedData.log_data || parsedData.log_data.length === 0) {
                        throw new Error("No data points found in the file.");
                    }
                    
                    onProcessed(file.name, parsedData);
                } catch (error) {
                    console.error("File processing error:", error);
                    onProcessingError(error.message);
                }
            };
            
            reader.onerror = () => onProcessingError("Failed to read the file.");

            if (extension === 'xlsx') {
                reader.readAsBinaryString(file);
            } else {
                reader.readAsText(file);
            }
        };

        process();
    }, [file, onProcessed, onProcessingError]);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800/50 rounded-lg">
            <Loader2 className="w-8 h-8 animate-spin text-lime-400 mb-4" />
            <p className="font-semibold text-white">Processing File...</p>
            <p className="text-sm text-slate-400 truncate max-w-xs">{file.name}</p>
        </div>
    );
};


const Phase1InputSystem = ({ onComplete }) => {
    const { toast } = useToast();
    const [file, setFile] = useState(null);
    const [processingError, setProcessingError] = useState(null);
    const [processedData, setProcessedData] = useState(null);

    const handleFileSelect = useCallback((acceptedFiles) => {
        setFile(null);
        setProcessingError(null);
        setProcessedData(null);
        
        const selectedFile = acceptedFiles[0];
        if (!selectedFile) return;

        if (selectedFile.size > MAX_FILE_SIZE) {
            setProcessingError(`File is too large (${(selectedFile.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 100MB.`);
            return;
        }

        const allowedTypes = ['las', 'csv', 'xlsx', 'json'];
        const extension = selectedFile.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(extension)) {
             setProcessingError(`Unsupported file type. Please upload one of: .las, .csv, .xlsx, .json`);
             return;
        }

        setFile(selectedFile);
    }, []);

    const onProcessed = useCallback((fileName, data) => {
        setProcessedData({ fileName, data });
        toast({
            title: "File Loaded Successfully",
            description: `${fileName} processed with ${data.log_data.length} data points.`,
            className: "bg-emerald-800 border-emerald-700 text-white"
        });
        if(onComplete) {
            onComplete(data.log_data, fileName);
        }
    }, [toast, onComplete]);

    const onProcessingError = useCallback((errorMessage) => {
        setFile(null);
        setProcessingError(errorMessage);
        toast({
            title: "File Processing Failed",
            description: errorMessage,
            variant: "destructive"
        });
    }, [toast]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop: handleFileSelect,
        noClick: true,
        noKeyboard: true,
    });

    return (
        <div {...getRootProps()} className="w-full h-full p-8 flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl transition-all duration-300">
            <input {...getInputProps()} />

            <AnimatePresence mode="wait">
                {file && !processedData && !processingError && (
                    <motion.div key="processing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                        <FileProcessor file={file} onProcessed={onProcessed} onProcessingError={onProcessingError} />
                    </motion.div>
                )}

                {processingError && (
                     <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center justify-center text-center p-8 bg-red-900/20 border border-red-700 rounded-lg">
                        <AlertTriangle className="w-8 h-8 text-red-400 mb-4" />
                        <p className="font-semibold text-white">Upload Failed</p>
                        <p className="text-sm text-slate-300 max-w-md mt-1">{processingError}</p>
                         <Button onClick={() => setProcessingError(null)} className="mt-6">Try Again</Button>
                    </motion.div>
                )}
                
                {processedData && (
                     <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center justify-center text-center p-8 bg-emerald-900/20 border border-emerald-700 rounded-lg">
                        <FileCheck2 className="w-10 h-10 text-emerald-400 mb-4" />
                        <p className="font-semibold text-white text-lg">File Loaded Successfully</p>
                        <p className="text-sm text-slate-300 mt-1">{processedData.fileName}</p>
                        <div className="mt-4 text-xs text-slate-400 bg-slate-800/50 py-2 px-4 rounded-md">
                            <span className="font-bold text-lime-400">{processedData.data.log_data.length}</span> data points with <span className="font-bold text-lime-400">{processedData.data.curves.length}</span> curves detected.
                        </div>
                    </motion.div>
                )}

                {!file && !processedData && !processingError && (
                    <motion.div key="initial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center">
                        <div className={`p-4 rounded-full transition-all duration-300 ${isDragActive ? 'bg-lime-500/20 scale-110' : 'bg-slate-800'}`}>
                           <UploadCloud className={`w-12 h-12 transition-colors duration-300 ${isDragActive ? 'text-lime-300' : 'text-slate-500'}`} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mt-6">Drag & Drop Log File</h2>
                        <p className="text-slate-400 mt-2 max-w-md">Supports LAS 2.0, CSV, Excel (.xlsx), and JSON. Optimized for large datasets (up to 100MB).</p>
                        <Button onClick={open} className="mt-6">Browse Files</Button>
                    </motion.div>
                )}

            </AnimatePresence>

        </div>
    );
};

export default Phase1InputSystem;