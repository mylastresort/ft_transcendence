import React, { useContext, useEffect, useMemo, useState } from 'react';
import './styles/globals.css';
import './styles/layout.css';
import './styles/fonts.css';
import type { AppProps } from 'next/app';
import { NextUIProvider } from '@nextui-org/react';
import { MainNavbar } from '@/components/Navbar/MainNavbar';
import Footer from '@/components/Footer/Footer';
import { GetMe } from '@/pages/api/auth/auth';
import { useRouter } from 'next/router';
import User_Sidebar from '../components/Sidebar/Sidebar';
import { UserContext } from '@/context/user';
import { WsProvider, UserSocket } from '@/context/WsContext';
import FirstTimeModal from '@/components/Modals/FIrstTImeModal';
import {
  Button,
  Group,
  MantineProvider,
  Stack,
  Text,
  Modal,
  MantineThemeOverride,
} from '@mantine/core';
import Theme from '../config/theme';
import { Notifications, notifications } from '@mantine/notifications';

export default function App({ Component, pageProps }: AppProps) {
  let user = useContext(UserContext);
  const [show, setShow] = useState(true);
  const [IMuser, setUser] = useState<any>({});
  const [isTwoFactorAuth, setIsTwoFactorAuth] = useState(false);
  const [Token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    setToken(token);

    if (token) {
      setShow(false);
      GetMe()
        .then((res) => {
          user.data = res.body;
          setUser(res.body);

          if (res.status !== 200) {
            UserSocket?.disconnect();
            localStorage.removeItem('jwtToken');
            router.push('/');
          }
        })
        .catch((err) => {});
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
            setUser(res.body);

            if (res.status !== 200) {
              UserSocket?.disconnect();
              localStorage.removeItem('jwtToken');
              router.push('/');
            }
          })
          .catch((err) => {});
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

  useEffect(() => {
    UserSocket?.on('NewRequestNotification', (name) => {
      notifications.show({
        id: 'NewRequestNotification',
        title: 'New Request',
        message: 'You have a new request from ' + name,
        color: 'green',
        bg: 'gray',
        radius: 'md',
        // icon: <BiSolidUserPlus />,
        autoClose: 5000,
      });
    });

    UserSocket?.on('CandelFriendReq', (name) => {
      if (name !== 'CanceledfrmSender') {
        notifications.show({
          id: 'CandelFriendReq',
          title: 'Friend Request Canceled',
          message: name + ' canceled your friend request',
          color: 'red',
          radius: 'md',
          bg: 'gray',

          // icon: <BiSolidUserPlus />,
          autoClose: 5000,
        });
      }
    });

    UserSocket?.on('AcceptFriendReq', (name) => {
      notifications.show({
        id: 'AcceptFriendReq',
        title: 'Friend Request Accepted',
        message: name + ' accepted your friend request',
        color: 'green',
        radius: 'md',
        bg: 'gray',

        // icon: <BiSolidUserPlus />,
        autoClose: 5000,
      });
    });

    return () => {
      UserSocket?.off('NewRequestNotification');
      UserSocket?.off('CandelFriendReq');
    };
  }, []);

  return (
    <>
      {IMuser?.isFirstTime && <FirstTimeModal />}
      <MantineProvider theme={Theme} withGlobalStyles withNormalizeCSS>
        <Notifications position="top-right" />
        <WsProvider token={Token}>
          <NextUIProvider>
            <UserContext.Provider value={user}>
              {show && !isTwoFactorAuth && <MainNavbar />}
              {!show && <User_Sidebar />}
              <Component
                {...pageProps}
                setIsTwoFactorAuth={setIsTwoFactorAuth}
              />
            </UserContext.Provider>
          </NextUIProvider>
        </WsProvider>
      </MantineProvider>
    </>
  );
}
