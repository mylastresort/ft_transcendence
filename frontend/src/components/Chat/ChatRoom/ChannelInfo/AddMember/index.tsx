import { ChatContext } from '@/context/chat';
import { Avatar, Button, Group, Text } from '@mantine/core';
import { SpotlightProvider, spotlight } from '@mantine/spotlight';
import type { SpotlightAction, SpotlightActionProps } from '@mantine/spotlight';
import { style } from '@mui/system';
import { forwardRef, useContext, useState } from 'react';
import request from 'superagent';

function SpotlightControl() {
  return (
    <Group position="center">
      <Button onClick={(event) => spotlight.open()}>Add Member</Button>
    </Group>
  );
}

export function AddMember() {
  const chatContext = useContext(ChatContext);
  function createMember(data: any) {
    const newMember = {
      id: chatContext.data.id,
      newMember: {
        id: data.id,
        nickname: data.nickname,
      },
    };
    request
      .post('http://localhost:4400/api/chat/channel/create-member')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(newMember)
      .then((res) => console.log(res.body))
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
      <SpotlightControl />
    </SpotlightProvider>
  );
}
