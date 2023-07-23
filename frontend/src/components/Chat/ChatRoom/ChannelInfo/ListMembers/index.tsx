import { ChatContext } from '@/context/chat';
import { UserContext } from '@/context/user';
import { Avatar, Badge, Button, Group, List, Text } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import request from 'superagent';

interface Member {
  id: number;
  nickname: string;
  user:{
    id: number;
    imgProfile: string;
  }
}

export function ListMembers() {
  const userContext = useContext(UserContext);
  const chatContext = useContext(ChatContext);
  const jwtToken = localStorage.getItem('jwtToken');
  const [load, setLoad] = useState(false);
  const [members, setMembers]: [Member[], any] = useState([]);
  const [owner, setOwner] = useState();
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
  }, [load, chatContext.data]);
  return (
    <>
      <List m={'auto'} >
        {members.map((member) => (
        <List.Item key={member.id}>
            <Group style={{
                border: '1px solid var(--chat-red-color)',
                borderRadius: '50px'
            }}
            position='apart'
            p={4}
            w={250}
            >
              <Group>
            <Avatar size={'sm'} radius={50} src={member.user.imgProfile}/>
            <Text>{member.nickname}</Text>
            </Group>
            {
              chatContext.data.ownerId == member.user.id ?
              <Badge color="red" bg={'red'} children="Owner" />
              : <Badge color="blue" bg={'blue'} children="mumber" />
            }
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
