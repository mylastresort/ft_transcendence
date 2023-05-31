import { useContext, useState } from 'react';
import { Button, Container, Flex, Grid } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import ChatList from './_chatList';
import MainChat from './_main';
import UserInfo from './_info';
import { UserContext } from '@/context/user';

function Chat() {
  // const { width, height } = useElementSize();

  const user = useContext(UserContext);
  return (
    <Flex
    gap={0}
    align= 'stretch' 
    style={{
      height: '100vh',
      width: '100%',
    }}>
      <ChatList width="25%" />
      <MainChat width="50%" />
      <UserInfo width="25%" />
    </Flex>
  );
}

export default Chat;
