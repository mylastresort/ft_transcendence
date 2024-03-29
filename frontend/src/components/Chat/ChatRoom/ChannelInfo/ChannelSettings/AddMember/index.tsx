import { ChatContext } from '@/context/chat';
import { ChatSocketContext } from '@/context/chatSocketContext';
import { Avatar, Button, Group, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { SpotlightProvider, spotlight } from '@mantine/spotlight';
import type { SpotlightAction, SpotlightActionProps } from '@mantine/spotlight';
import { style } from '@mui/system';
import { forwardRef, useContext, useState } from 'react';
import request from 'superagent';

export function AddMember() {
  const chatContext = useContext(ChatContext);
  const socket = useContext(ChatSocketContext);
  function createMember(data: any) {
    const newMember = {
      id: chatContext.data.id,
      newMember: {
        id: data.id,
        nickname: data.nickname,
      },
    };
    request
      .post('/api/chat/channel/create-member')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(newMember)
      .then((res) => {
        socket.emit('addMember', {
          name: chatContext.data.name,
          target: data.nickname,
        });
        notifications.show({
          title: 'New Member has been Added',
          message: '',
          color: 'green',
        });
        return;
      })
      .catch((err) => {
        notifications.show({
          title: 'Member not Added',
          message: err.response.body.error,
          color: 'red',
        });
        return;
      });
  }
  const [search, setSearch] = useState([]);
  const actions: SpotlightAction[] = search;
  const jwtToken = localStorage.getItem('jwtToken');
  function requestUsers(event) {
    request
      .get('/api/chat/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .query({ username: event })
      .then((res) => {
        setSearch(
          res.body.map((user) => ({
            title: user.username,
            description: `${user.firstName} ${user.lastName}`,
            icon: <Avatar size="1.2rem" src={user.imgProfile} />,
            onTrigger: () =>
              createMember({ id: user.id, nickname: user.username }),
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
      <Group position="center">
        <Button w={'80%'} onClick={(event) => spotlight.open()}>
          Add Member
        </Button>
      </Group>
    </SpotlightProvider>
  );
}
