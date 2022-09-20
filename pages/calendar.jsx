import MainLayout from '../components/MainLayout/MainLayout';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import { useState } from 'react';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(0);
  const isMonthLoading = useState(false);

  return (
    <>
      <Head>
        <title>Підливання вазонка</title>
      </Head>

      <MainLayout>
        <main className={styles.PageMain}>
          <h1 className={styles.PageHeader}>Календар підливання вазонка</h1>
          <h2>Поточний місяць: {currentMonth}</h2>
          <div className={styles.CalendarNavigationButtons}>
            <button
              type="button"
              onClick={() => setCurrentMonth(currentMonth - 1)}
              className={`${styles.CalendarNavigationButton} ${isMonthLoading ? 'animated' : ''}`}
            >
              Попередній
            </button>
            <button
              type="button"
              onClick={() => setCurrentMonth(currentMonth + 1)}
              className={`${styles.CalendarNavigationButton} ${isMonthLoading ? 'animated' : ''}`}
            >
              Наступний
            </button>
          </div>
        </main>
      </MainLayout>
    </>
  );
}
