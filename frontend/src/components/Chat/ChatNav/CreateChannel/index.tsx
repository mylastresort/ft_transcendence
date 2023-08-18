import {
  Button,
  Group,
  Modal,
  useMantineTheme,
  Box,
  TextInput,
  SegmentedControl,
  FileInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useContext } from 'react';
import request from 'superagent';
import { ChatContext } from '@/context/chat';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export function CreateChannel() {
  const [bgColor, setBgColor] = useState('var(--white-color)');
  const [controleValue, setControleValue] = useState('public');
  const [opened, { open, close }] = useDisclosure(false);
  const chatContext = useContext(ChatContext);
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      password: '',
    },
    validate: {
      name: (value) => (value.trim() ? null : 'Invalid channel name'),
      password: (value) => (controleValue == 'protected' && (value.trim().length > 8 ? null : 'Invalid password'))
    },
  });

  const router = useRouter();
  function createNewChannel(value) {
    close();
    const data = {
      channelName: value.name,
      image: value.image,
      description: value.description,
      isProtected: controleValue == 'protected',
      isPrivate: controleValue == 'private',
      password: value.password,
    }
    console.log(data)
    const jwtToken = localStorage.getItem('jwtToken');
    request
      .post('http://localhost:4400/api/chat/channel')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(data)
      .then((res) => {
        chatContext.data = {
          id: res.body.id,
          name: data.channelName,
          img: res.body.image,
          me: res.body.members[0],
        };
        notifications.show({
          title: `Channel ${data.channelName} has been created`,
          message: 'New Channel Lesgooo..',
          color: 'green'
        })
        router.push('/chat/channels');
      })
      .catch((err) => {
        notifications.show({
          title: `Channel ${data.channelName} not created`,
          message: '',
          color: 'red'
        })
      });
  }
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
        radius="sm"
        overlayProps={{
          color: theme.colorScheme === 'dark' ? 'black' : 'white',
          opacity: 0.55,
          blur: 3,
        }}
        zIndex={1000}
      >
        <Box maw={300} mx="auto">
          <form onSubmit={form.onSubmit(createNewChannel)}>
            <SegmentedControl
              value={controleValue}
              onChange={setControleValue}
              data={[
                { label: 'Public', value: 'public' },
                { label: 'Private', value: 'private' },
                { label: 'Protected', value: 'protected' },
              ]}
            />
            <TextInput
              withAsterisk
              label="Channel name:"
              placeholder="Channel Name"
              {...form.getInputProps('name')}
            />
            <TextInput
              label="description"
              placeholder="Description (optional)"
              {...form.getInputProps('description')}
              />
            <FileInput
              label="channel image"
              placeholder="Pick file"
              accept="image/png,image/jpeg"
              {...form.getInputProps('image')}
            />
            {controleValue == 'protected' && <TextInput
              withAsterisk
              label="password"
              placeholder="Password"
              {...form.getInputProps('password')}
            />}
            <Group position="apart" mt="md">
              <Button color='red' onClick={(e)=>{form.reset(); close()}}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
      </Modal>
      <Button
        h={70}
        w={'100%'}
        maw={300}
        mx="auto"
        onMouseOver={() => {
          setBgColor('var(--chat-red-color)');
        }}
        onMouseLeave={() => {
          setBgColor('var(--white-color)');
        }}
        style={{
          display: 'block',
          cursor: 'pointer',
          backgroundColor: bgColor,
          borderRadius: '10px',
          border: '2px solid',
          borderColor: 'var(--chat-red-color)',
          padding: '10px',
          marginTop: '0px',
          color:
            bgColor == 'var(--chat-red-color)'
              ? 'var(--white-color)'
              : 'var(--chat-red-color)',
          fontSize: 40,
        }}
        onClick={open}
      >
        +
      </Button>
    </>
  );
}
