import { ChatContext } from '@/context/chat';
import { UserContext } from '@/context/user';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  useMantineTheme,
} from '@mantine/core';
import Link from 'next/link';
import { useContext } from 'react';
import request from 'superagent';
import { AddMember } from './AddMember';
import { ListMembers } from './ListMembers';

function ChannelInfo() {
  const chatContext = useContext(ChatContext);
  const userContext = useContext(UserContext);
  const theme = useMantineTheme();
  function deleteUser() {
    const jwtToken = localStorage.getItem('jwtToken');
    request
      .post('http://localhost:4400/api/chat/channel/delete')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ id: chatContext.data.id })
      .catch((err) => {
        return err;
      });
  }
  function leaveChannel() {
    const jwtToken = localStorage.getItem('jwtToken');
    console.log("leave");
    request
      .post('http://localhost:4400/api/chat/channel/leave')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ id: userContext.data.id, chId: chatContext.data.id })
      .catch((err) => {
        return err;
      });
  }
  return (
    <Box w={'100%'} h={'100%'} bg={theme.colors.dark[6]} pt={100}>
      <Flex direction={'column'} gap={10}>
        <Avatar
          m={'auto'}
          radius={500}
          size={150}
          style={{
            border: '3px solid',
            borderColor: theme.colors.dark[1],
          }}
          src={chatContext.data.img}
        />
        <Text fw={500} size={'xl'} m={'auto'}>
          {chatContext.data.name}
        </Text>
        <Link
          href={'/chat'}
          style={{
            margin: 'auto',
          }}
        >
          {chatContext.data.ownerId == userContext.data.id && (
            <Button
              color="red"
              w={300}
              onClick={() => {
                deleteUser();
              }}
            >
              delete conversation
            </Button>
          )}
        </Link>
        <Link
          href={'/chat'}
          style={{
            margin: 'auto',
          }}
        >
          <Button
            m={'auto'}
            w={300}
            onClick={() => {
              leaveChannel();
            }}
            color='red'
          >
            Leave Channel
          </Button>
        </Link>
        <AddMember />
        <ListMembers />
      </Flex>
    </Box>
  );
}
export default ChannelInfo;
