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
import { forwardRef, useState, useContext} from 'react';
import request from 'superagent';
import { ChatContext } from '@/context/chat';

const AutoCompleteItem = forwardRef<HTMLDivElement>(
  ({ value, image, ...others }: any, ref) => (
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
  )
);

export function SearchUser({setCardSelected} : any) {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const [search, setSearch] = useState<{ value: string; image: string }[]>([]);
  const [value, setValue] = useState('');
  const chatContext = useContext(ChatContext);

  function requestUsers() {
    const jwtToken = localStorage.getItem('jwtToken');
    request
      .get('http://localhost:4400/api/chat/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .query({ username: value })
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
  function createNewRoom(event) {
    console.log(event)
    close()
    const roomData = {
      name: 'room',
      icon: event.image,
      users: event.value,
    };
    const jwtToken = localStorage.getItem('jwtToken');
    request
    .post('http://localhost:4400/api/chat')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(roomData)
    .then((res)=>{
      setCardSelected(true)
      chatContext.data = {
        id: res.body.id,
        name: res.body.name,
        img: event.image,
        createdAt: 'idk',
        isChannel: false,
      };
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
          value={value}
          onItemSubmit={createNewRoom}
          onChange={(val) => {
            setValue(val);
            requestUsers();
          }}
          
          itemComponent={AutoCompleteItem}
          placeholder="Search for a user..."
          data={search}
        />
      </Modal>

      <Group position="center">
        <Button onClick={open}>
          Search for user
        </Button>
      </Group>
    </>
  );
}
