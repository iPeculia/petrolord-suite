import { useCallback } from 'react';
import { useWellCorrelationContext } from '@/contexts/WellCorrelationContext';
import { v4 as uuidv4 } from 'uuid';
import { getLogColor } from '@/utils/wellCorrelation/colorPalettes';

export const useLogManagement = () => {
  const { tracks, updateTrack } = useWellCorrelationContext();

  const addLogToTrack = useCallback((trackId, logMnemonic) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    const newLog = {
      id: uuidv4(),
      mnemonic: logMnemonic,
      color: getLogColor(logMnemonic),
      lineWidth: 1,
      lineStyle: 'solid',
      fill: 'none',
      fillColor: getLogColor(logMnemonic),
      fillOpacity: 0.2,
      visible: true
    };

    const updatedLogs = [...(track.logs || []), newLog];
    updateTrack(trackId, { ...track, logs: updatedLogs });
  }, [tracks, updateTrack]);

  const removeLogFromTrack = useCallback((trackId, logId) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    const updatedLogs = (track.logs || []).filter(l => l.id !== logId);
    updateTrack(trackId, { ...track, logs: updatedLogs });
  }, [tracks, updateTrack]);

  const updateLogSettings = useCallback((trackId, logId, settings) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    const updatedLogs = (track.logs || []).map(l => 
      l.id === logId ? { ...l, ...settings } : l
    );
    updateTrack(trackId, { ...track, logs: updatedLogs });
  }, [tracks, updateTrack]);

  const reorderLogs = useCallback((trackId, startIndex, endIndex) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track || !track.logs) return;

    const result = Array.from(track.logs);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    updateTrack(trackId, { ...track, logs: result });
  }, [tracks, updateTrack]);

  return {
    addLogToTrack,
    removeLogFromTrack,
    updateLogSettings,
    reorderLogs
  };
};