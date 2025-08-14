import {ToastAndroid} from 'react-native';
import {STATUS_TYPES, StatusKey} from './OrderStatus';

export function Toast(str: string) {
  return ToastAndroid.show(str, ToastAndroid.SHORT);
}

export function addOrEditDays(date: Date, days: number): string {
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export function isCalendarDatesEmpty(markedDates: MarkedDates): boolean {
  return Object.keys(markedDates).length === 0;
}

export function getCalenderDatesLength(markedDates: MarkedDates): number {
  return Object.keys(markedDates).length;
}

export type MarkedDates = {
  [key: string]: MarkingProps;
};

export interface MarkingProps {
  dotColor?: string;
  marked?: boolean;
  textColor?: string;
  status?: string;
  label?: string;
  selected?: boolean;
  selectedColor?: string;
  date: string;
  selectedTextColor?: string;
  startingDay?: boolean;
  endingDay?: boolean;
  color?: string;
}

export interface Period {
  startDate: string;
  endDate: string;
}

export interface ResponseDate {
  status: StatusKey;
  date: string;
}

// Create the extension function
export function convertToMarkedDates(statusDates: ResponseDate[]): MarkedDates {
  const markedDates: MarkedDates = {};

  statusDates.forEach(item => {
    const statusInfo = STATUS_TYPES[item.status];

    markedDates[item.date] = {
      marked: true,
      dotColor: statusInfo.color,
      textColor: statusInfo.color,
      status: item.status,
      label: statusInfo.label,
      selected: true,
      selectedColor: 'transparent',
      selectedTextColor: statusInfo.color,
      date: item.date,
    };
  });

  return markedDates;
}

export function getUpcomingVacationDates(
  dates: ResponseDate[],
): ResponseDate[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();

  return dates
    .filter(item => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0); // Normalize time
      return item.status === 'vacation' && itemDate.getTime() >= todayTime;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
}

export function generateRandomStatusDates(): ResponseDate[] {
  const result: ResponseDate[] = [];
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Status probabilities
  const statusProbabilities = {
    delivered: 0.5,
    canceled: 0.2,
    undelivered: 0.2,
    vacation: 0.1,
  };

  // Generate dates from 30 days ago to 10 days in the future
  for (let i = -30; i <= 0; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    // Skip today (if you want to exclude it)
    if (dateStr === todayStr) {
      continue;
    }

    // Skip about 40% of days to create gaps
    if (Math.random() < 0.3) {
      continue;
    }

    // Determine status
    const rand = Math.random();
    let cumulativeProb = 0;
    let status: StatusKey = 'delivered'; // default

    for (const [key, prob] of Object.entries(statusProbabilities)) {
      cumulativeProb += prob;
      if (rand < cumulativeProb) {
        status = key as StatusKey;
        break;
      }
    }

    result.push({
      status,
      date: dateStr,
    });
  }

  return result;
}

// Return the period date ranges
export function getDerivePeriodsFromSelectedDates(
  selectedDates: MarkedDates,
): Period[] {
  const sortedDates = Object.keys(selectedDates).sort();
  const periods: Period[] = [];

  let currentStart: string | null = null;
  let lastProcessedDate: string | null = null;

  for (const date of sortedDates) {
    const dayInfo = selectedDates[date];
    if (lastProcessedDate === date) {
      continue;
    }
    if (dayInfo.startingDay && dayInfo.endingDay) {
      periods.push({
        startDate: date,
        endDate: date,
      });
      lastProcessedDate = date;
      currentStart = null;
    } else if (dayInfo.startingDay && !currentStart) {
      currentStart = date;
    } else if (dayInfo.endingDay && currentStart) {
      periods.push({
        startDate: currentStart,
        endDate: date,
      });
      lastProcessedDate = date;
      currentStart = null;
    }
  }

  return periods;
}

// Get the data of resume vacation
export function getResumptionDate(markedDates: MarkedDates): string | null {
  const vacationDates = Object.entries(markedDates)
    .filter(([_, props]) => props.marked)
    .map(([date]) => new Date(date))
    .sort((a, b) => a.getTime() - b.getTime());

  if (vacationDates.length === 0) {
    return null;
  }
  for (let i = 1; i < vacationDates.length; i++) {
    const prevDate = new Date(vacationDates[i - 1]);
    const currDate = new Date(vacationDates[i]);

    prevDate.setDate(prevDate.getDate() + 1);

    if (prevDate.getTime() < currDate.getTime()) {
      return formatDate(prevDate);
    }
  }
  const lastDate = new Date(vacationDates[vacationDates.length - 1]);
  lastDate.setDate(lastDate.getDate() + 1);
  return formatDate(lastDate);
}

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// In periodic selection get wether its is valid date or not
export const isMarkedDatesClean = (markedDates: MarkedDates): boolean => {
  const dates = Object.keys(markedDates);
  if (dates.length === 0) {
    return true;
  }

  const sortedDates = [...dates].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  let currentPeriod: string[] = [];
  let expectingEnd = false;

  for (let i = 0; i < sortedDates.length; i++) {
    const date = sortedDates[i];
    const {startingDay, endingDay} = markedDates[date];
    const isStart = Boolean(startingDay);
    const isEnd = Boolean(endingDay);

    // Case 1: Valid single-day period
    if (isStart && isEnd) {
      if (expectingEnd) {
        return false;
      } // Can't have single-day during a period
      continue;
    }

    // Case 2: Starting a new period
    if (isStart && !expectingEnd) {
      currentPeriod = [date];
      expectingEnd = true;
      continue;
    }

    // Case 3: Middle day of a period
    if (expectingEnd && !isStart && !isEnd) {
      currentPeriod.push(date);
      continue;
    }

    // Case 4: Valid period end
    if (expectingEnd && isEnd) {
      currentPeriod = [];
      expectingEnd = false;
      continue;
    }

    // Any other case is invalid
    return false;
  }

  // Final check for unclosed periods
  return !expectingEnd;
};
