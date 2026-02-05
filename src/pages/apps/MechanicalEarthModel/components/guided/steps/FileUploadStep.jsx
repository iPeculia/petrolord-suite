import React, { useCallback, useEffect } from 'react';
import { useGuidedMode } from '../../../contexts/GuidedModeContext';
import { useToast } from '@/components/ui/use-toast';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { parseLas } from '@/utils/las-parser';

const FileUploadStep = () => {
    const { state, dispatch } = useGuidedMode();
    const { toast } = useToast();

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            dispatch({ type: 'SET_UPLOADED_FILE', payload: file });
            dispatch({ type: 'SET_VALIDATION', payload: { step: 1, isValid: false } }); // Invalidate on new upload until parse succeeds
            toast({
                title: "File Selected",
                description: `${file.name} is ready for processing.`,
            });

            try {
                const fileContent = await file.text();
                const lasData = await parseLas(fileContent);
                dispatch({ type: 'SET_LAS_DATA', payload: lasData });
                dispatch({ type: 'SET_VALIDATION', payload: { step: 1, isValid: true } });
                toast({
                    title: "LAS File Processed",
                    description: "Well log data has been successfully parsed.",
                    className: "bg-green-500 text-white"
                });
            } catch (error) {
                console.error("Error parsing LAS file:", error);
                dispatch({ type: 'SET_LAS_DATA', payload: null });
                dispatch({ type: 'SET_VALIDATION', payload: { step: 1, isValid: false } });
                toast({
                    title: "Error Parsing File",
                    description: error.message || "Could not process the LAS file. Please check the file format.",
                    variant: "destructive",
                });
            }
        }
    }, [dispatch, toast]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/octet-stream': ['.las', 'text/plain'] },
        maxFiles: 1,
    });

    const removeFile = () => {
        dispatch({ type: 'SET_UPLOADED_FILE', payload: { name: '' } });
        dispatch({ type: 'SET_LAS_DATA', payload: null });
        dispatch({ type: 'SET_VALIDATION', payload: { step: 1, isValid: false } });
    };

    useEffect(() => {
        const isValid = !!(state.uploadedFile?.name && state.lasData);
        if (state.validation[1] !== isValid) {
          dispatch({ type: 'SET_VALIDATION', payload: { step: 1, isValid } });
        }
    }, [state.uploadedFile, state.lasData, state.validation, dispatch]);

    const handlePrevious = () => {
        dispatch({ type: 'PREVIOUS_STEP' });
    };
    
    const handleNext = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full"
        >
            <div className="flex-grow">
                <Card className="max-w-3xl mx-auto bg-slate-800/50 border-slate-700">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Upload Well Log Data</CardTitle>
                        <CardDescription>
                            Upload a LAS file containing the necessary well log curves for the analysis.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div
                            {...getRootProps()}
                            className={`p-12 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                                isDragActive ? 'border-lime-400 bg-slate-700/50' : 'border-slate-600 hover:border-lime-400'
                            }`}
                        >
                            <input {...getInputProps()} />
                            <UploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                            {isDragActive ? (
                                <p className="text-lg font-semibold text-lime-400">Drop the file here...</p>
                            ) : (
                                <p className="text-lg">Drag & drop a LAS file here, or click to select file</p>
                            )}
                            <p className="text-sm text-slate-500 mt-2">Only .las files are supported</p>
                        </div>

                        {state.uploadedFile?.name && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="p-4 bg-slate-900 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <FileIcon className="h-6 w-6 text-lime-400 flex-shrink-0" />
                                        <span className="font-medium truncate" title={state.uploadedFile?.name}>{state.uploadedFile?.name}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={removeFile}>
                                        <X className="h-5 w-5 text-red-500" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-700 flex justify-between items-center">
                <Button variant="outline" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>
                <Button onClick={handleNext} disabled={!state.validation[1]}>
                    Next Step
                    <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </motion.div>
    );
};

export default FileUploadStep;