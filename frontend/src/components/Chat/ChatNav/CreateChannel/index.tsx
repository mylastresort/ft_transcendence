import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, TextInput, MultiSelect } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import request from 'superagent';
import { User, UserContext } from '@/context/user';


export function CreateChannel({ context }: any) {
  const [opened, { open, close }] = useDisclosure(false);
  const [roomName, setRoomName] = useState('');
  const [roomMember, setRoomMember] = useState('');

  function createNewRoom(event) {
    const roomData = {
      name: roomName,
      icon: 'test',
      users: roomMember,
      isChannel: true,
    };
    const jwtToken = localStorage.getItem('jwtToken');
    request
      .post('http://localhost:4400/api/chat')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(roomData)
      // .then((res) => setRooms(res.body))
      .catch((err) => {
        return err;
      });
    setRoomName('');
    setRoomMember('');
  }

  return (
    <>
      <Modal opened={opened} onClose={close} centered title="Create New Room">
        <TextInput
          label="Room name:"
          placeholder="Room name ..."
          data-autofocus
          withAsterisk
          onChange={(event) => setRoomName(event.target.value)}
        />
        <TextInput
          label="Select user:"
          placeholder="Select user ..."
          mt="md"
          onChange={(event) => setRoomMember(event.target.value)}
        />
        <Button mt={20} w={'100%'} onClick={createNewRoom}>
          Create New Room
        </Button>
      </Modal>

      <Group position="center">
        <Button onClick={open} >
          Create New Room
        </Button>
      </Group>
    </>
  );
}
