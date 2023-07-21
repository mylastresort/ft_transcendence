import {
  Button,
  Group,
  Modal,
  Select,
  Autocomplete,
  useMantineTheme,
  Avatar,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { createStyles, rem } from '@mantine/core';
import { forwardRef, useState, useContext } from 'react';
import request from 'superagent';
import { ChatContext } from '@/context/chat';
import Link from 'next/link';
import { useRouter } from 'next/router';

const AutoCompleteItem = forwardRef<HTMLDivElement>(
  ({ value, image, ...others }: any, ref) => {
    return (
        <div ref={ref} {...others}>
          <Group noWrap>
            <Avatar src={image} />
            <div>
              <Text>{value}</Text>
              <Text size="xs" color="dimmed">
                this is discription
              </Text>
            </div>
          </Group>
        </div>
    );
  }
);

export function SearchUser() {
  const [search, setSearch] = useState<{ value: string; image: string }[]>([]);
  const [inputValue, setinputValue] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const chatContext = useContext(ChatContext);
  const theme = useMantineTheme();

  function requestUsers() {
    const jwtToken = localStorage.getItem('jwtToken');
    request
      .get('http://localhost:4400/api/chat/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .query({ username: inputValue })
      .then((res) =>
        setSearch(
          res.body.map((user) => ({
            value: user.username,
            image: user.imgProfile,
          }))
        )
      )
      .catch((err) => {
        return err;
      });
  }

  const router = useRouter()
  function createNewPrivateChat(event) {
    close();
    const jwtToken = localStorage.getItem('jwtToken');
    request
      .post('http://localhost:4400/api/chat/private')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ username: event.value })
      .then((res) => {
        chatContext.data = {
          id: res.body.id,
          name: event.value,
          img: event.image,
          createdAt: 'idk',
          isChannel: false,
        };
        router.push("/chat/private")
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
        size={550}
        radius="sm"
        overlayProps={{
          color: theme.colorScheme === 'dark' ? 'black' : 'white',
          opacity: 0.55,
          blur: 3,
        }}
      >
        <Autocomplete
          w={450}
          h={200}
          m={'auto'}
          size="lg"
          value={inputValue}
          onItemSubmit={createNewPrivateChat}
          onChange={(val) => {
            setinputValue(val);
            requestUsers();
          }}
          itemComponent={AutoCompleteItem}
          placeholder="Search for a user..."
          data={search}
        />
      </Modal>

      <Group position="center">
        <Button onClick={open}>Search for user</Button>
      </Group>
    </>
  );
}
