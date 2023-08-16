import { Container, Text, Box, MediaQuery, Button, Modal } from '@mantine/core';
import UserInfo from './UserInfo';
import MsgList from './MsgList';
import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '@/context/chat';
import ChatInput from './ChatInput';
import ChannelInfo from './ChannelInfo';
import { ListPublicChannels } from './ListPublicChannels';
import { RoomHead } from './RoomHead';
import { io, Socket } from 'socket.io-client';
import { useMediaQuery } from '@mui/material';
import { ChatSocketContext } from '@/context/chatSocketContext';
import { useRouter } from 'next/router';
import { notifications } from '@mantine/notifications';
import { UserContext } from '@/context/user';

function ChatRoomContent({ isChannel = false }) {
  const matches = useMediaQuery('(min-width:1000px)');
  const socket = useContext(ChatSocketContext);
  const chatContext = useContext(ChatContext);
  const userContext = useContext(UserContext);
  const route = isChannel ? 'channel' : 'private';
  const [action, setAction] = useState('');

  useEffect(() => {
    const roomName = isChannel ? chatContext.data.name : chatContext.data.id;

    socket.emit(`${route}/join-room`, roomName);

    return () => {
      socket.emit(`${route}/leave-room`, roomName);
    };
  }, [chatContext.data]);

  const router = useRouter();
  useEffect(() => {
    socket.on('action', (res) => {
      console.log('action ...', res.action);
      if (!userContext.data) {
        chatContext.data = undefined!;
        router.push('/chat');
      } else if (res.target == userContext.data.username) {
        chatContext.data = undefined!;
        router.push('/chat');
        notifications.show({
          title: `You have been ${res.action}!`,
          message: '',
          color: 'red',
        });
      } else {
        setAction(res.action);
        notifications.show({
          title: `${res.target} has been ${res.action}!`,
          message: '',
          color: 'red',
        });
      }
    });
    return () => {
      socket.off('action');
    };
  }, [route]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'blue',
      }}
    >
      <div
        style={{
          display: 'flex',
        }}
      >
        <Box
          sx={(theme) => ({
            height: 'calc(100vh - 77px)',
            background: '#EAEAEA',
            paddingLeft: '55px',
            width: matches ? '70%' : '100%',
          })}
        >
          {!matches && (
            <RoomHead>
              {isChannel ? <ChannelInfo action={action} /> : <UserInfo />}
            </RoomHead>
          )}
          <MsgList h={`calc(100% - ${matches ? 87 : 167}px)`} isChannel={isChannel} />
          <ChatInput isChannel={isChannel} />
        </Box>
        {matches && (
          <Box
            sx={(theme) => ({
              height: 'calc(100vh - 77px)',
              width: '30%',
            })}
          >
            {isChannel ? <ChannelInfo action={action} /> : <UserInfo />}
          </Box>
        )}
      </div>
    </div>
  );
}

function ChatRoom({ isChannel = false }) {
  const chatContext = useContext(ChatContext);
  if (chatContext.data) {
    return <ChatRoomContent isChannel={isChannel} />;
  } else {
    return <ListPublicChannels />;
  }
}

export default ChatRoom;
