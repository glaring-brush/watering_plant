import MainLayout from '../components/MainLayout/MainLayout';
import CaretLeftFill from '../components/icons/CaretLeftFill';
import CaretRightFill from '../components/icons/CaretRightFill';
import DropletFill from '../components/icons/DropletFill';
import ListChecked from '../components/icons/ListChecked';
import { DEFAULT_DATE_FORMAT, formatQueryDate, generateDateRange, parseQueryDate } from '../helpers/dates';
import { useSchedule } from '../helpers/hooks';
import styles from '../styles/Home.module.css';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

function IconSpacer() {
  return <div className={styles.IconSpacer}></div>;
}

function CalendarNavigationButton({ onClick = () => {}, isLoading, children, icon, direction = 'ltr' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ direction }}
      className={`${styles.CalendarNavigationButton} ${isLoading ? 'animated' : ''}`}
    >
      {icon}
      <IconSpacer />
      {children}
    </button>
  );
}

export default function CalendarPage({ date }) {
  const router = useRouter();

  const currentDate = dayjs();

  const filterDate = parseQueryDate(date) || dayjs();
  const localFilterDate = filterDate.locale('uk');

  const firstCalendarDay = localFilterDate.startOf('month').startOf('week');
  const lastCalendarDay = localFilterDate.endOf('month').endOf('week');

  const firstDayOfPreviousMonth = localFilterDate.subtract(1, 'month').startOf('month');
  const firstDayOfNextMonth = localFilterDate.add(1, 'month').startOf('month');

  const dateRange = useMemo(() => generateDateRange(firstCalendarDay, lastCalendarDay), [date]);

  const isSameYear = currentDate.isSame(localFilterDate, 'year');

  const { schedule, isLoading, isError } = useSchedule();

  return (
    <>
      <Head>
        <title>Підливання вазону</title>
      </Head>

      <MainLayout>
        <main className={styles.PageMain}>
          <h1 className={styles.PageHeader}>Календар підливання вазону</h1>
          <h2 className={styles.CalendarPageHeader}>
            <span>Вибраний місяць: {localFilterDate.format(isSameYear ? 'MMMM' : 'MMMM YYYY')}</span>
            <button
              type="button"
              onClick={() => router.replace({ query: {} })}
              className={`${styles.CalendarNavigationButton} ${styles.CalendarNavigationButtonReset}`}
            >
              до поточного
            </button>
          </h2>
          <div className={styles.CalendarNavigationButtons}>
            <CalendarNavigationButton
              onClick={() => router.replace({ query: { date: formatQueryDate(firstDayOfPreviousMonth) } })}
              isLoading={isLoading}
              icon={<CaretLeftFill width="1em" height="1em" />}
              direction="ltr"
            >
              Попередній
            </CalendarNavigationButton>
            <CalendarNavigationButton
              onClick={() => router.replace({ query: { date: formatQueryDate(firstDayOfNextMonth) } })}
              isLoading={isLoading}
              icon={<CaretRightFill width="1em" height="1em" />}
              direction="rtl"
            >
              Наступний
            </CalendarNavigationButton>
          </div>
          <div className={styles.Calendar} style={{ opacity: isLoading ? 0.2 : 1 }}>
            {dateRange.slice(0, 7).map((date) => (
              <div className={styles.CalendarWeekDay} key={date.format('dd')}>
                {date.format('dd')}
              </div>
            ))}
            {dateRange.map((date, index) => (
              <div
                className={styles.CalendarDay}
                key={date.format(DEFAULT_DATE_FORMAT)}
                style={{
                  borderTopStyle: index < 7 ? 'none' : 'solid',
                  borderLeftStyle: index % 7 === 0 ? 'none' : 'solid',
                  color: date.isSame(filterDate, 'month') ? 'inherit' : 'var(--calendar-muted-date-color)',
                  fontWeight: date.isSame(currentDate, 'day') ? 'bold' : 'inherit',
                  backgroundColor: date.isSame(currentDate, 'day') ? 'var(--calendar-current-date)' : 'inherit',
                }}
              >
                <span className={styles.CalendarDayText}>
                  {date.format('DD')}
                  <div className={styles.CalendarPlantWateringIndication}>
                    {schedule[date.format(DEFAULT_DATE_FORMAT)] ? <DropletFill width="1em" height="1em" /> : null}
                  </div>
                </span>
              </div>
            ))}
          </div>
          <Link href="/">
            <a className={styles.CalendarBackToMainPageLink}>
              <ListChecked width="1em" height="1em" />
              <IconSpacer />
              Повернутись на головну сторінку
            </a>
          </Link>
        </main>
      </MainLayout>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { date = null } = query;

  return {
    props: {
      date,
    },
  };
}
