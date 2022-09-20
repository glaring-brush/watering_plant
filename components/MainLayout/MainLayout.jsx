import styles from './MainLayout.module.css';

export default function MainLayout({ children }) {
  return (
    <div className={styles.MainLayout}>
      {children}
      <footer className={styles.MainLayoutFooter}>version 1.1</footer>
    </div>
  );
}
