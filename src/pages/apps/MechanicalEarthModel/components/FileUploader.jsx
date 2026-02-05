import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, FileCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/components/ui/use-toast';
import { useFileParser } from '../hooks/useFileParser';
import { Progress } from '@/components/ui/progress';

const FileUploader = ({ onFileParsed }) => {
    const { toast } = useToast();
    const { parseFile, parsingState } = useFileParser();
    const [fileName, setFileName] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setFileName(file.name);
            try {
                const parsedData = await parseFile(file);
                onFileParsed(parsedData);
                toast({
                    title: "File Parsed Successfully",
                    description: `${parsedData.curves.length} curves found in ${file.name}.`,
                });
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: "File Parsing Failed",
                    description: error.message,
                });
            }
        }
    }, [parseFile, onFileParsed, toast]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/plain': ['.las'],
            'text/csv': ['.csv'],
        },
        maxFiles: 1,
    });

    const renderContent = () => {
        switch (parsingState.status) {
            case 'parsing':
                return (
                    <div className="text-center">
                        <RefreshCw className="mx-auto h-10 w-10 text-blue-400 animate-spin mb-2"/>
                        <p className="text-sm text-slate-300 mb-2">Parsing {fileName}...</p>
                        <Progress value={parsingState.progress} className="w-full" />
                    </div>
                );
            case 'success':
                 return (
                    <div className="text-center">
                        <FileCheck className="mx-auto h-10 w-10 text-green-500 mb-2"/>
                        <p className="text-sm text-slate-300">
                           {fileName} parsed successfully.
                        </p>
                        <p className="text-xs text-slate-500">Drop another file to replace.</p>
                    </div>
                );
            case 'error':
                 return (
                    <div className="text-center">
                        <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-2"/>
                        <p className="text-sm text-red-400">
                           Error parsing {fileName}.
                        </p>
                        <p className="text-xs text-slate-500">Please check the file and try again.</p>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <div className="text-center">
                        <UploadCloud className="mx-auto h-10 w-10 text-slate-500 mb-2"/>
                        <p className="text-sm text-slate-400">
                            {isDragActive ? "Drop the files here..." : "Drag & drop LAS file here, or click to select"}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">LAS or CSV supported</p>
                    </div>
                );
        }
    }

    return (
        <Card className={`bg-slate-800 border-dashed border-slate-600 hover:border-blue-500 cursor-pointer transition-all ${isDragActive ? 'border-blue-500 bg-slate-700' : ''}`}>
             <CardHeader className="pb-2">
                <CardTitle className="text-base text-white">Upload Well Data</CardTitle>
                <CardDescription className="text-xs text-slate-400">Upload well logs in LAS format.</CardDescription>
            </CardHeader>
            <CardContent {...getRootProps()} className="py-8">
                <input {...getInputProps()} />
                {renderContent()}
            </CardContent>
        </Card>
    );
};

export default FileUploader;