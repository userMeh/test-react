import type { AppProps } from 'next/app';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '@/app/globals.css';
import '@/app/styles.css';
import Cookies from 'js-cookie';

function App({ Component, pageProps }: AppProps) {
  const [token, setToken] = useState<string | undefined>(Cookies.get('token'));
  const { asPath } = useRouter();

  useEffect(() => {
    setToken(Cookies.get('token'));
  }, [asPath]);

  return (
    <div id='__next'>
      <Header token={token} />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
