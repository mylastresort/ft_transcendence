import { ChatContext } from '@/context/chat';
import { UserContext } from '@/context/user';
import { Badge, Box, Button, Card, Group, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useContext, useEffect, useState } from 'react';
import request from 'superagent';

interface Channel {
  id: number;
  image: string;
  channelName: string;
  description: string;
}

export function ListPublicChannels() {
  const jwtToken = localStorage.getItem('jwtToken');
  const [channels, setChannels]: [Channel[], any] = useState([]);
  const userContext = useContext(UserContext);
  useEffect(() => {
    request
      .get(`http://localhost:4400/api/chat/channel`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .then((res) => {
        setChannels(res.body);
        console.log(res.body);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function joinChannel(channel) {
    console.log;
    request
      .post('http://localhost:4400/api/chat/channel/join')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ id: channel.id })
      .then((res) => console.log(res.body))
      .catch((err) => {
        notifications.show({
          title: 'Cannot join Channel',
          message: err.response.body.error,
          color: 'red',
        });
        return;
      });
  }
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
            w={300}
            bg={'white'}
            m={30}
            style={{
              borderRadius: '15px',
            }}
            shadow="xl"
          >
            <Card.Section>
              <img src={channel.image} alt="" />
            </Card.Section>
            <Group position="apart" p={'20px 0px'}>
              <Text>{channel.channelName}</Text>
              {true ? (
                <Badge color="red" bg={'red'} children="Protected" />
              ) : (
                <></>
              )}
            </Group>
            <Text size={'sm'} color="dimmed">
              {channel.description}
            </Text>
            <Button w={'100%'} onClick={(event) => joinChannel(channel)}>
              Join Channel
            </Button>
          </Card>
        ))}
      </Group>
    </Box>
  );
}
