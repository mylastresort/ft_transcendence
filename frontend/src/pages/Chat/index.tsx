import { useContext, useState } from 'react';
import { Button, Container, Flex, Grid } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import ChatList from '@/components/Chat/ChatList';
import MainChat from '@/components/Chat/ChatMassages';
import UserInfo from '@/components/Chat/ChatInfo';
import { UserContext } from '@/context/user';
import Styles from './Chat.module.css';
import withAuth from '@/pages/lib/withAuth';

function Chat() {
  const user = useContext(UserContext);
  return (
    <Flex className={Styles.chat} gap={0} align="stretch">
      <ChatList width="25%" />
      <MainChat width="50%" />
      <UserInfo width="25%" />
    </Flex>
  );
}

export default withAuth(Chat);
