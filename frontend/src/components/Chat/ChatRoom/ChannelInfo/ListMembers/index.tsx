import { ChatContext } from '@/context/chat';
import { UserContext } from '@/context/user';
import {
  Avatar,
  Badge,
  Button,
  Group,
  List,
  ScrollArea,
  Text,
} from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import request from 'superagent';

interface Member {
  id: number;
  nickname: string;
  isOwner: boolean;
  isAdministator: boolean;
  user: {
    id: number;
    imgProfile: string;
  };
}

export function ListMembers({ members }: { members: Member[] }) {
  return (
    <List h={'60%'} m={'auto'}>
      <ScrollArea
        h={'100%'}
        w={300}
        p={10}
        style={{
          border: '1px solid var(--chat-red-color)',
          borderRadius: '10px',
        }}
      >
        {members.map((member) => (
          <List.Item key={member.id}>
            <Group
              style={{
                border: '1px solid var(--chat-red-color)',
                borderRadius: '50px',
              }}
              position="apart"
              p={4}
              w={275}
            >
              <Group>
                <Avatar size={'sm'} radius={50} src={member.user.imgProfile} />
                <Text>{member.nickname}</Text>
              </Group>
              {member.isOwner ? (
                <Badge color="red" bg={'red'} children="Owner" />
              ) : member.isAdministator ? (
                <Badge color="grape" bg={'grape'} children="Admin" />
              ) : (
                <Badge color="blue" bg={'blue'} children="mumber" />
              )}
            </Group>
          </List.Item>
        ))}
      </ScrollArea>
    </List>
  );
}
