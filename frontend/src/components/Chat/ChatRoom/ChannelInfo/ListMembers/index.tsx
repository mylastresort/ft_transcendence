import { ChatContext } from '@/context/chat';
import { UserContext } from '@/context/user';
import { Avatar, Badge, Button, Group, List, Text } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import request from 'superagent';

interface Member {
  id: number;
  nickname: string;
  isOwner: boolean;
  user:{
    id: number;
    imgProfile: string;
  }
}

export function ListMembers({members}: {members:Member[]}) {
  // const userContext = useContext(UserContext);
  // const chatContext = useContext(ChatContext);
  // const jwtToken = localStorage.getItem('jwtToken');
  // const [owner, setOwner] = useState();
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
              member.isOwner?
              <Badge color="red" bg={'red'} children="Owner" />
              : <Badge color="blue" bg={'blue'} children="mumber" />
            }
            </Group>
        </List.Item>
      ))}
      </List>
      {/* <Button w={300} m={'auto'} color="green" onClick={() => setLoad(!load)}>
        laod members
      </Button> */}
    </>
  );
}
