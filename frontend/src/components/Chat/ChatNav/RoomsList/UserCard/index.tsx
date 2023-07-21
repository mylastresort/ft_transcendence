import { ChatContext } from '@/context/chat';
import { Box, Group, Avatar, Text } from '@mantine/core';
import Link from 'next/link';
import { useContext, useState } from 'react';

export function UserCard({ user, setCardSelected, closeNav }) {
  const [bgColor, setBgColor] = useState('var(--white-color)');
  const chatContext = useContext(ChatContext);
  console.log(user.Messages[0])
  const content =   user.Messages[0].content.slice(0, 30) + " ..."
  return (
    <Link href={'/chat/private'}>
      <Box
        maw={300}
        mx="auto"
        onMouseOver={() => {
          setBgColor('var(--secondary-color)');
        }}
        onMouseLeave={() => {
          setBgColor('var(--white-color)');
        }}
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
          chatContext.data = {
            id: user.id,
            name: user.members[0].username,
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
            <Text size="lg">{user.members[0].username}</Text>
            <Text size="xs" color="dimmed">
              {user.Messages[0] ? content : "..."}
            </Text>
          </div>
        </Group>
      </Box>
    </Link>
  );
}
