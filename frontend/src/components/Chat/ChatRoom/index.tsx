import { Container, Text, Box, MediaQuery, Button, Modal } from '@mantine/core';
import UserInfo from './UserInfo';
import MsgList from './MsgList';
import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '@/context/chat';
import ChatInput from './ChatInput';
import ChannelInfo from './ChannelInfo';
import { ListPublicChannels } from './ListPublicChannels';
import { RoomHead } from './RoomHead';
import {io, Socket} from 'socket.io-client'
import { useMediaQuery } from '@mui/material';
import { ChatSocketContext } from '@/context/chatSocketContext';
import { useRouter } from 'next/router';
import { notifications } from '@mantine/notifications';
import { UserContext } from '@/context/user';

interface Props {
  width: string | number | undefined;
}

function ChatRoomContent({ isChannel = false }) {
  const matches = useMediaQuery('(min-width:1000px)');
  const socket = useContext(ChatSocketContext);
  const chatContext = useContext(ChatContext);
  const userContext = useContext(UserContext);
  const route = isChannel ? 'channel' : 'private';
  const [action, setAction] = useState('');

  useEffect(()=>{
    const roomName = isChannel ? chatContext.data.name : chatContext.data.id;

    socket.emit(`${route}/join-room`, roomName);

    return () => {
      socket.emit(`${route}/leave-room`, roomName);
    };
  }, [chatContext.data])

  const router = useRouter();
  useEffect(()=>{
    socket.on('action', (res)=>{
      console.log('action ...', res.action);
      if (res.target == userContext.data.username && res.action != 'added to channel'){
        chatContext.data = undefined!;
        router.push('/chat');
        notifications.show({
          title: `You have been ${res.action}!`,
          message: '',
          color: 'red',
        });
      }else{
        setAction(res.action);
        notifications.show({
          title: `${res.target} has been ${res.action}!`,
          message: '',
          color: 'red',
        });
      }
    });
    return ()=>{
      socket.off('action');
    };
  }, [route])

  return (
    <>
      <MediaQuery smallerThan={1000} styles={{ width: 'calc(100% - 77px)' }}>
        <Box
          bg={'#EAEAEA'}
          h={'calc(100vh - 78px)'}
          w={'calc(70% - 55px)'}
          pl={55}
        >
          <MediaQuery largerThan={1000} styles={{ display: 'none' }}>
            <div>
              <RoomHead>{isChannel ? <ChannelInfo action={action} /> : <UserInfo />}</RoomHead>
            </div>
          </MediaQuery>
          <MsgList
            h={`calc(100% - 78px - ${matches ? 0 : 70}px)`}
            isChannel={isChannel}
          />
          <ChatInput isChannel={isChannel} />
        </Box>
      </MediaQuery>
      <MediaQuery smallerThan={1000} styles={{ display: 'none' }}>
        <Box bg={'#EAEAEA'} w={'calc(30% - 33px)'}>
          {isChannel ? <ChannelInfo action={action} /> : <UserInfo />}
        </Box>
      </MediaQuery>
    </>
  );
}

function ChatRoom({ isChannel = false }) {
  const chatContext = useContext(ChatContext);
  if (chatContext.data){
    return <ChatRoomContent isChannel={isChannel} />;
  } else {
    return <ListPublicChannels />;
  }
}

export default ChatRoom;
