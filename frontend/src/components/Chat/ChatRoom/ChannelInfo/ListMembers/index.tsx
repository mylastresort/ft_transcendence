import { ChatContext } from '@/context/chat';
import { UserContext } from '@/context/user';
import {
  Avatar,
  Badge,
  Group,
  List,
  ScrollArea,
  Text,
} from '@mantine/core';

interface Member {
  id: number;
  nickname: string;
  isOwner: boolean;
  isAdministator: boolean;
  isMuted: boolean;
  user: {
    id: number;
    imgProfile: string;
  };
}

export function ListMembers({ members }: { members: Member[] }) {
  return (
    <List h={'60%'} m={'auto'} w={'80%'}>
      <ScrollArea
        h={'100%'}
        w={'100%'}
        p={10}
        style={{
          border: '1px solid var(--chat-red-color)',
          borderRadius: '10px',
        }}
      >
        {members.map((member) => (
          <Group
            style={{
              border: '1px solid var(--chat-red-color)',
              borderRadius: '50px',
              margin: "6px 0px"
            }}
            position="apart"
            p={4}
            w={'100%'}
            key={member.id}
          >
            <Group>
              <Avatar size={'sm'} radius={50} src={member.user.imgProfile} />
              <Text>{member.nickname}</Text>
            </Group>
            {member.isOwner ? (
              <Badge color="red" bg={'red'} children="Owner" />
            ) : member.isMuted ? (
              <Badge color="gray" bg={'gray'} children="Muted" />
            ) : member.isAdministator ? (
              <Badge color="grape" bg={'grape'} children="Admin" />
            ) : (
              <Badge color="blue" bg={'blue'} children="mumber" />
            )}
          </Group>
        ))}
      </ScrollArea>
    </List>
  );
}
