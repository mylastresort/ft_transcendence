import { useContext, useEffect, useState } from 'react';
import { Button, Container, Flex, Grid } from '@mantine/core';
import { useElementSize, useMediaQuery } from '@mantine/hooks';
import ChatNav from '@/components/Chat/ChatNav';
import Styles from './Chat.module.css';

export default function Chat(ChatRoom) {
  return () => {
    return (
      <Flex className={Styles.chat} gap={0} align="stretch" pos={'relative'}>
        <ChatNav />
        <ChatRoom />
      </Flex>
    );
  };
}
