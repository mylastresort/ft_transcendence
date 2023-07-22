import { ChatContext } from '@/context/chat';
import {
  Avatar,
  Box,
  Group,
  List,
  ScrollArea,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { User } from '@nextui-org/react';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { UserCard } from './UserCard';
import request from 'superagent';

interface ChannelData {
  ChannelPassword: null;
  channelName: 'The 1337 party';
  createdAt: '2023-07-22T07:25:02.824Z';
  description: 'this is my first created chat';
  id: 2;
  image: 'https://iintra.freekb.es/banners/mbenkhat-1670055933.jpeg';
  ownerId: 13;
  updateAt: '2023-07-22T07:25:02.824Z';
}

function ChannelCard({ channel, closeNav }: {channel: ChannelData, closeNav: any}) {
  const [bgColor, setBgColor] = useState('var(--white-color)');
  return (
    <Link href={'/chat/channels'}>
      <Box
        maw={300}
        mx="auto"
        onMouseOver={() => {
          setBgColor('var(--chat-red-color)');
        }}
        onMouseLeave={() => {
          setBgColor('var(--white-color)');
        }}
        style={{
          cursor: 'pointer',
          backgroundColor: bgColor,
          borderRadius: '10px',
          border: '2px solid',
          borderColor: 'var(--chat-red-color)',
          padding: '10px',
          margin: '15px auto',
          marginTop: '0px',
        }}
        onClick={closeNav}
      >
        <Group noWrap h={60}>
          <Avatar
            radius={50}
            size={60}
            src={channel.image}
          />
          <div>
            <Text size="lg">{channel.channelName}</Text>
            <Text size="xs" color="dimmed">
              this is last message
            </Text>
          </div>
        </Group>
      </Box>
    </Link>
  );
}

export function RoomsList({ closeNav }: any) {
  const jwtToken = localStorage.getItem('jwtToken');
  const [chatList, setchatList] = useState([]);
  // const [channels, setchannels] = useState([]);
  // useEffect(() => {
    // }, []);
    useEffect(() => {
      request
        .get('http://localhost:4400/api/chat/private')
        .set('Authorization', `Bearer ${jwtToken}`)
        .then((res) => setchatList(res.body))
        .catch((err) => {
          return err;
        });
    request
      .get('http://localhost:4400/api/chat/channel')
      .set('Authorization', `Bearer ${jwtToken}`)
      .then((res) => setchatList(chatList.concat(res.body)))
      .catch((err) => {
        return err;
      });
  }, []);

  return (
    // <ScrollArea h={'calc(100% - 200px)'} mt={20}>
    //   {PrivateChats.map((room: any) => (
    //     <>
    //       <UserCard
    //         user={room}
    //         closeNav={closeNav}
    //       />
    //     </>
    //   ))}
    // </ScrollArea>
    // <ScrollArea h={'calc(100% - 200px)'} mt={20}>
    //   {chatList.map((chat: any) => (
    //     <>
    //       <ChannelCard channel={chat} closeNav={closeNav} />
    //     </>
    //   ))}
    // </ScrollArea>
    <Group>
      <Button>channels</Button>
      <Button>channels</Button>
    </Group>
  );
}
