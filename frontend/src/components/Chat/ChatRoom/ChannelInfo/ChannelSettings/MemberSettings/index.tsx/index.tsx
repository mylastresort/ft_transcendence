import { ChatContext } from '@/context/chat';
import { UserContext } from '@/context/user';
import { Button, Group, SegmentedControl, Select, Text } from '@mantine/core';
import { useContext, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import request from 'superagent';
import { ChatSocketContext } from '@/context/chatSocketContext';

export function MemberSettings({ members }) {
  const [opened, { open, close }] = useDisclosure(false);
  const chatContext = useContext(ChatContext);
  const userContext = useContext(UserContext);
  const jwtToken = localStorage.getItem('jwtToken');
  const [value, setValue] = useState('mute');
  const [time, setTime] = useState('1');
  const socket = useContext(ChatSocketContext);

  const form = useForm({
    initialValues: {
      member: '',
    },
    validate: {
      member: (value) => (value != '' ? null : 'Select member'),
    },
  });
  function manageMember({ member }) {
    const date = new Date();
    const inputTime = date.getTime() + (Number(time) * 3600000);
    const data = {
      nickname: member,
      channelName: chatContext.data.name,
      isKick: value == 'kick',
      isMute: value == 'mute',
      isBan: value == 'ban',
      time: inputTime,
    };
    request
      .post('http://10.13.1.7:4400/api/chat/channel/settings/members')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(data)
      .then((res) => {
      })
      .catch((err) => {
        return err;
      });
    form.reset();
  }
  return (
    <>
      <Group
        aria-label="Member managment:"
        p={20}
        style={{
          //administrator accicible areia
          border: '1px solid var(--chat-red-color)',
          borderRadius: '20px',
        }}
      >
        <form style={{ width: '100%' }} onSubmit={form.onSubmit(manageMember)}>
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
            data={members}
            w={'100%'}
            {...form.getInputProps('member')}
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
          <Button type="submit" color="red" w={'100%'}>
            {value} member
          </Button>
        </form>
      </Group>
    </>
  );
}
