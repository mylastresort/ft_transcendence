import { Container, Text, Box, MediaQuery, Button, Modal } from '@mantine/core';
import UserInfo from './UserInfo';
import MsgList from './MsgList';
import { useContext, useState } from 'react';
import { ChatContext } from '@/context/chat';
import ChatInput from './ChatInput';
import ChannelInfo from './ChannelInfo';
import { ListPublicChannels } from './ListPublicChannels';
import { RoomHead } from './RoomHead';
import { useMediaQuery } from '@mui/material';

interface Props {
  width: string | number | undefined;
}

function ChatRoom({ isChannel = false }) {
  const matches = useMediaQuery('(min-width:1000px)');
  console.log(matches);
  const chatContext = useContext(ChatContext);
  return chatContext.data ? (
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

            <RoomHead>{isChannel ? <ChannelInfo /> : <UserInfo />}</RoomHead>
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
          {isChannel ? <ChannelInfo /> : <UserInfo />}
        </Box>
      </MediaQuery>
    </>
  ) : (
    <ListPublicChannels />
  );
}

export default ChatRoom;
