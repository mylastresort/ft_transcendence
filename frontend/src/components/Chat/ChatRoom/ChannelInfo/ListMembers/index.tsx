import { ChatContext } from '@/context/chat';
import { Avatar, Button, Group, List, Text } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import request from 'superagent';

export function ListMembers() {
  const jwtToken = localStorage.getItem('jwtToken');
  const chatContext = useContext(ChatContext);
  const [load, setLoad] = useState(false);
  const [members, setMembers] = useState([]);
  useEffect(() => {
    request
      .get(`http://localhost:4400/api/chat/channel/members`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .query({ id: chatContext.data.id })
      .then((res) => {
        setMembers(res.body.members);
        console.log(res.body.members);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [load]);
  return (
    <>
      <List m={'auto'}>
        {members.map((member) => (
        <List.Item key={member.id}>
            <Group style={{
                border: '1px solid var(--chat-red-color)',
                borderRadius: '50px'
            }}
            p={4}
            w={200}
            >
            <Avatar size={'sm'} radius={50} src={member.user.imgProfile}/>
            <Text>{member.nickname}</Text>
            </Group>
        </List.Item>
      ))}
      </List>
      <Button w={300} m={'auto'} color="green" onClick={() => setLoad(!load)}>
        laod members
      </Button>
    </>
  );
}
