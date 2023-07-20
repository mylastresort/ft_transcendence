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
import { useContext, useState } from 'react';

function UserCard({ user, setCardSelected, closeNav }) {
  const [bgColor, setBgColor] = useState('var(--white-color)')
  const chatContext = useContext(ChatContext);
  console.log('usercard=>', user.members[0].imgProfile);
  return (
    <Box
      maw={300}
      mx="auto"
      onMouseOver={()=>{setBgColor('var(--secondary-color)')}}
      onMouseLeave={()=>{setBgColor('var(--white-color)')}}
      style={{
        cursor: 'pointer',
        backgroundColor: bgColor,
        borderRadius: '10px',
        border: '2px solid',
        borderColor: 'var(--secondary-color)',
        padding: '10px',
        margin: '15px auto',
        marginTop: '0px',
      }}
      onClick={() => {
        setCardSelected(true)
        chatContext.data = {
          id: user.id,
          name: user.name,
          img: user.members[0].imgProfile,
          createdAt: 'idk',
          isChannel: false,
        };
        closeNav();
      }}
    >
      <Group h={60} miw={234}>
        <Avatar radius={50} size={60} src={user.members[0].imgProfile} />
        <div>
          <Text size="lg">{user.name}</Text>
          <Text size="xs" color="dimmed">
            this is discription
          </Text>
        </div>
      </Group>
    </Box>
  );
}
function ChannelCard({ user, closeNav }: any) {
  const [bgColor, setBgColor] = useState('var(--white-color)')
  return (
    <Box
      maw={300}
      mx="auto"
      onMouseOver={()=>{setBgColor('red')}}
      onMouseLeave={()=>{setBgColor('var(--white-color)')}}
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
            this is discription
          </Text>
        </div>
      </Group>
    </Box>
  );
}

export function RoomsList({ rooms, setCardSelected, closeNav}: any) {
  return (
    <ScrollArea h={'calc(100% - 200px)'} mt={20}>
      {rooms.map((room: any) => (
        <>
          {room.isChannel ? (
            <ChannelCard user={room} closeNav={closeNav}/>
          ) : (
            <UserCard user={room} setCardSelected={setCardSelected} closeNav={closeNav}/>
          )}
        </>
      ))}
    </ScrollArea>
  );
}
