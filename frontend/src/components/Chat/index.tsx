import { useContext, useEffect, useMemo, useState } from 'react';
import { Box, Button, Container, Flex, Grid } from '@mantine/core';
import { useElementSize, useMediaQuery } from '@mantine/hooks';
import ChatNav from '@/components/Chat/ChatNav';
import { User, UserContext } from '@/context/user';
import { GetMe } from '@/pages/api/auth/auth';


export default function Chat(ChatRoom) {
  return () => {
    const [user, setUser] = useState({} as User);
    useEffect(() => {
      GetMe()
        .then((res) => {
          setUser({ data: res.body });
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
    return (
      <UserContext.Provider value={user}>
        <Box
          sx={(theme) => ({
            position: 'absolute',
            background: 'red',
            width: 'calc(100% - 88px)',
            height: 'calc(100% - 77px)',
            top: '76px',
            left: '88px',
          })}>
          <ChatNav />
          <ChatRoom />
        </Box>
      </UserContext.Provider>
    );
  };
}
