import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { saveToken } from 'stores/auth';

export default function AuthorizePage({ token }) {
  const dispatch = useDispatch();
  const router = useRouter();

  if (!token) {
    return <div className={styles.AuthorizePageMessage}>Нема ключа - так просто не зайдеш)</div>;
  }

  dispatch(saveToken(token));
  router.replace('/');

  return <div className={styles.AuthorizePageMessage}>Перехід на головну сторінку...</div>;
}

export async function getServerSideProps({ query }) {
  const { token = null } = query;

  return {
    props: {
      token,
    },
  };
}
