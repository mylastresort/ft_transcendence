import { useState } from 'react';
import { Button, Container, Flex, Grid } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import SideBar from './_sideBar';
import MainChat from './_main';
import UserInfo from './_info';

function Chat() {
  // const { width, height } = useElementSize();
  return (
    <Flex
    gap={0}
    align= 'stretch' 
    style={{
      height: '100vh',
      width: '100%',
      maxWidth: '100%',
    }}>
      <SideBar width="25%" />
      <MainChat width="50%" />
      <UserInfo width="25%" />
    </Flex>
  );
}

export default Chat;
