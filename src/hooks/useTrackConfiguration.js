import { useTrackConfigurationContext } from '@/contexts/TrackConfigurationContext';

export const useTrackConfiguration = () => {
  return useTrackConfigurationContext();
};