import { useMemo } from 'react';
import { isWithinDemoYear } from '../utils/dateUtils';
import { samplePTOData } from '../data/sampleData';

export const usePTOData = (currentDate: Date) => {
  return useMemo(() => {
    if (!isWithinDemoYear(currentDate)) {
      return {};
    }
    return samplePTOData;
  }, [currentDate]);
}; 