import { ChatContext } from '@/context/chat';
import { Avatar, Button, Group, Text } from '@mantine/core';
import { SpotlightProvider, spotlight } from '@mantine/spotlight';
import type { SpotlightAction, SpotlightActionProps } from '@mantine/spotlight';
import { forwardRef, useContext, useState } from 'react';
import request from 'superagent';


export function AddMemeber() {
  const jwtToken = localStorage.getItem('jwtToken');
    const chatContext = useContext(ChatContext);
    const [search, setSearch] = useState([]);
    const [inputValue, setinputValue] = useState('');
    function SpotlightControl() {
      return (
        <Group position="center">
          <Button onClick={(event)=>(spotlight.open())}>Add Member</Button>
        </Group>
      );
    }
    interface CreateMember {
        id: number;
        newMember: {
          id: number;
          nickname: string;
        }
      }
    
    const Item = ({action, query} :SpotlightActionProps) => {
        const newMember = {
            id: chatContext.data.id,
            newMember: {
                id: action.id,
                nickname: action.username,
            }
        }
          return (
              <Group noWrap onClick={()=>{
                request
                .post('http://localhost:4400/api/chat/channel/create-member')
                .set('Authorization', `Bearer ${jwtToken}`)
                .send(newMember)
                .then((res) => console.log(res.body))
                .catch((err) => {
                  return err;
                });
              }}>
                <Avatar src={action.image} />
                <div>
                  <Text>{action.username}</Text>
                  <Text size="xs" color="dimmed">
                    {action.description}
                  </Text>
                </div>
              </Group>
          );
        }
    
    const actions: SpotlightAction[] = search
    
    function requestUsers(event) {
        request
          .get('http://localhost:4400/api/chat/users')
          .set('Authorization', `Bearer ${jwtToken}`)
          .query({ username: event })
          .then((res) =>
            setSearch(
              res.body.map((user) => ({
                id: user.id,
                username: user.username,
                description: 'no description provided',
                image: user.imgProfile,
              }))
            )
          )
          .catch((err) => {
            return err;
          });
    }
  return (
    <SpotlightProvider
      actions={actions}
      searchPlaceholder="Search..."
      shortcut="mod + shift + 1"
      actionComponent={Item}
      nothingFoundMessage="Nothing found..."
      onQueryChange={requestUsers}
    >
      <SpotlightControl  />
    </SpotlightProvider>
  );
}