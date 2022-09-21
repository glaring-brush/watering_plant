import MainLayout from '../components/MainLayout/MainLayout';
import CaretLeftFill from '../components/icons/CaretLeftFill';
import CaretRightFill from '../components/icons/CaretRightFill';
import ListChecked from '../components/icons/ListChecked';
import styles from '../styles/Home.module.css';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import Head from 'next/head';
import Link from 'next/link';
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

  const [isMonthLoading, setIsMonthLoading] = useState(false);

  const filterDate = parseQueryDate(date) || dayjs();
  const localFilterDate = filterDate.locale('uk');

  const firstCalendarDay = localFilterDate.startOf('month').startOf('week');
  const lastCalendarDay = localFilterDate.endOf('month').endOf('week');

  const firstDayOfPreviousMonth = localFilterDate.subtract(1, 'month').startOf('month');
  const firstDayOfNextMonth = localFilterDate.add(1, 'month').startOf('month');

  const dateRange = useMemo(() => generateDateRange(firstCalendarDay, lastCalendarDay), [date]);

  const isSameYear = currentDate.isSame(localFilterDate, 'year');

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
              isLoading={isMonthLoading}
              icon={<CaretLeftFill width="1em" height="1em" />}
              direction="ltr"
            >
              Попередній
            </CalendarNavigationButton>
            <CalendarNavigationButton
              onClick={() => router.replace({ query: { date: formatQueryDate(firstDayOfNextMonth) } })}
              isLoading={isMonthLoading}
              icon={<CaretRightFill width="1em" height="1em" />}
              direction="rtl"
            >
              Наступний
            </CalendarNavigationButton>
          </div>
          <div className={styles.Calendar}>
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
                  color: filterDate.isSame(date, 'month') ? 'inherit' : '#d0d0d0',
                }}
              >
                {date.format('DD')}
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
