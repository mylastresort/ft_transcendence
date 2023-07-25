import React, { useContext, useEffect, useState } from 'react';
import './styles/globals.css';
import './styles/layout.css';
import './styles/fonts.css';
import type { AppProps } from 'next/app';
import { NextUIProvider } from '@nextui-org/react';
import { MainNavbar } from '@/components/Navbar/MainNavbar';
import { Footer } from '@/components/Footer/Footer';
import { GetMe } from '@/pages/api/auth/auth';
import { useRouter } from 'next/router';
import { User_Sidebar } from '../components/Sidebar/Sidebar';
import { UserContext } from '@/context/user';
import { WsProvider, UserSocket } from '@/context/WsContext';
import { Button, Group, MantineProvider, Stack, Text } from '@mantine/core';
import Theme from './styles/theme';
import { Notifications, notifications } from '@mantine/notifications';

export default function App({ Component, pageProps }: AppProps) {
  let user = useContext(UserContext);
  const [show, setShow] = useState(true);
  const [isTwoFactorAuth, setIsTwoFactorAuth] = useState(false);
  const [Token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    setToken(token);
    console.log('token', token);
    if (token) {
      setShow(false);
      GetMe()
        .then((res) => {
          user.data = res.body;
          if (res.status !== 200) {
            UserSocket.disconnect();
            localStorage.removeItem('jwtToken');
            router.push('/');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      const token = localStorage.getItem('jwtToken');
      setToken(token);

      if (token) {
        setShow(false);
        GetMe()
          .then((res) => {
            user = res.body;
            if (res.status !== 200) {
              UserSocket.disconnect();
              localStorage.removeItem('jwtToken');
              router.push('/');
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setShow(true);
        setIsTwoFactorAuth(false);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={Theme}>
      <Notifications position="top-right" />
      <WsProvider token={Token}>
        <NextUIProvider>
          <UserContext.Provider value={user}>
            <MainNavbar Show={show} isTwoFactorAuth={isTwoFactorAuth} />
            <User_Sidebar Show={show} />
            <Component {...pageProps} setIsTwoFactorAuth={setIsTwoFactorAuth} />
            <Footer Show={show} isTwoFactorAuth={isTwoFactorAuth} />
          </UserContext.Provider>
        </NextUIProvider>
      </WsProvider>
    </MantineProvider>
  );
}
