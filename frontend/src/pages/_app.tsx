import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { NextUIProvider } from '@nextui-org/react';
import MainNavbar from '@/components/Navbar/MainNavbar';
import { Footer } from '@/components/Footer/Footer';
import './styles/globals.css';
import { GetMe } from '@/pages/api/auth/auth';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { User_Sidebar } from '../components/Sidebar/Sidebar';

export default function App({ Component, pageProps }: AppProps) {
  const [show, setShow] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      setShow(false);
      GetMe()
        .then((res) => {
          if (res.status !== 200) {
            Cookies.remove('access_token');
            router.push('/');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div>
      <NextUIProvider>
        <MainNavbar Show={show} />
        <User_Sidebar Show={show} />
        <Component {...pageProps} />
      </NextUIProvider>
      <Footer Show={show} />
    </div>
  );
}
