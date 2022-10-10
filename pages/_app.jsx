import { persistor, store } from '../store';
import '../styles/globals.css';
import { useRouter } from 'next/router';
import 'normalize.css';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

function setPageTransition(isTransitioning) {
  if (isTransitioning) {
    document.body.classList.add('changingPage');
  } else {
    document.body.classList.remove('changingPage');
  }
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url) => url !== router.asPath && setPageTransition(true);
    const handleComplete = () => setPageTransition(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
