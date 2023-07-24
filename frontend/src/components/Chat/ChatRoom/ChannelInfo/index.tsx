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
import { AddMember } from './AddMember';
import { ListMembers } from './ListMembers';
interface Member {
  id: number;
  nickname: string;
  isOwner: boolean;
  user:{
    id: number;
    imgProfile: string;
  }
}


function ChannelInfo() {
  const chatContext = useContext(ChatContext);
  const jwtToken = localStorage.getItem('jwtToken');
  const userContext = useContext(UserContext);
  const theme = useMantineTheme();
  const [members, setMembers]: [Member[], any] = useState([]);
  useEffect(() => {
    request
      .get(`http://localhost:4400/api/chat/channel/members`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .query({ id: chatContext.data.id })
      .then((res) => {
        setMembers(res.body);
        console.log(res.body);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [chatContext.data]);
  function deleteUser() {
    request
      .post('http://localhost:4400/api/chat/channel/delete')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ id: chatContext.data.id })
      .catch((err) => {
        return err;
      });
  }
  function leaveChannel() {
    request
      .post('http://localhost:4400/api/chat/channel/leave')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({id : chatContext.data.id })
      .then((res)=>{
        chatContext.data = undefined!;
      })
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
        <ListMembers members={members} />
      </Flex>
    </Box>
  );
}
export default ChannelInfo;
