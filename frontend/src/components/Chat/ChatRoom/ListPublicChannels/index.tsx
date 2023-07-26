import { ChatContext } from '@/context/chat';
import { UserContext } from '@/context/user';
import { useDisclosure } from '@mantine/hooks';
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Input,
  Modal,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import request from 'superagent';
import { useForm } from '@mantine/form';

interface Channel {
  id: number;
  image: string;
  channelName: string;
  description: string;
  isProtected: boolean;
}

export function ListPublicChannels() {
  const jwtToken = localStorage.getItem('jwtToken');
  const [opened, { open, close }] = useDisclosure(false);
  const [channels, setChannels]: [Channel[], any] = useState([]);
  const chatContext = useContext(ChatContext);
  const router = useRouter();
  useEffect(() => {
    request
      .get(`http://localhost:4400/api/chat/channel/public`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .then((res) => {
        setChannels(res.body);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function joinChannel(channel, password: string='') {
    request
      .post('http://localhost:4400/api/chat/channel/join')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ id: channel.id, password: password})
      .then((res) => {
        console.log(res.body);
        chatContext.data = {
          id: res.body.channel.id,
          name: res.body.channel.channelName,
          img: res.body.channel.image,
        };
        router.push('/chat/channels');
      })
      .catch((err) => {
        notifications.show({
          title: 'Cannot join Channel',
          message: err.response.body.error,
          color: 'red',
        });
        return;
      });
  }
  const passwordForm = useForm({
    initialValues: { password: '' },
    validate: {
      password: (value) => (value.trim() == '' ? 'Please fill the password input' : null),
    },
  });

  return (
    <Box
      ml={55}
      w={'calc(100% - 77px)'}
      styles={{ width: 'calc(100% - 77px)' }}
      bg={'#EAEAEA'}
    >
      <Group>
        {channels.map((channel) => (
          <Card
            key={channel.id}
            w={300}
            bg={'white'}
            m={30}
            style={{
              borderRadius: '15px',
            }}
            shadow="xl"
          >
            <Card.Section>
              <img
                src={channel.image}
                alt=""
                style={{
                  width: '200px',
                  margin: '0px 50px',
                }}
              />
            </Card.Section>
            <Group position="apart" p={'20px 0px'}>
              <Text color="black">{channel.channelName}</Text>
              {channel.isProtected ? (
                <Badge color="red" bg={'red'} children="Protected" />
              ) : (
                <></>
              )}
            </Group>
            <Text size={'sm'} color="dimmed">
              {channel.description}
            </Text>
            <Button
              w={'100%'}
              onClick={(event) =>
                channel.isProtected ? open() : joinChannel(channel)
              }
            >
              Join Channel
            </Button>
            <Modal
              opened={opened}
              onClose={() => {close(); passwordForm.reset();}}
              title="Authentication"
              overlayProps={{
                opacity: 0.1,
                blur: 3,
              }}
              centered
            >
              <Box w={400}>

              <form onSubmit={passwordForm.onSubmit((val)=>{joinChannel(channel, val.password); passwordForm.reset(); close()})}>
                <PasswordInput
                  withAsterisk
                  placeholder="Channel Password"
                  {...passwordForm.getInputProps('password')}
                  />
                <Button mt={20} type="submit" w={'100%'}>Join Channel</Button>
              </form>
                  </Box>
            </Modal>
          </Card>
        ))}
      </Group>
    </Box>
  );
}
