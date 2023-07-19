import {
  Grid,
  Center,
  Title,
  Avatar,
  Box,
  Text,
  Container,
  Navbar,
  ScrollArea,
  Group,
  Burger,
  Transition,
} from '@mantine/core';
import { User } from '@nextui-org/react';
import { useHover, useMediaQuery, useDisclosure } from '@mantine/hooks';
import { useContext, useEffect, useState } from 'react';
import request from 'superagent';
import { UserContext } from '@/context/user';
import { CreateChannel } from './CreateChannel';
import { RoomsList } from './RoomsList';
import { SearchUser } from './SearchUser';
interface Props {
  width: string | number | undefined;
}

interface User {
  name: string;
  img: string;
  lastmsg: string;
}

function ChatNav({ width, isVisible }: any) {
  const matches = useMediaQuery('(min-width: 1200px)');
  let selectedState = useState(1);
  const [selected, setSelected] = selectedState;
  const [rooms, setRooms] = useState([]);
  const user = useContext(UserContext);

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    request
      .get('http://localhost:4400/api/chat')
      .set('Authorization', `Bearer ${jwtToken}`)
      .then((res) => setRooms(res.body))
      .catch((err) => {
        return err;
      });
  }, []);
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <>
      <Navbar zIndex={1} id='chat-nav' height={'calc(100vh - 77px)'} p="xs" w={350} pos={'relative'}>
        <Navbar.Section>
          <Burger
          id='nav-burger'
          pos={'absolute'}
          right={10}
            opened={opened}
            onClick={() => {
              document.querySelector('#chat-nav')?.classList.toggle('close-nav')
              toggle()
            }}
            aria-label={'burger'}
          />
        </Navbar.Section >
        <Navbar.Section className='nav-child' mt="xs" pt={60}>
          <Group noWrap>
            <CreateChannel context={user} />
            <SearchUser />
          </Group>
        </Navbar.Section>
        <Navbar.Section className='nav-child' grow component={ScrollArea} mx="-xs" px="xs">
          <RoomsList rooms={rooms}></RoomsList>
        </Navbar.Section>

        {/* <Navbar.Section >no footer for now</Navbar.Section > */}
      </Navbar>
    </>
  );
}

export default ChatNav;
