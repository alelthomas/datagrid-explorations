import { format, isSameDay } from 'date-fns';

export const formatDate = (date: Date, formatStr: string = 'yyyy-MM-dd'): string => {
  return format(date, formatStr);
};

export const isCurrentDay = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const isDemoMonth = (date: Date): boolean => {
  return date.getFullYear() === 2025 && date.getMonth() === 4; // May 2025
};

export const isWithinDemoYear = (date: Date): boolean => {
  return date.getFullYear() === 2025;
};

export const findContinuousPeriods = (dates: string[]): string[][] => {
  if (!dates.length) return [];

  const sortedDates = [...dates].sort();
  const periods: string[][] = [];
  let currentPeriod: string[] = [sortedDates[0]];

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    const previousDate = new Date(sortedDates[i - 1]);
    const diffDays = (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentPeriod.push(sortedDates[i]);
    } else {
      periods.push([...currentPeriod]);
      currentPeriod = [sortedDates[i]];
    }
  }

  periods.push(currentPeriod);
  return periods;
}; 