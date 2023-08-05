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

interface UserInfo{
  id: number;
  firstName: string;
  lastName: string;
  sammary: string;
  status: string;
}

function UserInfo() {
  const jwtToken = localStorage.getItem('jwtToken');
  const chatContext = useContext(ChatContext);
  const userContext = useContext(UserContext);
  const theme = useMantineTheme();
  const [userInfo, setUserInfo] = useState({} as UserInfo);
  console.log(chatContext.data);
  const online = userInfo.status == 'online'
  function deleteUser() {
    request
      .post('http://localhost:4400/api/chat/private/delete')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ id: chatContext.data.id })
      .catch((err) => {
        return err;
      });
  }

  useEffect(() => {
    request
      .get(`http://localhost:4400/api/chat/user/${chatContext.data.name}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .then((res) => {
        setUserInfo(res.body);
        console.log('user Info: ', res.body);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Box w={'100%'} h={'100%'} bg={theme.colors.dark[6]} pt={100}>
      <Flex direction={'column'} gap={10}>
        <Avatar
          m={'auto'}
          radius={500}
          size={150}
          style={{
            border: '4px solid',
            borderColor: online ? 'green' : 'red',
          }}
          src={chatContext.data.img}
        />
        <Text fw={500} size={'xl'} m={'auto'}>
          {chatContext.data.name}
        </Text>
        <Box
         w={'80%'}
         m={'auto'}
         mt={40}
         mih={100}
         p={10}
          style={{
            border: '1px solid var(--secondary-color)',
            borderRadius: '20px',
          }}
        >
          <Text>
            {userInfo.sammary}
          </Text>
        </Box>
        <Box
         w={'80%'}
         m={'auto'}
         mt={50}
        >
        <Link
          href={'/chat'}
          style={{
            margin: 'auto',
          }}
        >
          <Link href={`/profile/${chatContext.data.name}`}>
            <Button mr={'10%'} w={'45%'} color="blue">View Profile</Button>
          </Link>
          <Link href={`/game/invite?userId=${userInfo.id}`}>
            <Button w={'45%'} color="blue">Invite to Play</Button>
          </Link>
          <Button
            color="red"
            mt={40}
            w={'100%'}
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
