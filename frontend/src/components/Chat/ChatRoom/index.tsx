import { Container, Text, Box, MediaQuery } from '@mantine/core';
import UserInfo from './UserInfo';
import MsgList from './MsgList';
import { useContext } from 'react';
import { ChatContext } from '@/context/chat';
import ChatInput from './ChatInput';
import ChannelInfo from './ChannelInfo';
import { ListPublicChannels } from './ListPublicChannels';

interface Props {
  width: string | number | undefined;
}

function ChatRoom({ isChannel = false }) {
  console.log("-----------",isChannel, "-----------")
  const chatContext = useContext(ChatContext);
  return chatContext.data ? (
    <>
      <MediaQuery smallerThan={1000} styles={{ width: 'calc(100% - 77px)' }}>
        <Box bg={'#EAEAEA'} w={'calc(70% - 55px)'} pl={55}>
          <MsgList isChannel={isChannel}/>
          <ChatInput isChannel={isChannel}/>
        </Box>
      </MediaQuery>
      <MediaQuery smallerThan={1000} styles={{ display: 'none' }}>
        <Box bg={'#EAEAEA'} w={'calc(30% - 33px)'}>
          {isChannel? <ChannelInfo />: <UserInfo/>}
        </Box>
      </MediaQuery>
    </>
  ) : (
    <ListPublicChannels/>
  );
}

export default ChatRoom;
