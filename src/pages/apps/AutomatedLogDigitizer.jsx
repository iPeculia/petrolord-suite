import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import useLogDigitizer from '@/hooks/useLogDigitizer';
import ControlPanel from '@/components/logdigitizer/ControlPanel';
import CalibrationPanel from '@/components/logdigitizer/CalibrationPanel';
import ImageViewer from '@/components/logdigitizer/ImageViewer';
import { ArrowLeft, Rocket } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AutomatedLogDigitizer = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    state,
    setState,
    imgCanvasRef,
    ovrCanvasRef,
    zoomCanvasRef,
    handleFileUpload,
    handleSavePoints,
    handleDeleteCurve,
    handleExport,
    isProcessing,
    handleAutoDigitize,
  } = useLogDigitizer(toast);

  const {
    fileName,
    imageUrl,
    calibration,
    currentTrack,
    simplifyEpsilon,
    curves,
    status,
    points,
    pickingFor,
    manualMode,
  } = state;

  const setCalibration = (newCal) => setState(prev => ({ ...prev, calibration: newCal }));
  const setCurrentTrack = (newTrack) => setState(prev => ({ ...prev, currentTrack: newTrack }));
  const setSimplifyEpsilon = (newEpsilon) => setState(prev => ({ ...prev, simplifyEpsilon: newEpsilon }));
  const setPoints = (newPoints) => setState(prev => ({ ...prev, points: newPoints }));
  const setManualMode = (mode) => setState(prev => ({ ...prev, manualMode: mode }));

  const handlePick = (field) => {
    setState(prev => ({
      ...prev,
      pickingFor: field,
      status: `Calibration Mode: Click on the image to set ${field.replace(/_/g, ' ')}.`
    }));
  };

  const handleOpenInPetrophysics = async () => {
    toast({ title: 'Exporting for Petrophysics...' });
    const downloadResult = await handleExport('csv');
    if (downloadResult && downloadResult.blob) {
      const file = new File([downloadResult.blob], downloadResult.filename, { type: 'text/csv' });
      navigate('/dashboard/geoscience/petrophysics-estimator', { state: { autoLoadFile: file } });
    } else {
      toast({ title: 'Export Failed', description: 'Could not prepare file for Petrophysics.', variant: 'destructive' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Automated Log Digitizer - Petrolord</title>
        <meta name="description" content="A powerful tool to digitize well logs from scanned images automatically." />
      </Helmet>
      <div className="p-4 sm:p-6 bg-gray-900 text-white min-h-screen">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-between items-center mb-6">
            <Link to="/dashboard/geoscience">
              <Button variant="outline" size="sm" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20">
                <ArrowLeft className="w-4 h-4 mr-2" />Back to Geoscience
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={handleOpenInPetrophysics} disabled={!curves || curves.length === 0}>
                <Rocket className="w-4 h-4 mr-2" />Open in Petrophysics
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full lg:w-[400px] flex-shrink-0 space-y-4"
          >
            <ControlPanel
              fileName={fileName}
              onFileDrop={handleFileUpload}
              simplifyEpsilon={simplifyEpsilon}
              setSimplifyEpsilon={setSimplifyEpsilon}
              currentTrack={currentTrack}
              setCurrentTrack={setCurrentTrack}
              onSave={handleSavePoints}
              onClear={() => setPoints([])}
              curves={curves}
              onDeleteCurve={handleDeleteCurve}
              onExport={handleExport}
              isProcessing={isProcessing}
              calibration={calibration}
              onAutoDigitize={handleAutoDigitize}
              manualMode={manualMode}
              setManualMode={setManualMode}
            />
            <CalibrationPanel
              calibration={calibration}
              setCalibration={setCalibration}
              disabled={!imageUrl}
              pickingFor={pickingFor}
              onPick={handlePick}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 space-y-4"
          >
            <ImageViewer
              status={status}
              imgCanvasRef={imgCanvasRef}
              ovrCanvasRef={ovrCanvasRef}
              zoomCanvasRef={zoomCanvasRef}
              imageUrl={imageUrl}
              points={points}
              setPoints={setPoints}
              calibration={calibration}
              setState={setState}
              state={state}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AutomatedLogDigitizer;