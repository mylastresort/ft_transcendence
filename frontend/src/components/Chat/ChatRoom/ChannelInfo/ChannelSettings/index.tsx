import { ChatContext } from '@/context/chat';
import { UserContext } from '@/context/user';
import {
  Button,
  Flex,
  Group,
  Input,
  Modal,
  SegmentedControl,
  Select,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useContext, useState } from 'react';
import request from 'superagent';
import { Settings } from 'tabler-icons-react';
import { MemberSettings } from './MemberSettings/index.tsx';
import { AdminSettings } from './AdminSettings';
import { PasswordSettings } from './PasswordSettings';
import { AddMember } from './AddMember';

interface Member {
  id: number;
  nickname: string;
  isOwner: boolean;
  user: {
    id: number;
    imgProfile: string;
  };
}

export function ChannelSettings({
  channel,
  members,
}: {
  channel: any;
  members: Member[];
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const chatContext = useContext(ChatContext);
  const userContext = useContext(UserContext);
  const jwtToken = localStorage.getItem('jwtToken');
  const [member, setMember] = useState<string | null>(null);
  const [value, setValue] = useState('mute');
  const [time, setTime] = useState('1');
  function deleteUser() {
    request
      .post('http://10.13.1.7:4400/api/chat/channel/delete')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ id: chatContext.data.id })
      .catch((err) => {
        return err;
      });
  }

  function getMembers(members): [{ lable: string; value: string }] {
    return members
      .map(
        (m) =>
          userContext.data && userContext.data.id != m.user.id &&
          !m.isOwner && { label: m.nickname, value: m.nickname }
      )
      .filter((e) => e);
  }

  return (
    <>
      <Modal
        radius={20}
        opened={opened}
        onClose={close}
        centered
        title="Channel Settings"
      >
        <Flex direction={'column'}>
          <Text m={'auto'} opacity={0.4} color="var(--chat-red-color)">
            Member managment
          </Text>
          <MemberSettings members={getMembers(members)} />
          <Text m={'auto'} opacity={0.4} color="var(--chat-red-color)">
            Administrator managment:
          </Text>
          <AdminSettings members={getMembers(members)} />
          {chatContext.data.me!.isOwner && (
            <>
              <Text m={'auto'} opacity={0.4} color="var(--chat-red-color)">
                Owner settings:
              </Text>
              <PasswordSettings channel={channel} />
            </>
          )}
        </Flex>
      </Modal>

      <Button w={'80%'} m={'auto'} onClick={open} rightIcon={<Settings size="0.9rem" />}>
        settings
      </Button>
    </>
  );
}
