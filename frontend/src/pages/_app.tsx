import React, { useContext, useEffect, useState } from 'react';
import './styles/globals.css';
import './styles/layout.css';
import type { AppProps } from 'next/app';
import { NextUIProvider } from '@nextui-org/react';
import MainNavbar from '@/components/Navbar/MainNavbar';
import { Footer } from '@/components/Footer/Footer';
import { GetMe } from '@/pages/api/auth/auth';
import { useRouter } from 'next/router';
import { User_Sidebar } from '../components/Sidebar/Sidebar';
import { UserContext } from '@/context/user';

export default function App({ Component, pageProps }: AppProps) {
  let user = useContext(UserContext);
  const [show, setShow] = useState(true);
  const [isTwoFactorAuth, setIsTwoFactorAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setShow(false);
      GetMe()
        .then((res) => {
          user = res.body;
          if (res.status !== 200) {
            localStorage.removeItem('jwtToken');
            window.location.href = '/';
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <NextUIProvider>
      <UserContext.Provider value={user}>
        <MainNavbar Show={show} isTwoFactorAuth={isTwoFactorAuth} />
        <User_Sidebar Show={show} />
        <Component
          {...pageProps}
          setIsTwoFactorAuth={setIsTwoFactorAuth}
        />{' '}
        {/* Pass setShow as a prop */}
        <Footer Show={show} isTwoFactorAuth={isTwoFactorAuth} />
      </UserContext.Provider>
    </NextUIProvider>
  );
}
