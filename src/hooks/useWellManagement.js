import { useMemo, useCallback } from 'react';
import { useWellCorrelationContext } from '@/contexts/WellCorrelationContext';
import { useTrackConfigurationContext } from '@/contexts/TrackConfigurationContext';

export const useWellManagement = () => {
  const { wells } = useWellCorrelationContext();
  const { wellSettings, updateWellSettings, addWellToCorrelation, removeWellFromCorrelation } = useTrackConfigurationContext();

  // Derived lists
  const orderedWells = useMemo(() => {
    return (wellSettings.order || [])
      .map(id => wells.find(w => w.id === id))
      .filter(Boolean);
  }, [wells, wellSettings.order]);

  const visibleWells = useMemo(() => {
    return orderedWells.filter(w => !wellSettings.hidden.includes(w.id));
  }, [orderedWells, wellSettings.hidden]);

  // Actions
  const selectWell = useCallback((id, multiSelect = false) => {
    updateWellSettings({
      selected: multiSelect 
        ? (wellSettings.selected.includes(id) 
            ? wellSettings.selected.filter(sid => sid !== id) 
            : [...wellSettings.selected, id])
        : [id],
      focused: id
    });
  }, [wellSettings.selected, updateWellSettings]);

  const clearSelection = useCallback(() => {
    updateWellSettings({ selected: [], focused: null });
  }, [updateWellSettings]);

  const toggleWellVisibility = useCallback((id) => {
    const newHidden = wellSettings.hidden.includes(id)
      ? wellSettings.hidden.filter(hid => hid !== id)
      : [...wellSettings.hidden, id];
    updateWellSettings({ hidden: newHidden });
  }, [wellSettings.hidden, updateWellSettings]);

  const reorderWells = useCallback((startIndex, endIndex) => {
    const result = Array.from(wellSettings.order);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    updateWellSettings({ order: result });
  }, [wellSettings.order, updateWellSettings]);

  const moveWell = useCallback((id, direction) => {
    const currentIndex = wellSettings.order.indexOf(id);
    if (currentIndex === -1) return;

    let newIndex = currentIndex;
    if (direction === 'left') newIndex = Math.max(0, currentIndex - 1);
    if (direction === 'right') newIndex = Math.min(wellSettings.order.length - 1, currentIndex + 1);
    if (direction === 'start') newIndex = 0;
    if (direction === 'end') newIndex = wellSettings.order.length - 1;

    if (newIndex !== currentIndex) {
      reorderWells(currentIndex, newIndex);
    }
  }, [wellSettings.order, reorderWells]);

  const getWell = useCallback((id) => wells.find(w => w.id === id), [wells]);

  const isInCorrelation = useCallback((wellId) => {
    return wellSettings.wellsInCorrelation.includes(wellId);
  }, [wellSettings.wellsInCorrelation]);

  return {
    wells,
    orderedWells,
    visibleWells,
    selectedWells: wellSettings.selected,
    focusedWell: wellSettings.focused,
    hiddenWells: wellSettings.hidden,
    wellsInCorrelation: wellSettings.wellsInCorrelation,
    
    selectWell,
    clearSelection,
    toggleWellVisibility,
    reorderWells,
    moveWell,
    getWell,
    
    addToCorrelation: addWellToCorrelation,
    removeFromCorrelation: removeWellFromCorrelation,
    isInCorrelation
  };
};