import React, { useState, useEffect, useCallback } from 'react';
    import { Helmet } from 'react-helmet';
    import { useParams, Link, useNavigate } from 'react-router-dom';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
    import { ArrowLeft, Upload, FileText, BarChart, Play, Plus, Loader2, Trash2, FileSpreadsheet, FileJson, Contrast as Compare } from 'lucide-react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { useDropzone } from 'react-dropzone';
    import Papa from 'papaparse';

    const DataFileCard = ({ file, onProcess, onDelete, processing }) => {
      const getFileIcon = () => {
        if (file.file_name.endsWith('.csv')) return <FileSpreadsheet className="w-10 h-10 text-green-400" />;
        if (file.file_name.endsWith('.json')) return <FileJson className="w-10 h-10 text-yellow-400" />;
        return <FileText className="w-10 h-10 text-slate-400" />;
      };

      return (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getFileIcon()}
              <div>
                <p className="font-semibold text-white truncate w-48">{file.file_name}</p>
                <p className="text-xs text-slate-400">Uploaded: {new Date(file.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => onProcess(file)} disabled={processing}>
                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Process
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(file.id)} disabled={processing}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    };

    const DataUploader = ({ caseId, onUploadSuccess, dataType, acceptedTypes }) => {
      const { toast } = useToast();
      const { user } = useAuth();
      const [isUploading, setIsUploading] = useState(false);

      const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsUploading(true);
        try {
          const fileExt = file.name.split('.').pop();
          const filePath = `${user.id}/${caseId}/${dataType}-${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('epe-uploads')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: dbRecord, error: dbError } = await supabase
            .from(`epe_${dataType}`)
            .insert({
              case_id: caseId,
              user_id: user.id,
              file_name: file.name,
              data: { storagePath: filePath } // Store path, process later
            })
            .select()
            .single();
          
          if (dbError) throw dbError;

          toast({ title: 'Upload successful', description: `${file.name} has been uploaded.` });
          onUploadSuccess(dbRecord);

        } catch (error) {
          toast({ variant: 'destructive', title: 'Upload failed', description: error.message });
        } finally {
          setIsUploading(false);
        }
      }, [caseId, user, dataType, onUploadSuccess, toast]);

      const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: acceptedTypes,
      });

      return (
        <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-cyan-400 bg-slate-800' : 'border-slate-600 hover:border-cyan-500'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-center text-slate-400">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 mb-4 animate-spin" />
                <p className="text-lg font-semibold text-white">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 mb-4" />
                <p className="text-lg font-semibold text-white">Drag 'n' drop file here, or click to select</p>
                <p className="text-sm mt-1">Accepted formats: {Object.values(acceptedTypes).flat().join(', ')}</p>
              </>
            )}
          </div>
        </div>
      );
    };

    const EpeCaseDetail = () => {
      const { caseId } = useParams();
      const navigate = useNavigate();
      const { toast } = useToast();
      const { user } = useAuth();
      const [caseDetails, setCaseDetails] = useState(null);
      const [productionVolumes, setProductionVolumes] = useState([]);
      const [capex, setCapex] = useState([]);
      const [opex, setOpex] = useState([]);
      const [runs, setRuns] = useState([]);
      const [loading, setLoading] = useState(true);
      const [processingFileId, setProcessingFileId] = useState(null);

      const fetchData = useCallback(async () => {
        if (!user || !caseId) return;
        setLoading(true);
        try {
          const [caseRes, prodRes, capexRes, opexRes, runsRes] = await Promise.all([
            supabase.from('epe_cases').select('*').eq('id', caseId).single(),
            supabase.from('epe_production_volumes').select('*').eq('case_id', caseId),
            supabase.from('epe_capex').select('*').eq('case_id', caseId),
            supabase.from('epe_opex').select('*').eq('case_id', caseId),
            supabase.from('epe_runs').select('*').eq('case_id', caseId).order('created_at', { ascending: false }),
          ]);

          if (caseRes.error) throw caseRes.error;
          setCaseDetails(caseRes.data);

          if (prodRes.error) throw prodRes.error;
          setProductionVolumes(prodRes.data);

          if (capexRes.error) throw capexRes.error;
          setCapex(capexRes.data);

          if (opexRes.error) throw opexRes.error;
          setOpex(opexRes.data);

          if (runsRes.error) throw runsRes.error;
          setRuns(runsRes.data);

        } catch (error) {
          toast({ variant: 'destructive', title: 'Failed to fetch case details', description: error.message });
          navigate('/dashboard/economic-project-management/epe/cases');
        } finally {
          setLoading(false);
        }
      }, [caseId, user, toast, navigate]);

      useEffect(() => {
        fetchData();
      }, [fetchData]);

      const handleProcessFile = async (file) => {
        setProcessingFileId(file.id);
        try {
          const { data: fileData, error: downloadError } = await supabase.storage
            .from('epe-uploads')
            .download(file.data.storagePath);
          
          if (downloadError) throw downloadError;

          const text = await fileData.text();
          const parsedData = Papa.parse(text, { header: true, dynamicTyping: true, skipEmptyLines: true });

          // Here you would typically do more validation and processing
          // For now, we just update the record to show it's "processed"
          // by replacing the storage path with the actual data.
          const { error: updateError } = await supabase
            .from(`epe_${file.file_name.includes('prod') ? 'production_volumes' : file.file_name.includes('capex') ? 'capex' : 'opex'}`)
            .update({ data: parsedData.data })
            .eq('id', file.id);

          if (updateError) throw updateError;

          toast({ title: 'Processing Complete', description: `${file.file_name} has been processed.` });
          fetchData(); // Refresh data
        } catch (error) {
          toast({ variant: 'destructive', title: 'Processing failed', description: error.message });
        } finally {
          setProcessingFileId(null);
        }
      };

      const handleDeleteFile = async (fileId, table) => {
        try {
          const { error } = await supabase.from(table).delete().eq('id', fileId);
          if (error) throw error;
          toast({ title: 'File deleted' });
          fetchData();
        } catch (error) {
          toast({ variant: 'destructive', title: 'Failed to delete file', description: error.message });
        }
      };

      if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-16 h-16 animate-spin text-cyan-400" /></div>;
      }

      return (
        <>
          <Helmet>
            <title>{caseDetails?.case_name || 'Case Detail'} - EPE</title>
          </Helmet>
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Link to="/dashboard/economic-project-management/epe/cases">
                  <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to Cases</Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-white">{caseDetails?.case_name}</h1>
                  <p className="text-slate-400">{caseDetails?.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/dashboard/economic-project-management/epe/cases/${caseId}/compare`}>
                  <Button variant="outline"><Compare className="w-4 h-4 mr-2" />Compare Runs</Button>
                </Link>
                <Link to={`/dashboard/economic-project-management/epe/console/${caseId}`}>
                  <Button><Play className="w-4 h-4 mr-2" />New Run</Button>
                </Link>
              </div>
            </div>

            <Tabs defaultValue="data" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="data">Data Management</TabsTrigger>
                <TabsTrigger value="runs">Run History</TabsTrigger>
              </TabsList>
              <TabsContent value="data">
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle>Production Volumes</CardTitle>
                      <CardDescription>Upload production forecast files.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {productionVolumes.map(f => <DataFileCard key={f.id} file={f} onProcess={handleProcessFile} onDelete={() => handleDeleteFile(f.id, 'epe_production_volumes')} processing={processingFileId === f.id} />)}
                      <DataUploader caseId={caseId} onUploadSuccess={fetchData} dataType="production_volumes" acceptedTypes={{'text/csv': ['.csv']}} />
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle>CAPEX</CardTitle>
                      <CardDescription>Upload capital expenditure files.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {capex.map(f => <DataFileCard key={f.id} file={f} onProcess={handleProcessFile} onDelete={() => handleDeleteFile(f.id, 'epe_capex')} processing={processingFileId === f.id} />)}
                      <DataUploader caseId={caseId} onUploadSuccess={fetchData} dataType="capex" acceptedTypes={{'text/csv': ['.csv']}} />
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle>OPEX</CardTitle>
                      <CardDescription>Upload operational expenditure files.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {opex.map(f => <DataFileCard key={f.id} file={f} onProcess={handleProcessFile} onDelete={() => handleDeleteFile(f.id, 'epe_opex')} processing={processingFileId === f.id} />)}
                      <DataUploader caseId={caseId} onUploadSuccess={fetchData} dataType="opex" acceptedTypes={{'text/csv': ['.csv']}} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="runs">
                <Card className="bg-slate-800/50 border-slate-700 mt-6">
                  <CardHeader>
                    <CardTitle>Completed Runs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {runs.length > 0 ? (
                      <ul className="space-y-3">
                        {runs.map(run => (
                          <li key={run.id} className="p-3 bg-slate-800 rounded-md flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-cyan-400">{run.run_name}</p>
                              <p className="text-xs text-slate-400">Run on: {new Date(run.created_at).toLocaleString()}</p>
                            </div>
                            <Link to={`/dashboard/economic-project-management/epe/cases/${caseId}/runs/${run.id}`}>
                              <Button variant="secondary">View Results</Button>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-12">
                        <BarChart className="mx-auto h-12 w-12 text-slate-500" />
                        <h3 className="mt-2 text-lg font-medium text-white">No runs yet</h3>
                        <p className="mt-1 text-sm text-slate-400">Create a new run to see results here.</p>
                        <Link to={`/dashboard/economic-project-management/epe/console/${caseId}`} className="mt-4 inline-block">
                          <Button><Plus className="mr-2 h-4 w-4" />Start a New Run</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </>
      );
    };

    export default EpeCaseDetail;