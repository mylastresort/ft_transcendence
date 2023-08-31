import { ChatContext } from '@/context/chat';
import { UserContext } from '@/context/user';
import { Button, Group, SegmentedControl, Select, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useContext, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import request from 'superagent';

export function AdminSettings({ members }: any) {
  const jwtToken = localStorage.getItem('jwtToken');
  const form = useForm({
    initialValues: {
      member: '',
    },
    validate: {
      member: (value) => (value != '' ? null : 'Select member'),
    },
  });

  function setAdministrator({ member }) {
    request
      .post('/api/chat/channel/settings/admin')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ nickname: member })
      .then((res) => {
        notifications.show({
          title: `You have set ${member} as Channel Administrator`,
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
        aria-label="Member managment:"
        p={20}
        style={{
          border: '1px solid var(--chat-red-color)',
          borderRadius: '20px',
        }}
      >
        <form
          style={{ width: '100%' }}
          onSubmit={form.onSubmit(setAdministrator)}
        >
          <Select
            mt={0}
            label={'New Administrator:'}
            placeholder="Select member"
            data={members}
            w={'100%'}
            {...form.getInputProps('member')}
          />
          <Button type="submit" color="red" w={'100%'}>
            Add Administrator
          </Button>
        </form>
      </Group>
    </>
  );
}
