import MainLayout from '../components/MainLayout/MainLayout';
import styles from '../styles/Home.module.css';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

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

function generateDateRange(startDate, endDate) {
  const numberOfDaysInWeek = 7;
  const numberOfWeeksToDisplay = Math.ceil(endDate.diff(startDate, 'weeks', true));
  const numberOfDaysToDisplay = Math.ceil(endDate.diff(startDate, 'days'));

  let dateRange = [];
  for (let i = 0; i <= numberOfDaysToDisplay; i++) {
    dateRange.push(startDate.add(i, 'days'));
  }

  return dateRange;
}

export default function CalendarPage({ date }) {
  const router = useRouter();

  const currentDate = dayjs();

  const [isMonthLoading, setIsMonthLoading] = useState(false);

  const filterDate = parseQueryDate(date) || dayjs();
  const localFilterDate = filterDate.locale('uk');

  const firstCalendarDay = localFilterDate.startOf('month').startOf('week');
  const lastCalendarDay = localFilterDate.endOf('month').endOf('week');

  const firstDayOfPreviousMonth = localFilterDate.subtract(1, 'month').startOf('month');
  const firstDayOfNextMonth = localFilterDate.add(1, 'month').startOf('month');

  const dateRange = useMemo(() => generateDateRange(firstCalendarDay, lastCalendarDay), [date]);

  console.log(dateRange);

  return (
    <>
      <Head>
        <title>Підливання вазонка</title>
      </Head>

      <MainLayout>
        <main className={styles.PageMain}>
          <h1 className={styles.PageHeader}>Календар підливання вазонка</h1>
          <h2 className={styles.CalendarPageHeader}>
            <span>Вибраний місяць: {localFilterDate.format('MMMM YYYY')}</span>
            <button
              type="button"
              onClick={() => router.replace({ query: {} })}
              className={`${styles.CalendarNavigationButton} ${styles.CalendarNavigationButtonReset}`}
            >
              до поточного
            </button>
          </h2>
          <div className={styles.CalendarNavigationButtons}>
            <button
              type="button"
              onClick={() => router.replace({ query: { date: formatQueryDate(firstDayOfPreviousMonth) } })}
              className={`${styles.CalendarNavigationButton} ${isMonthLoading ? 'animated' : ''}`}
            >
              Попередній
            </button>
            <button
              type="button"
              onClick={() => router.replace({ query: { date: formatQueryDate(firstDayOfNextMonth) } })}
              className={`${styles.CalendarNavigationButton} ${isMonthLoading ? 'animated' : ''}`}
            >
              Наступний
            </button>
          </div>
          <div className={styles.Calendar}>
            {dateRange.map((date, index) => (
              <div
                className={styles.CalendarDay}
                key={date.format(DEFAULT_DATE_FORMAT)}
                style={{
                  borderTop: index < 7 ? 'none' : '1px solid grey',
                  borderLeft: index % 7 === 0 ? 'none' : '1px solid grey',
                  color: filterDate.isSame(date, 'month') ? 'inherit' : '#d0d0d0',
                }}
              >
                {date.format('DD')}
              </div>
            ))}
          </div>
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
