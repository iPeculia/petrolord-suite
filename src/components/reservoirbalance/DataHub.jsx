import React, { useCallback, useState, useEffect } from 'react';
    import { useDropzone } from 'react-dropzone';
    import Papa from 'papaparse';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Upload, CheckCircle, AlertTriangle, Table, Download, Trash2 } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { Table as UiTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { ScrollArea } from '@/components/ui/scroll-area';

    const DataHub = ({ productionData, setProductionData, pressureData, setPressureData, pvtData, setPvtData }) => {
      
      const handlePvtTableUpload = (newPvtTable) => {
        setPvtData(prev => ({ ...(prev || {}), pvtTable: newPvtTable }));
      };
      
      return (
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lime-300">Data Hub</CardTitle>
              <CardDescription>Upload, map, and perform quality control on your reservoir data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DataUploadCard title="Production History" data={productionData} setData={setProductionData} fileName="production_history.csv" />
                <DataUploadCard title="Pressure Data" data={pressureData} setData={setPressureData} fileName="pressure_data.csv" />
                <DataUploadCard title="PVT Table Data" data={pvtData?.pvtTable} setData={handlePvtTableUpload} fileName="pvt_data.csv" />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    };

    const DataUploadCard = ({ title, data, setData, fileName }) => {
        const { toast } = useToast();
        const [headers, setHeaders] = useState([]);
        const [previewData, setPreviewData] = useState([]);
    
        const onDrop = useCallback((acceptedFiles) => {
            if (acceptedFiles.length === 0) {
                return;
            }
            const file = acceptedFiles[0];
    
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        toast({ title: 'Error parsing file', description: results.errors[0].message, variant: 'destructive' });
                        return;
                    }
                    setData(results.data);
                    toast({ title: 'Success', description: `${file.name} uploaded and parsed.` });
                },
                error: (error) => {
                    toast({ title: 'Error parsing file', description: error.message, variant: 'destructive' });
                }
            });
        }, [toast, setData]);
    
        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop,
            accept: { 'text/csv': ['.csv'] },
            maxFiles: 1,
        });

        const clearData = () => {
            setData(null);
        }

        const downloadData = () => {
            if (!data) return;
            const csv = Papa.unparse(data);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        useEffect(() => {
            if (data && data.length > 0) {
                setHeaders(Object.keys(data[0]));
                setPreviewData(data.slice(0, 5));
            } else {
                setHeaders([]);
                setPreviewData([]);
            }
        }, [data]);
    
        return (
            <Card className="bg-slate-900/70 border-slate-600 flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg text-white">{title}</CardTitle>
                    {data && data.length > 0 ? <CheckCircle className="w-6 h-6 text-green-500" /> : <AlertTriangle className="w-6 h-6 text-yellow-500" />}
                </CardHeader>
                <CardContent className="flex-grow flex flex-col items-center justify-center space-y-4 p-6">
                    {!(data && data.length > 0) ? (
                        <div {...getRootProps()} className={`w-full p-8 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center text-center transition-colors ${isDragActive ? 'border-lime-400 bg-lime-900/20' : 'border-slate-600 hover:border-slate-500'}`}>
                            <input {...getInputProps()} />
                            <Upload className="w-8 h-8 text-lime-400 mb-2" />
                            {isDragActive ?
                                <p className="text-lime-300">Drop the file here ...</p> :
                                <p className="text-slate-400 text-sm">Drag 'n' drop a CSV file here, or click to select</p>
                            }
                        </div>
                    ) : (
                        <div className="w-full">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <Table className="w-5 h-5 text-lime-400" />
                                    <span className="text-white font-semibold">Data Preview</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button onClick={downloadData} variant="outline" size="sm"><Download className="w-3 h-3 mr-1" /> CSV</Button>
                                    <Button onClick={clearData} variant="destructive" size="sm"><Trash2 className="w-3 h-3" /></Button>
                                </div>
                            </div>
                            <ScrollArea className="h-48 w-full bg-slate-950/50 rounded-md border border-slate-700">
                                <UiTable>
                                    <TableHeader>
                                        <TableRow>
                                            {headers.map(h => <TableHead key={h} className="text-lime-300">{h}</TableHead>)}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {previewData.map((row, i) => (
                                            <TableRow key={i}>
                                                {headers.map(h => <TableCell key={h}>{String(row[h])}</TableCell>)}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </UiTable>
                            </ScrollArea>
                            <p className="text-xs text-slate-500 mt-1 text-center">Showing first 5 of {data.length} rows.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    export default DataHub;