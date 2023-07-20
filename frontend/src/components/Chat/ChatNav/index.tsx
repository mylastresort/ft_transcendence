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
import {
  useHover,
  useMediaQuery,
  useDisclosure,
  useClickOutside,
} from '@mantine/hooks';
import { useContext, useEffect, useState } from 'react';
import request from 'superagent';
import { UserContext } from '@/context/user';
import { CreateChannel } from './CreateChannel';
import { RoomsList } from './RoomsList';
import { SearchUser } from './SearchUser';

function ChatNav({setCardSelected ,cardSelected} : any) {
  const matches = useMediaQuery('(min-width: 1200px)');
  let selectedState = useState(1);
  const [selected, setSelected] = selectedState;
  const [rooms, setRooms] = useState([]);
  const user = useContext(UserContext);
  const [opened, { toggle }] = useDisclosure(true);
  const ref = useClickOutside(() => {
    opened ? toogleNav() : false;
  });

  function toogleNav() {
    document.querySelector('#chat-nav')?.classList.toggle('close-nav');
    toggle();
    console.log(opened);
  }

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    request
      .get('http://localhost:4400/api/chat')
      .set('Authorization', `Bearer ${jwtToken}`)
      .then((res) => setRooms(res.body))
      .catch((err) => {
        return err;
      });
  }, [cardSelected]);

  return (
    <>
      <Navbar
        ref={ref}
        zIndex={1}
        id="chat-nav"
        height={'calc(100vh - 77px)'}
        p="xs"
        w={350}
        pos={'absolute'}
      >
        <Navbar.Section>
          <Burger
            id="nav-burger"
            pos={'absolute'}
            right={10}
            opened={opened}
            onClick={toogleNav}
            aria-label={'burger'}
          />
        </Navbar.Section>
        <Navbar.Section className="nav-child" mt="xs" pt={60}>
          <Group noWrap>
            <CreateChannel context={user} />
            <SearchUser setCardSelected={setCardSelected}/>
          </Group>
        </Navbar.Section>
        <Navbar.Section
          className="nav-child"
          grow
          component={ScrollArea}
          mx="-xs"
          px="xs"
        >
          <RoomsList rooms={rooms} setCardSelected={setCardSelected} closeNav={toogleNav}></RoomsList>
        </Navbar.Section>

      </Navbar>
    </>
  );
}

export default ChatNav;
