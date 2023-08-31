import { useContext, useEffect, useMemo, useState } from 'react';
import { Box, Button, Container, Flex, Grid } from '@mantine/core';
import { useElementSize, useMediaQuery } from '@mantine/hooks';
import ChatNav from '@/components/Chat/ChatNav';
import { User, UserContext } from '@/context/user';
import { GetMe } from '@/pages/api/auth/auth';
import { ChatSocketContext } from '@/context/chatSocketContext';
import { Socket, io } from 'socket.io-client';

export default function Chat(ChatRoom) {
  return () => {
    const [user, setUser] = useState({} as User);
    const jwtToken = localStorage.getItem('jwtToken');
    const chatSocketContext = io(`${process.env.BACKEND_DOMAIN}/ws/chat`, {
      extraHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    const [chatSocket, setChatSocket] = useState<Socket>(chatSocketContext);
    useEffect(() => {
      GetMe()
        .then((res) => {
          setUser({ data: res.body });
        })
        .catch((err) => {});
    }, []);

    useEffect(() => {
      if (!chatSocket.connected) {
        chatSocket.on('connect', () => {
          return;
        });
      }
      return () => {
        chatSocket && chatSocket.disconnect();
      };
    }, []);
    return (
      <UserContext.Provider value={user}>
        <ChatSocketContext.Provider value={chatSocket}>
          <Box
            sx={(theme) => ({
              position: 'absolute',
              width: 'calc(100% - 88px)',
              height: 'calc(100% - 77px)',
              top: '76px',
              left: '88px',
            })}
          >
            <ChatNav />
            <ChatRoom />
          </Box>
        </ChatSocketContext.Provider>
      </UserContext.Provider>
    );
  };
}
