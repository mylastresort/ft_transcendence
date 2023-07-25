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

interface Member {
  id: number;
  nickname: string;
  isOwner: boolean;
  user: {
    id: number;
    imgProfile: string;
  };
}

export function ChannelSetting({ members }: { members: Member[] }) {
  const [opened, { open, close }] = useDisclosure(false);
  const chatContext = useContext(ChatContext);
  const userContext = useContext(UserContext);
  const jwtToken = localStorage.getItem('jwtToken');
  const [member, setMember] = useState<string | null>(null);
  const [value, setValue] = useState('mute');
  const [time, setTime] = useState('1');
  function deleteUser() {
    request
      .post('http://localhost:4400/api/chat/channel/delete')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ id: chatContext.data.id })
      .catch((err) => {
        return err;
      });
  }

  function manageMember() {
    console.log('member: ', member, 'setuation: ', value, 'time: ', time);
    const date = new Date();
    if (value == 'kick') {
      console.log('kicked');
      request
        .post('http://localhost:4400/api/chat/channel/kick')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ nickname: member })
        .then((res) => {
          notifications.show({
            title: `${member} has been kicked`,
            message: '',
            color: 'green',
          });
        })
        .catch((err) => {
          return err;
        });
    } else if (value == 'mute') {
      const mtime = date.getTime() + Number(time) * 3600000;
      console.log('muted till: ', new Date(mtime));
      request
        .post('http://localhost:4400/api/chat/channel/mute')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ nickname: member, mutedTime: mtime })
        .then((res) => {
          notifications.show({
            title: `${member} has been muted`,
            message: '',
            color: 'green',
          });
        })
        .catch((err) => {
          return err;
        });
    }
  }

  function getMembers(members): [{ lable: string; value: string }] {
    return members
      .map(
        (m) =>
          userContext.data.id != m.user.id &&
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
        <Flex direction={'column'} h={500}>
          <Text m={'auto'} opacity={0.4} color="var(--chat-red-color)">
            Member managment
          </Text>
          <Group
            aria-label="Member managment:"
            p={20}
            style={{
              //administrator accicible areia
              border: '1px solid var(--chat-red-color)',
              borderRadius: '20px',
            }}
          >
            <SegmentedControl
              value={value}
              onChange={setValue}
              w={'100%'}
              data={[
                { label: 'Mute', value: 'mute' },
                { label: 'Ban', value: 'ban' },
                { label: 'Kick', value: 'kick' },
              ]}
            />
            <Select
              placeholder="Select member"
              onChange={setMember}
              data={getMembers(members)}
              error={member == '' ? 'Pick at least one item' : false}
              w={'100%'}
            />
            {value != 'kick' && (
              <SegmentedControl
                w={'100%'}
                value={time}
                onChange={setTime}
                data={[
                  { label: '1h', value: '1' },
                  { label: '6h', value: '6' },
                  { label: '24h', value: '24' },
                  { label: '48h', value: '48' },
                  { label: '7Days', value: '168' },
                  { label: '1Month', value: '720' },
                ]}
              />
            )}
            <Button onClick={manageMember} color="red" w={'100%'}>
              {value} member
            </Button>
          </Group>
          <Text m={'auto'} opacity={0.4} color="var(--chat-red-color)">
            Administrator managment:
          </Text>
          <Group
            aria-label="Member managment"
            p={20}
            style={{
              //administrator accicible areia
              border: '1px solid var(--chat-red-color)',
              borderRadius: '20px',
            }}
          >
            <Select
              mt={0}
              label={'New Administrator:'}
              placeholder="Select member"
              defaultValue="hhh"
              data={getMembers(members)}
              w={'100%'}
            />
            <Button color="red" w={'100%'}>
              Add Administrator
            </Button>
          </Group>
        </Flex>
      </Modal>
      <Button onClick={open} rightIcon={<Settings size="0.9rem" />}>
        settings
      </Button>
    </>
  );
}
