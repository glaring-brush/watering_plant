import { useCreateWateringEventMutation, useGetWateringEventsListQuery } from '../apis/wateringEvents';
import styles from '../styles/Home.module.css';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/plugin/relativeTime';
import Head from 'next/head';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

dayjs.extend(localizedFormat);

const IS_WATERED_FIELD = 'isWatered';
const WATERING_DATE_FIELD = 'wateringDateField';

function WeekRow({ value, label, schedule }) {
  const dayKey = dayjs(value).format('dddd');

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      [IS_WATERED_FIELD]: schedule[dayKey] || false,
      [WATERING_DATE_FIELD]: value,
    },
  });

  const { handleSubmit, register, watch } = methods;

  const [createWateringEvent, { isLoading: isCreateWateringEventLoading }] = useCreateWateringEventMutation();

  const createWateringEventSuccess = () => {
    console.log('success');
  };

  const createWateringEventFail = () => {
    console.log('error');
  };

  const onSubmit = (formData) => {
    console.log(formData);
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
      <label htmlFor={`checkbox-${value}`} className={`${styles.DayLabel} ${isCreateWateringEventLoading ? 'animated' : ''} ${isCreateWateringEventLoading ? styles.DayLabelProgress : ''} `}>
        <input type='checkbox' id={`checkbox-${value}`} {...register(IS_WATERED_FIELD)} className={styles.DayCheckbox} />
        <input {...register(WATERING_DATE_FIELD)} hidden />
        {liLabel}
      </label>
    </li>
  );
}

export default function RoomPage() {
  const weekStart = dayjs().locale('uk').startOf('week');
  const weekEnd = dayjs().locale('uk').startOf('week').add(6, 'days');

  const weekDaysOptions = [];
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const day = weekStart.add(dayIndex, 'days');
    weekDaysOptions.push({
      value: day.toISOString(),
      label: day.format('dddd'),
    });
  }

  const schedule = {};
  const { data, isLoading, isError } = useGetWateringEventsListQuery();
  console.log(data);

  if (data?.events) {
    for (let event of data.events) {
      const { date, done } = event;
      schedule[dayjs(date).format('dddd')] = done;
    }
  }

  console.log(schedule);

  return (
    <div>
      <Head>
        <title>Підливання вазонка </title>
      </Head>

      <main className={styles.PageMain}>
        <h1 className={styles.PageHeader}>
          Підливання вазонка{' '}
          <span className={styles.WeekRange}>
            ({weekStart.format('D MMMM')} - {weekEnd.format('D MMMM')})
          </span>
        </h1>
        {isLoading ? (
          'Завантажую...'
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

      <footer className={styles.PageFooter}>Версія 1.1</footer>
    </div>
  );
}
