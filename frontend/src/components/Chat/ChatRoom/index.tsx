import { Container, Text, Box, MediaQuery } from '@mantine/core';
import UserInfo from './UserInfo';
import MsgList from './MsgList';
import { useContext } from 'react';
import { ChatContext } from '@/context/chat';
import ChatInput from './ChatInput';

interface Props {
  width: string | number | undefined;
}


function ChatRoom() {
  const chatContext = useContext(ChatContext);
  return(
    chatContext.data ?
    <>
      <MediaQuery smallerThan={1000} styles={{ width: 'calc(100% - 77px)' }}>
        <Box bg={'#EAEAEA'} w={'calc(70% - 55px)'}pl={55}>
          <MsgList />
          <ChatInput />
        </Box>
      </MediaQuery>
      <MediaQuery smallerThan={1000} styles={{ display: 'none' }}>
        <Box bg={'#EAEAEA'} w={'calc(30% - 33px)'}>
          <UserInfo />
        </Box>
      </MediaQuery>
    </>
      : <></>
  )
}

export default ChatRoom;

