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
import { MantineProvider } from '@mantine/core';
import Theme from './styles/theme';
import { WsContext } from '@/context/WsContext';
import { Notifications, notifications } from '@mantine/notifications';
import { BiSolidUserPlus } from 'react-icons/bi';

export default function App({ Component, pageProps }: AppProps) {
  let user = useContext(UserContext);
  const [show, setShow] = useState(true);
  const [isTwoFactorAuth, setIsTwoFactorAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    console.log(token);
    if (token) {
      setShow(false);
      GetMe()
        .then((res) => {
          user = res.body;
          if (res.status !== 200) {
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
      if (token) {
        setShow(false);
        GetMe()
          .then((res) => {
            user = res.body;
            if (res.status !== 200) {
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

  const UserSocket = useContext(WsContext);

  useEffect(() => {
    UserSocket.on('NewRequestNotification', (name) => {
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

    UserSocket.on('CandelFriendReq', (name) => {
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

    UserSocket.on('AcceptFriendReq', (name) => {
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
      UserSocket.off('NewRequestNotification');
      UserSocket.off('CandelFriendReq');
    };
  }, []);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={Theme}>
      <Notifications position="top-right" />
      <WsProvider value={UserSocket}>
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
