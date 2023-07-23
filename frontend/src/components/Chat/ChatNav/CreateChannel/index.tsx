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

export function CreateChannel() {
  const [bgColor, setBgColor] = useState('var(--white-color)');
  const [controleValue, setControleValue] = useState('public');
  const [opened, { open, close }] = useDisclosure(false);
  const chatContext = useContext(ChatContext);
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: {
      name: '',
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
      password: value.password,
      isProtected: controleValue == 'protected',
      isPrivate: controleValue == 'private',
    }
    console.log(data)
    const jwtToken = localStorage.getItem('jwtToken');
    request
      .post('http://localhost:4400/api/chat/channel')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(data)
      .then((res) => {
        console.log("res:", res.body)
        chatContext.data = {
          id: res.body.id,
          name: value.value,
          img: value.image,
          lastMsg: '',
          ownerId: res.body.owner.userId
        };
        console.log("created channel:", res.body);
        router.push('/chat/channels');
      })
      .catch((err) => {
        return err;
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
              // display={controleValue == 'protected' ? 'block' : 'none'}
              withAsterisk
              label="password"
              placeholder="Password"
              {...form.getInputProps('password')}
            />}
            <Group position="right" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
      </Modal>
      <Button
        h={70}
        w={300}
        onMouseOver={() => {
          setBgColor('var(--chat-red-color)');
        }}
        onMouseLeave={() => {
          setBgColor('var(--white-color)');
        }}
        style={{
          cursor: 'pointer',
          backgroundColor: bgColor,
          borderRadius: '10px',
          border: '2px solid',
          borderColor: 'var(--chat-red-color)',
          padding: '10px',
          margin: '0px 14px',
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
