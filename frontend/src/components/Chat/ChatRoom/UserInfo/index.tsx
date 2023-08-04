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
import { useContext, useEffect } from 'react';
import request from 'superagent';

function UserInfo() {
  const chatContext = useContext(ChatContext);
  const theme = useMantineTheme();
  console.log(chatContext.data);
  function deleteUser() {
    const jwtToken = localStorage.getItem('jwtToken');
    request
      .post('http://localhost:4400/api/chat/private/delete')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ id: chatContext.data.id })
      .catch((err) => {
        return err;
      });
  }

  useEffect(()=>{
    
  }, [])
  return (
    <Box w={'100%'} h={'100%'} bg={theme.colors.dark[6]} pt={100}>
      <Flex direction={'column'} gap={10} style={{
        border: '1px solid var(--secondary-color)',
        borderRadius: '20px'
      }}>
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
        <Link href={'/chat'} style={{
          margin:'auto'
        }}>
          <Link href={`/profile/${chatContext.data.name}`}>
          <Button color="blue">
            View Profile
          </Button>
          </Link>
          <Button
            color="red"
            
            w={300}
            onClick={() => {
              deleteUser();
            }}
            >
            delete conversation
          </Button>
          </Link>
        <Button
          href={`/game/invite?user=${chatContext.data.name}`}
          component={Link}
          mx="1.55rem"
        >
          Invite
        </Button>
      </Flex>
    </Box>
  );
}
export default UserInfo;
