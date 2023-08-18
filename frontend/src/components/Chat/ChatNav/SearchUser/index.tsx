import { ChatContext } from '@/context/chat';
import { ChatSocketContext } from '@/context/chatSocketContext';
import { Avatar, Button, Group, Text } from '@mantine/core';
import { SpotlightProvider, spotlight } from '@mantine/spotlight';
import type { SpotlightAction, SpotlightActionProps } from '@mantine/spotlight';
import { useRouter } from 'next/router';
import { forwardRef, useContext, useState } from 'react';
import request from 'superagent';

export function SearchUser() {
  const chatContext = useContext(ChatContext);
  const socket = useContext(ChatSocketContext);
  const [bgColor, setBgColor] = useState('var(--white-color)');
  const router = useRouter();
  function createNewPrivateChat(event) {
    close();
    const jwtToken = localStorage.getItem('jwtToken');
    request
      .post('http://localhost:4400/api/chat/private')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({id: event.id, username: event.nickname })
      .then((res) => {
        chatContext.data = {
          id: res.body.id,
          name: event.nickname,
          img: event.img,
        };
        router.push('/chat/private');
      })
      .catch((err) => {
        return err;
      });
  }
  
  const [search, setSearch] = useState([]);
  const actions: SpotlightAction[] = search;
  const jwtToken = localStorage.getItem('jwtToken');
  function requestUsers(event) {
    request
      .get('http://localhost:4400/api/chat/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .query({ username: event })
      .then((res) => {
        setSearch(
          res.body.map((user) => ({
            title: user.username,
            description: 'new docs',
            icon: <Avatar size="1.2rem" src={user.imgProfile} />,
            onTrigger: () =>
            createNewPrivateChat({ id: user.id, nickname: user.username, img: user.imgProfile}),
          }))
        );
      })
      .catch((err) => {
        return err;
      });
  }
  return (
    <SpotlightProvider
      actions={actions}
      searchPlaceholder="Search..."
      shortcut="mod + shift + 1"
      nothingFoundMessage="Nothing found..."
      onQueryChange={requestUsers}
    >
      <Group position="center" >
      <Button
        h={70}
        w={'100%'}
        maw={300}
        mx="auto"
        onMouseOver={() => {
          setBgColor('var(--secondary-color)');
        }}
        onMouseLeave={() => {
          setBgColor('var(--white-color)');
        }}
        style={{
          display: 'block',
          cursor: 'pointer',
          backgroundColor: bgColor,
          borderRadius: '10px',
          border: '2px solid',
          borderColor: 'var(--secondary-color)',
          padding: '10px',
          marginTop: '0px',
          color: bgColor == 'var(--secondary-color)' ? 'var(--white-color)' : 'var(--secondary-color)',
          fontSize: 40,
        }}
        onClick={(event) => spotlight.open()}
      >
        +
      </Button>
      </Group>
    </SpotlightProvider>
  );
}
