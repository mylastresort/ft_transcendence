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

function UserCard({ user }: { user: any }) {
  console.log('usercard=>', user.members[0].imgProfile);
  return (
    <Box
      maw={300}
      mx="auto"
      style={{
        backgroundColor: 'var(--white-color)',
        borderRadius: '10px',
        border: '2px solid',
        borderColor: 'var(--secondary-color)',
        padding: '10px',
        margin: '15px auto',
        marginTop: '0px',
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
function ChannelCard({ user }: { user: any }) {
  return (
    <Box
      maw={300}
      mx="auto"
      style={{
        backgroundColor: 'var(--white-color)',
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

export function RoomsList({ rooms }: any) {
  return (
    <ScrollArea h={'calc(100% - 200px)'} mt={20}>
      {rooms.map((room: any) => (
        <>
          {room.isChannel ? (
            <ChannelCard user={room}></ChannelCard>
          ) : (
            <UserCard user={room}></UserCard>
          )}
        </>
      ))}
    </ScrollArea>
  );
}
