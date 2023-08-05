import { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Container, Flex, Grid } from '@mantine/core';
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
        <Flex
          h={'calc(100vh - 78px)'}
          w={'100%'}
          style={{
            position: 'absolute',
            top: '76px',
            left: '88px',
          }}
          gap={0}
          align="stretch"
          pos={'relative'}
        >
          <ChatNav />
          <ChatRoom />
        </Flex>
      </UserContext.Provider>
    );
  };
}
