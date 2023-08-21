import { ChatContext } from '@/context/chat';
import { UserContext } from '@/context/user';
import {
  Button,
  Group,
  PasswordInput,
  SegmentedControl,
  Select,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useContext, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import request from 'superagent';

export function PasswordSettings({ channel }) {
  const [opened, { open, close }] = useDisclosure(false);
  const chatContext = useContext(ChatContext);
  const userContext = useContext(UserContext);
  const jwtToken = localStorage.getItem('jwtToken');
  const [mode, setMode] = useState('set');

  const form = useForm({
    initialValues: {
      password: '',
    },
    validate: {
      password: (value) =>
        mode == 'remove' ||
        (!value.includes(' ') && value.length >= 8 && value.length <= 16)
          ? null
          : 'invalid password',
    },
  });

  const data = channel.isProtected
    ? [
        { label: 'change Password', value: 'change' },
        { label: 'Remove Password', value: 'remove' },
      ]
    : [{ label: 'Set Password', value: 'set' }];

  function setPassword({ password }) {
    console.log('mode', mode[0], 'pass: ', password);
    const req = request
      .post('http://10.13.1.7:4400/api/chat/channel/settings/password')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ id: channel.id, mode: mode[0], pass: password })
      .then((res) => {
        notifications.show({
          title: `Password has been ${mode}d successfully`,
          message: '',
          color: 'green',
        });
      })
      .catch((err) => {
        return err;
      });
    form.reset();
  }
  return (
    <>
      <Group
        p={20}
        style={{
          border: '1px solid var(--chat-red-color)',
          borderRadius: '20px',
        }}
      >
        <form style={{ width: '100%' }} onSubmit={form.onSubmit(setPassword)}>
          <SegmentedControl
            w={'100%'}
            value={mode}
            onChange={setMode}
            data={data}
          />
          {mode != 'remove' && (
            <PasswordInput
              placeholder="Channel password"
              {...form.getInputProps('password')}
            />
          )}
          <Button type="submit" color="red" w={'100%'}>
            {mode} Password
          </Button>
        </form>
      </Group>
    </>
  );
}
