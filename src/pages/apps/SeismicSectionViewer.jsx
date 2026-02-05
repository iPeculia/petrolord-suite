import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import InputPanel from '@/components/seismicviewer/InputPanel';
import ViewerPanel from '@/components/seismicviewer/ViewerPanel';
import EmptyState from '@/components/seismicviewer/EmptyState';
import { parseSegy } from '@/utils/segy-parser';

// Placeholder for API_URL. In a real scenario, this would likely be an Edge Function endpoint.
// For in-browser parsing, we don't strictly need a backend API for rendering after file upload.
// This API_URL is left here in case a hybrid approach or actual backend persistence/rendering is added later.
const API_URL = '/seis'; 

const SeismicSectionViewer = () => {
  const { toast } = useToast();
  const [session, setSession] = useState(null); // Stores file metadata and computed ranges
  const [viewerParams, setViewerParams] = useState({
    sliceType: 'inline',
    index: 0,
    pclip: 98,
    gain: 1.0,
    polarity: 'normal',
  });
  const [pickSets, setPickSets] = useState([]);
  const [overlaySelected, setOverlaySelected] = useState([]);
  const [renderedImage, setRenderedImage] = useState(null); // Stores base64 image and dimensions
  const [isLoading, setIsLoading] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [activePickSet, setActivePickSet] = useState(null);
  const [currentPicks, setCurrentPicks] = useState([]); // Picks for the active pick set on the current slice
  const fileRef = useRef(null); // To hold the uploaded file reference

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    fileRef.current = file; // Store file reference

    try {
      // Step 1: Scan headers for basic info and ranges (fast operation)
      const headerScanResult = await parseSegy(file, 'headerScan'); // Use a special sliceType for header scan

      if (headerScanResult.error) {
        throw new Error(headerScanResult.error);
      }

      const { is3D, ilRange, xlRange, samplesPerTrace, dt_ms, t0_ms } = headerScanResult;

      // Update session state with parsed header info
      const newSession = {
        kind: is3D ? '3D' : '2D',
        il_range: ilRange,
        xl_range: xlRange,
        samples_per_trace: samplesPerTrace,
        dt_ms: dt_ms,
        t0_ms: t0_ms,
        session_id: 'local-' + file.name, // A local identifier for the session
      };
      setSession(newSession);

      const initialViewerParams = { ...viewerParams };
      if (newSession.kind === '2D') {
        initialViewerParams.sliceType = 'line2d';
        initialViewerParams.index = 0; // For 2D, index is irrelevant, we'll just show all traces
      } else {
        initialViewerParams.sliceType = 'inline';
        initialViewerParams.index = Math.floor((newSession.il_range[0] + newSession.il_range[1]) / 2);
      }
      setViewerParams(initialViewerParams);
      setRenderedImage(null);
      setPickSets([]);
      setOverlaySelected([]);

      toast({ title: 'Success', description: 'SEG-Y file loaded and headers parsed!' });

      // Step 2: Immediately render the initial slice
      await handleRenderSlice(file, newSession, initialViewerParams, []);

    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenderSlice = async (file, currentSession, currentViewerParams, overlays) => {
    if (!file || !currentSession) return;
    setIsLoading(true);
    setRenderedImage(null); // Clear previous image while loading new
    try {
      // Step 3: Parse the specific slice data in-browser
      const sliceData = await parseSegy(
        file,
        currentViewerParams.sliceType,
        currentViewerParams.index
      );

      if (sliceData.error) {
        throw new Error(sliceData.error);
      }
      
      const { traces, stats, samplesPerTrace } = sliceData;

      if (traces.length === 0) {
        setRenderedImage(null);
        toast({ title: 'Info', description: 'No traces found for the selected slice. Try adjusting the index.' });
        return;
      }

      // Render traces to an image (canvas)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const traceWidth = 1; // Pixels per trace
      const sampleHeight = 1; // Pixels per sample
      const displayWidth = traces.length * traceWidth;
      const displayHeight = samplesPerTrace * sampleHeight;

      canvas.width = displayWidth;
      canvas.height = displayHeight;

      const imageData = ctx.createImageData(displayWidth, displayHeight);
      const data = imageData.data;

      // Apply gain, pclip, and polarity
      const pclipMin = stats.min + (stats.max - stats.min) * (100 - currentViewerParams.pclip) / 200;
      const pclipMax = stats.max - (stats.max - stats.min) * (100 - currentViewerParams.pclip) / 200;

      for (let i = 0; i < traces.length; i++) {
        const trace = traces[i];
        for (let j = 0; j < samplesPerTrace; j++) {
          let value = trace[j];

          // Apply gain
          value *= currentViewerParams.gain;

          // Apply pclip
          value = Math.max(pclipMin, Math.min(pclipMax, value));

          // Normalize to 0-1 range
          let normalizedValue = (value - pclipMin) / (pclipMax - pclipMin);
          normalizedValue = isNaN(normalizedValue) ? 0.5 : normalizedValue; // Handle division by zero if min/max are same

          // Map to grayscale 0-255
          let color = Math.floor(normalizedValue * 255);

          // Apply polarity
          if (currentViewerParams.polarity === 'reverse') {
            color = 255 - color;
          }

          const pixelIndex = (j * displayWidth + i) * 4;
          data[pixelIndex] = color;     // Red
          data[pixelIndex + 1] = color; // Green
          data[pixelIndex + 2] = color; // Blue
          data[pixelIndex + 3] = 255;   // Alpha
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const imageUrl = canvas.toDataURL('image/png');

      setRenderedImage({
        url: imageUrl,
        trace_count: traces.length,
        sample_count: samplesPerTrace,
        min: stats.min,
        max: stats.max,
      });

    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: `Rendering failed: ${error.message}` });
      setRenderedImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to trigger rendering when params change
  useEffect(() => {
    if (fileRef.current && session) {
      handleRenderSlice(fileRef.current, session, viewerParams, overlaySelected);
    }
  }, [viewerParams.index, viewerParams.pclip, viewerParams.gain, viewerParams.polarity, viewerParams.sliceType, overlaySelected, session]);


  const handleCreatePickSet = async (name, kind) => {
    toast({ title: 'Feature Not Implemented', description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
    /*
    if (!session) return;
    setIsLoading(true);
    try {
      // Simulate API call for pickset creation
      const newSet = {
        set_id: `ps-${pickSets.length + 1}`,
        name,
        kind,
        slice_type: viewerParams.sliceType,
        index: viewerParams.index,
        points: [],
      };
      setPickSets(prev => [...prev, newSet]);
      setOverlaySelected(prev => [...prev, newSet.set_id]);
      setActivePickSet(newSet);
      setIsPicking(true);
      toast({ title: 'Success', description: `Pick set "${name}" created. You can now start picking.` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsLoading(false);
    }
    */
  };

  const handleAddPick = (pick) => {
    toast({ title: 'Feature Not Implemented', description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
    // setCurrentPicks(prev => [...prev, pick]);
  };

  const handleSavePicks = async () => {
    toast({ title: 'Feature Not Implemented', description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
    /*
    if (!session || !activePickSet || currentPicks.length === 0) return;
    setIsLoading(true);
    try {
      // Simulate saving picks
      const updatedPickSets = pickSets.map(ps =>
        ps.set_id === activePickSet.set_id
          ? { ...ps, points: [...ps.points, ...currentPicks] }
          : ps
      );
      setPickSets(updatedPickSets);
      setCurrentPicks([]);
      setIsPicking(false);
      setActivePickSet(null);
      toast({ title: 'Success', description: 'Picks saved successfully.' });
      handleRenderSlice(fileRef.current, session, viewerParams, overlaySelected);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save picks.' });
    } finally {
      setIsLoading(false);
    }
    */
  };

  const handleDeletePickSet = async (setId) => {
    toast({ title: 'Feature Not Implemented', description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
    /*
    if (!session) return;
    setIsLoading(true);
    try {
      setPickSets(prev => prev.filter(ps => ps.set_id !== setId));
      setOverlaySelected(prev => prev.filter(id => id !== setId));
      toast({ title: 'Success', description: 'Pick set deleted.' });
      handleRenderSlice(fileRef.current, session, viewerParams, overlaySelected.filter(id => id !== setId));
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete pick set.' });
    } finally {
      setIsLoading(false);
    }
    */
  };

  const handleExportPicks = async () => {
    toast({ title: 'Feature Not Implemented', description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  };

  const onRender = useCallback(() => {
    if (fileRef.current && session) {
      handleRenderSlice(fileRef.current, session, viewerParams, overlaySelected);
    }
  }, [fileRef.current, session, viewerParams, overlaySelected]);

  return (
    <>
      <Helmet>
        <title>Seismic Section Viewer & Interpreter</title>
        <meta name="description" content="Upload, view, and interpret 2D/3D seismic data in your browser." />
      </Helmet>
      <div className="flex h-full bg-gray-900 text-white">
        <motion.div
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="w-[350px] bg-gray-800/50 p-4 overflow-y-auto flex-shrink-0"
        >
          <InputPanel
            session={session}
            viewerParams={viewerParams}
            setViewerParams={setViewerParams}
            pickSets={pickSets}
            overlaySelected={overlaySelected}
            setOverlaySelected={setOverlaySelected}
            onFileUpload={handleFileUpload}
            onRender={onRender}
            onCreatePickSet={handleCreatePickSet}
            onDeletePickSet={handleDeletePickSet}
            onExportPicks={handleExportPicks}
            isLoading={isLoading}
            isPicking={isPicking}
            onSavePicks={handleSavePicks}
          />
        </motion.div>
        <main className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-900">
          {session ? (
            <ViewerPanel
              renderedImage={renderedImage}
              isLoading={isLoading}
              isPicking={isPicking}
              onAddPick={handleAddPick}
              currentPicks={currentPicks}
              session={session}
            />
          ) : (
            <EmptyState onFileUpload={handleFileUpload} isLoading={isLoading} />
          )}
        </main>
      </div>
    </>
  );
};

export default SeismicSectionViewer;