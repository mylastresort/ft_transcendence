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
import { UserSocket } from '@/context/WsContext';
import request from 'superagent';

function ChatRoomContent({ isChannel = false }) {
  const jwtToken = localStorage.getItem('jwtToken');
  const matches = useMediaQuery('(min-width:1000px)');
  const socket = useContext(ChatSocketContext);
  const chatContext = useContext(ChatContext);
  const userContext = useContext(UserContext);
  const route = isChannel ? 'channel' : 'private';
  const [action, setAction] = useState('');
  const router = useRouter();


  useEffect(() => {
    isChannel && request
    .get(process.env.BACKEND_DOMAIN + '/api/chat/channel/members/me')
    .set('Authorization', `Bearer ${jwtToken}`)
    .query({ id: chatContext.data.id })
    .catch((err) => {
      router.push('/chat');
      notifications.show({
        title: `You can't join this channel`,
        message: '',
        color: 'red',
      });
      console.log(err);
    });

    const roomName = isChannel ? chatContext.data.name : chatContext.data.id;

    socket.emit(`${route}/join-room`, roomName);

    return () => {
      socket.emit(`${route}/leave-room`, roomName);
    };
  }, [chatContext.data]);

  useEffect(() => {
    UserSocket.on('BlockedEvent', (data) => {
      if (!isChannel && chatContext.data.memberId == data) {
        notifications.show({
          title: `You have been blocked by ${chatContext.data.name}!`,
          message: '',
          color: 'red',
        });
        router.push('/chat');
      }
    });
    socket.on('action', (res) => {
      console.log('action ...', res.action);
      if (res.target == userContext.data.username) {
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
      UserSocket.off('BlockedEvent');
    };
  }, [route, userContext, chatContext]);

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
          <MsgList
            h={`calc(100% - ${matches ? 77 : 147}px)`}
            isChannel={isChannel}
          />
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
