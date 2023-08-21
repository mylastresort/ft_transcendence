import { Navbar, ScrollArea, Burger, Tabs, Button } from '@mantine/core';
import { useDisclosure, useClickOutside } from '@mantine/hooks';
import { useContext, useEffect, useState } from 'react';
import request from 'superagent';
import { UserContext } from '@/context/user';
import { CreateChannel } from './CreateChannel';
import { SearchUser } from './SearchUser';
import { ChannelCard, UserCard } from './Card';
import { Search } from 'tabler-icons-react';
import { ChatContext } from '@/context/chat';
import Link from 'next/link';
import { ChatSocketContext } from '@/context/chatSocketContext';
import { UserSocket } from '@/context/WsContext';

export function RoomsList({ closeNav }: any) {
  const jwtToken = localStorage.getItem('jwtToken');
  const [channelsList, setChannelsList] = useState([]);
  const [privateChatList, setPrivateChatList] = useState([]);
  const [update, setUpdate] = useState(true);
  const socket = useContext(ChatSocketContext);
  useEffect(() => {
    request
      .get('http://10.13.1.7:4400/api/chat/channel/me')
      .set('Authorization', `Bearer ${jwtToken}`)
      .then((res) => {
        setChannelsList(res.body);
      })
      .catch((err) => {
        return err;
      });
    request
      .get('http://10.13.1.7:4400/api/chat/private')
      .set('Authorization', `Bearer ${jwtToken}`)
      .then((res) => {
        setPrivateChatList(res.body);
      })
      .catch((err) => {
        return err;
      });
  }, [update]);
  useEffect(() => {
    UserSocket.on('BlockedEvent', (data) => {
      setUpdate((state) => !state);
    });
    socket.on('updateChannel', (data) => {
      setUpdate((state) => !state);
    });
    return () => {
      socket.off('updateChannel');
      UserSocket.off('BlockedEvent');
    };
  }, []);

  return (
    <Tabs defaultValue="channels">
      <Tabs.List>
        <Tabs.Tab value="channels">Channels</Tabs.Tab>
        <Tabs.Tab value="messages">Messages</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="channels" pt="xs">
        <ScrollArea h={'calc(100vh - 200px)'} mt={20} w={'100%'}>
          <CreateChannel />
          {channelsList.map((channel: any) => (
            <div key={channel.id}>
              <ChannelCard
                key={channel.id}
                channel={channel}
                closeNav={closeNav}
              />
            </div>
          ))}
        </ScrollArea>
      </Tabs.Panel>

      <Tabs.Panel value="messages" pt="xs">
        <ScrollArea h={'calc(100vh - 200px)'} mt={20} w={'100%'}>
          <SearchUser />
          {privateChatList.map((chat: any) => (
            <div key={chat.id}>
              <UserCard user={chat} closeNav={closeNav} />
            </div>
          ))}
        </ScrollArea>
      </Tabs.Panel>
    </Tabs>
  );
}

function ChatNav() {
  const chatContext = useContext(ChatContext);
  const [opened, { toggle }] = useDisclosure(true);
  const ref = useClickOutside(() => {
    opened ? toogleNav() : false;
  });

  function toogleNav() {
    document.querySelector('#chat-nav')?.classList.toggle('close-nav');
    toggle();
  }

  return (
    <>
      <Navbar
        ref={ref}
        zIndex={2}
        id="chat-nav"
        h={'100%'}
        p="xs"
        w={350}
        maw={'calc(100vw - 88px)'}
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
        <Navbar.Section className="nav-child" grow>
          <RoomsList closeNav={toogleNav}></RoomsList>
        </Navbar.Section>
        <Navbar.Section pos={'absolute'} right={5} bottom={10}>
          <Link href={'/chat'}>
            <Button
              color="var(--chat-red-color)"
              h={45}
              w={45}
              p={0}
              radius={50}
              onClick={() => {
                chatContext.data = undefined!;
              }}
            >
              <Search size="30px" />
            </Button>
          </Link>
        </Navbar.Section>
      </Navbar>
    </>
  );
}

export default ChatNav;
