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
import { useContext, useEffect, useState } from 'react';
import request from 'superagent';
import { AddMember } from './ChannelSettings/AddMember';
import { ListMembers } from './ListMembers';
import { ChannelSettings } from './ChannelSettings';

interface Member {
  id: number;
  nickname: string;
  isOwner: boolean;
  isAdministator: boolean;
  isMuted: boolean;
  user: {
    id: number;
    imgProfile: string;
  };
}

function ChannelInfo({action}) {
  const chatContext = useContext(ChatContext);
  const userContext = useContext(UserContext);
  const jwtToken = localStorage.getItem('jwtToken');
  const theme = useMantineTheme();
  const [members, setMembers]: [Member[], any] = useState([]);
  const [channel, setChannel] = useState();
  useEffect(() => {
    request
      .get('http://localhost:4400/api/chat/channel')
      .set('Authorization', `Bearer ${jwtToken}`)
      .query({ id: chatContext.data.id })
      .then((res) => {
        setMembers(res.body.members);
        setChannel(res.body);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [chatContext.data]);

  useEffect(() => {
    request
      .get('http://localhost:4400/api/chat/channel/members')
      .set('Authorization', `Bearer ${jwtToken}`)
      .query({ id: chatContext.data.id })
      .then((res) => {
        setMembers(res.body);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [action]);
  function leaveChannel() {
    request
      .post('http://localhost:4400/api/chat/channel/leave')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ id: chatContext.data.id })
      .then((res) => {
        chatContext.data = undefined!;
      })
      .catch((err) => {
        return err;
      });
  }
  return (
    <Flex direction={'column'} w={'100%'} h={'100%'} bg={theme.colors.dark[6]}>
      <Flex direction={'column'} mt={40} gap={10}>
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
        <Text
          maw={300}
          p={15}
          m={'auto'}
          color="dimmed"
          style={{
            border: '1px solid var(--chat-red-color)',
            borderRadius: '10px',
          }}
        >
          this is description this is description this is description this is
          description this is description
        </Text>
      </Flex>
      <ListMembers members={members} />
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
          color="red"
        >
          Leave Channel
        </Button>
      </Link>
      {chatContext.data.me?.isAdministator && (
        <>
          <AddMember />
          <ChannelSettings channel={channel} members={members} />
        </>
      )}
    </Flex>
  );
}
export default ChannelInfo;
