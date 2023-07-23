import { Navbar, ScrollArea, Burger, Tabs, Button } from '@mantine/core';
import { useDisclosure, useClickOutside } from '@mantine/hooks';
import { useContext, useEffect, useState } from 'react';
import request from 'superagent';
import { UserContext } from '@/context/user';
import { CreateChannel } from './CreateChannel';
import { SearchUser } from './SearchUser';
import { ChannelCard, UserCard } from './Card';

export function RoomsList({ closeNav, load }: any) {
  const jwtToken = localStorage.getItem('jwtToken');
  const [channelsList, setChannelsList] = useState([]);
  const [privateChatList, setPrivateChatList] = useState([]);
  useEffect(() => {
    request
      .get('http://localhost:4400/api/chat/channel')
      .set('Authorization', `Bearer ${jwtToken}`)
      .then((res) => {
        setChannelsList(res.body);
      })
      .catch((err) => {
        return err;
      });
    request
      .get('http://localhost:4400/api/chat/private')
      .set('Authorization', `Bearer ${jwtToken}`)
      .then((res) => {
        setPrivateChatList(res.body);
      })
      .catch((err) => {
        return err;
      });
  }, [load]);

  return (
    <Tabs defaultValue="channels">
      <Tabs.List>
        <Tabs.Tab value="channels">Channels</Tabs.Tab>
        <Tabs.Tab value="messages">Messages</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="channels" pt="xs">
        <ScrollArea h={'calc(100% - 200px)'} mt={20}>
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
        <ScrollArea h={'calc(100% - 200px)'} mt={20}>
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
  const user = useContext(UserContext);
  const [opened, { toggle }] = useDisclosure(true);
  const [load, setLoad] = useState(true);
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
        <Navbar.Section className="nav-child">
          <RoomsList closeNav={toogleNav} load={load}></RoomsList>
        </Navbar.Section>
        <Navbar.Section className="nav-child">
          <Button onClick={()=>setLoad(!load)} >load channels</Button>
        </Navbar.Section>
      </Navbar>
    </>
  );
}

export default ChatNav;
