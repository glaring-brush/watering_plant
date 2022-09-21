import dayjs from 'dayjs';

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

export function parseQueryDate(date) {
  if (!date) {
    return '';
  }

  const parsedDate = dayjs(date, DEFAULT_DATE_FORMAT);
  if (!parsedDate.isValid()) {
    return '';
  }
  return parsedDate;
}

export function formatQueryDate(date) {
  if (!date) {
    return null;
  }

  const nonFormattedDate = dayjs(date);
  if (!nonFormattedDate.isValid()) {
    return null;
  }

  return nonFormattedDate.format(DEFAULT_DATE_FORMAT);
}

export function generateDateRange(startDate, endDate) {
  const numberOfDaysToDisplay = Math.ceil(endDate.diff(startDate, 'days'));

  let dateRange = [];
  for (let i = 0; i <= numberOfDaysToDisplay; i++) {
    dateRange.push(startDate.add(i, 'days'));
  }

  return dateRange;
}
