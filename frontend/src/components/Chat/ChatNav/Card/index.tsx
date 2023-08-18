import { ChatContext } from '@/context/chat';
import { Avatar, Box, Group, Text } from '@mantine/core';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import request from 'superagent';

interface ChannelData {
  id: number;
  channelName: string;
  password: string;
  createdAt: string;
  updateAt: string;
  description: string;
  image: string;
  isProtected: Boolean;
  isPrivate: Boolean;
}

export function UserCard({ user, closeNav }) {
  const chatContext = useContext(ChatContext);
  const [bgColor, setBgColor] = useState('var(--white-color)');
  const content = () => user.Messages[0].content.slice(0, 30) + ' ...';
  return (
    <Link href={'/chat/private'}>
      <Box
        maw={300}
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
          margin: 'auto',
          marginTop: '15px',
          color:
            bgColor == 'var(--secondary-color)'
              ? 'var(--white-color)'
              : 'var(--secondary-color)',
        }}
        onClick={() => {
          chatContext.data = {
            id: user.id,
            name: user.members[0].username,
            img: user.members[0].imgProfile,
            memberId: user.members[0].id,
          };
          closeNav();
        }}
      >
        <Group noWrap h={60}>
          <Avatar radius={50} size={60} src={user.members[0].imgProfile} />
          <div>
            <Text size="lg">{user.members[0].username}</Text>
            <Text size="xs" color="dimmed">
              {user.Messages[0] ? content() : '...'}
            </Text>
          </div>
        </Group>
      </Box>
    </Link>
  );
}

export function ChannelCard({
  channel,
}: {
  channel: ChannelData;
  closeNav: any;
}) {
  const [bgColor, setBgColor] = useState('var(--white-color)');
  const chatContext = useContext(ChatContext);
  function getMe() {
    const jwtToken = localStorage.getItem('jwtToken');
    request
      .get('http://localhost:4400/api/chat/channel/members/me')
      .set('Authorization', `Bearer ${jwtToken}`)
      .query({ id: channel.id })
      .then((res) => {
        chatContext.data = {
          id: channel.id,
          name: channel.channelName,
          img: channel.image,
          me: res.body,
        };
      })
      .catch((err) => {
        return err;
      });
  }
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
          margin: 'auto',
          marginTop: '10px',
          color:
            bgColor == 'var(--chat-red-color)'
              ? 'var(--white-color)'
              : 'var(--chat-red-color)',
        }}
        onClick={getMe}
      >
        <Group noWrap h={60}>
          <Avatar radius={50} size={60} src={channel.image} />
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
