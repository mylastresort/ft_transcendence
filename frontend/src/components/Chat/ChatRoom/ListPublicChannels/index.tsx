import { ChatContext } from '@/context/chat';
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
  ScrollArea,
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
      .get('/api/chat/channel/public')
      .set('Authorization', `Bearer ${jwtToken}`)
      .then((res) => {
        setChannels(res.body);
      })
      .catch((err) => {});
  }, []);

  function joinChannel(channel, password: string = '') {
    request
      .post('/api/chat/channel/join')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ id: channel.id, password: password })
      .then((res) => {
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
      password: (value) =>
        value.trim() == '' ? 'Please fill the password input' : null,
    },
  });

  return (
    <Box
      sx={(theme) => ({
        background: '#EAEAEA',
        paddingLeft: '55px',
      })}
    >
      <ScrollArea h={'calc(100vh - 77px)'}>
        <Group>
          {channels.map((channel) => (
            <Card
              key={channel.id}
              w={300}
              maw={'100%'}
              bg={'white'}
              m={20}
              style={{
                borderRadius: '15px',
                boxShadow: '0px 0px 10px grey',
              }}
            >
              <Card.Section>
                <img
                  src={channel.image}
                  alt=""
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover',
                    margin: '10px 50px',
                    borderRadius: '100px',
                    boxShadow: '0px 0px 10px grey',
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
                onClose={() => {
                  close();
                  passwordForm.reset();
                }}
                title="Authentication"
                overlayProps={{
                  opacity: 0.1,
                  blur: 3,
                }}
                centered
              >
                <Box w={400}>
                  <form
                    onSubmit={passwordForm.onSubmit((val) => {
                      joinChannel(channel, val.password);
                      passwordForm.reset();
                      close();
                    })}
                  >
                    <PasswordInput
                      withAsterisk
                      placeholder="Channel Password"
                      {...passwordForm.getInputProps('password')}
                    />
                    <Button mt={20} type="submit" w={'100%'}>
                      Join Channel
                    </Button>
                  </form>
                </Box>
              </Modal>
            </Card>
          ))}
        </Group>
      </ScrollArea>
    </Box>
  );
}
