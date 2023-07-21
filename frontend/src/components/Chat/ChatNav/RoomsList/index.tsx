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
import { useContext, useState } from 'react';
import { UserCard } from './UserCard';




function ChannelCard({ user, closeNav }: any) {
  const [bgColor, setBgColor] = useState('var(--white-color)');
  return (
    <Link href={'/chat/channels'}>
      <Box
        maw={300}
        mx="auto"
        onMouseOver={() => {
          setBgColor('red');
        }}
        onMouseLeave={() => {
          setBgColor('var(--white-color)');
        }}
        style={{
          cursor: 'pointer',
          backgroundColor: bgColor,
          borderRadius: '10px',
          border: '2px solid',
          borderColor: 'red',
          padding: '10px',
          margin: '15px auto',
          marginTop: '0px',
        }}
      >
        <Group noWrap h={60}>
          <Avatar
            radius={50}
            size={60}
            src={'https://cdn-icons-png.flaticon.com/512/3772/3772059.png'}
          />
          <div>
            <Text size="lg">{user.name}</Text>
            <Text size="xs" color="dimmed">
              user.Messages[0].content
            </Text>
          </div>
        </Group>
      </Box>
    </Link>
  );
}

export function RoomsList({ rooms, setCardSelected, closeNav }: any) {
  return (
    <ScrollArea h={'calc(100% - 200px)'} mt={20}>
      {rooms.map((room: any) => (
        <>
          <UserCard
            user={room}
            setCardSelected={setCardSelected}
            closeNav={closeNav}
          />
        </>
      ))}
    </ScrollArea>
  );
}
