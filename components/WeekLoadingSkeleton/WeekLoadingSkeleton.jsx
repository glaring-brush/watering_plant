import styles from './WeekLoadingSkeleton.module.css';

const WEEKDAY_MONDAY = 'WEEKDAY_MONDAY';
const WEEKDAY_TUESDAY = 'WEEKDAY_TUESDAY';
const WEEKDAY_WEDNESDAY = 'WEEKDAY_WEDNESDAY';
const WEEKDAY_THURSDAY = 'WEEKDAY_THURSDAY';
const WEEKDAY_FRIDAY = 'WEEKDAY_FRIDAY';
const WEEKDAY_SATURDAY = 'WEEKDAY_SATURDAY';
const WEEKDAY_SUNDAY = 'WEEKDAY_SUNDAY';

const WEEKDAYS_WIDTH = [
  { day: WEEKDAY_MONDAY, width: 9.7 },
  { day: WEEKDAY_TUESDAY, width: 8.8 },
  { day: WEEKDAY_WEDNESDAY, width: 8.1 },
  { day: WEEKDAY_THURSDAY, width: 8.0 },
  { day: WEEKDAY_FRIDAY, width: 9 },
  { day: WEEKDAY_SATURDAY, width: 8.0 },
  { day: WEEKDAY_SUNDAY, width: 8.0 },
];

function WeekDayLoadingSkeleton({ day, width }) {
  return (
    <div>
      <div
        className={styles.WeekDayLoadingSkeleton}
        style={{
          width: `${width}em`,
        }}
      ></div>
    </div>
  );
}

export default function WeekLoadingSkeleton() {
  return (
    <div className={styles.WeekLoadingSkeleton}>
      {WEEKDAYS_WIDTH.map(({ day, width }) => (
        <WeekDayLoadingSkeleton key={day} day={day} width={width} />
      ))}
    </div>
  );
}
