import { DEFAULT_DATE_FORMAT } from './dates';
import { useGetWateringEventsListQuery } from 'apis/wateringEvents';
import dayjs from 'dayjs';
import { useMemo } from 'react';

export function useSchedule() {
  const { data, isLoading, isError } = useGetWateringEventsListQuery();

  const computedSchedule = useMemo(() => {
    const schedule = {};
    if (data?.events) {
      for (let event of data.events) {
        const { date, done } = event;
        schedule[dayjs(date).format(DEFAULT_DATE_FORMAT)] = done;
      }
    }
    return schedule;
  }, [data]);

  return { schedule: computedSchedule, isLoading, isError };
}
