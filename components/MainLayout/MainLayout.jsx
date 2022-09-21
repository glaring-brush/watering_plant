import styles from './MainLayout.module.css';

export default function MainLayout({ children }) {
  return (
    <div className={styles.MainLayout}>
      {children}
      <footer className={styles.MainLayoutFooter}>Версія 3.0</footer>
    </div>
  );
}
