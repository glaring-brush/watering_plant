import { useCreateWateringEventMutation, useGetWateringEventsListQuery } from '../apis/wateringEvents';
import MainLayout from '../components/MainLayout/MainLayout';
import WeekLoadingSkeleton from '../components/WeekLoadingSkeleton/WeekLoadingSkeleton';
import CalendarIcon from '../components/icons/Calendar';
import { DEFAULT_DATE_FORMAT } from '../helpers/dates';
import { useSchedule } from '../helpers/hooks';
import { selectToken } from '../selectors';
import styles from '../styles/Home.module.css';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/plugin/relativeTime';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

dayjs.extend(localizedFormat);

const IS_WATERED_FIELD = 'isWatered';
const WATERING_DATE_FIELD = 'wateringDateField';

function WeekRow({ value, label, schedule }) {
  const dayKey = dayjs(value).format(DEFAULT_DATE_FORMAT);
  const currentDay = dayjs().format(DEFAULT_DATE_FORMAT);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      [IS_WATERED_FIELD]: schedule[dayKey] || false,
      [WATERING_DATE_FIELD]: value,
    },
  });

  const { handleSubmit, register, watch } = methods;

  const [createWateringEvent, { isLoading: isCreateWateringEventLoading }] = useCreateWateringEventMutation();

  const createWateringEventSuccess = () => {};

  const createWateringEventFail = (error) => {};

  const onSubmit = (formData) => {
    createWateringEvent(formData)
      .unwrap()
      .then(createWateringEventSuccess)
      .catch((error) => createWateringEventFail(error));
  };

  useEffect(() => {
    const subscription = watch(handleSubmit(onSubmit));
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSubmit, watch]);

  const liLabel = label[0].toUpperCase() + label.slice(1);
  return (
    <li
      style={{
        listStyle: 'none',
        marginBottom: '.4em',
        opacity: isCreateWateringEventLoading ? '0.8' : '1',
        transition: 'all 0.2s',
      }}
      key={value}
    >
      <label
        htmlFor={`checkbox-${value}`}
        className={`${styles.DayLabel} ${isCreateWateringEventLoading ? 'animated' : ''} ${
          isCreateWateringEventLoading ? styles.DayLabelProgress : ''
        } `}
        style={{
          backgroundColor: value === currentDay ? 'var(--current-date-background)' : 'inherit',
        }}
      >
        <input
          type="checkbox"
          id={`checkbox-${value}`}
          {...register(IS_WATERED_FIELD)}
          className={styles.DayCheckbox}
        />
        <input {...register(WATERING_DATE_FIELD)} hidden />
        {liLabel}
      </label>
    </li>
  );
}

function useWeek() {
  const weekStart = dayjs().locale('uk').startOf('week');
  const weekEnd = dayjs().locale('uk').startOf('week').add(6, 'days');

  const weekDaysOptions = [];
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const day = weekStart.add(dayIndex, 'days');
    weekDaysOptions.push({
      value: day.format(DEFAULT_DATE_FORMAT),
      label: day.format('dddd'),
    });
  }

  return {
    weekStart,
    weekEnd,
    weekDaysOptions,
  };
}

export default function IndexPage() {
  const { weekStart, weekEnd, weekDaysOptions } = useWeek();

  const { schedule, isLoading, isError } = useSchedule();

  const userToken = useSelector(selectToken);

  const isRangeInSameMonth = weekStart.isSame(weekEnd, 'month');

  return (
    <>
      <Head>
        <title>Підливання вазону</title>
      </Head>

      <MainLayout>
        {userToken ? (
          <main>
            <h1 className={styles.PageHeader}>
              <span>Підливання вазону</span>
              <Link href="/calendar" passHref>
                <a className={styles.CalendarLink}>
                  ({weekStart.format(isRangeInSameMonth ? 'D' : 'D MMMM')} - {weekEnd.format('D MMMM')})
                  <span className={styles.CalendarLinkIcon}>
                    <CalendarIcon width="1em" height="1em" />
                  </span>
                </a>
              </Link>
            </h1>
            {isLoading ? (
              <WeekLoadingSkeleton />
            ) : isError ? (
              'Помилка'
            ) : (
              <ul className={styles.WeekDays}>
                {weekDaysOptions.map(({ value, label }) => (
                  <WeekRow key={value} value={value} label={label} schedule={schedule} />
                ))}
              </ul>
            )}
          </main>
        ) : (
          <main className={styles.PageMain}>
            <h1>Доступ заборонено</h1>
            <section>
              <Image
                src="/Persuadable_Bouncer.png"
                alt="Access denied - image of Persuadable Bouncer meme with closed dors"
                width={500}
                height={500}
              />
            </section>
          </main>
        )}
      </MainLayout>
    </>
  );
}
