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

function ChatList({ width }: Props) {
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
  const getWidth = (): number => {
    return opened ? 350 : 60;
  };

  return (
    <>
        <Burger opened={opened} onClick={toggle} aria-label={'burger'} />
      <Transition
        mounted={opened}
        transition={'scale-x'}
        duration={600}
        timingFunction="ease"
      >
        {(styles) => (
          <Navbar
          height={'calc(100vh - 77px)'}
          p="xs"
          w={opened ? 350 : 60}
          style={{ ...styles, top: 0, left: 0, right: 0, height: 400 }}
          >
            <Navbar.Section>
            </Navbar.Section>
            <Navbar.Section mt="xs">
              <Group noWrap>
                <CreateChannel context={user} />
                <SearchUser />
              </Group>
            </Navbar.Section>
            <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
              <RoomsList rooms={rooms}></RoomsList>
            </Navbar.Section>

            {/* <Navbar.Section >no footer for now</Navbar.Section > */}
          </Navbar>
        )}
      </Transition>
    </>
  );
}

export default ChatList;
