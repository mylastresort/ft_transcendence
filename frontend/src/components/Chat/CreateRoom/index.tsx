import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, TextInput, MultiSelect } from '@mantine/core';

const data = [
  { value: 'react', label: 'React' },
  { value: 'ng', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'vue', label: 'Vue' },
  { value: 'riot', label: 'Riot' },
  { value: 'next', label: 'Next.js' },
  { value: 'blitz', label: 'Blitz.js' },
];

export function CreateRoom() {
  const [opened, { open, close }] = useDisclosure(false);

  
  return (
    <>
      <Modal opened={opened} onClose={close} title="Create New Room">
        <TextInput
          label="Room name:"
          placeholder="Room name ..."
          data-autofocus
        />
        {/* <TextInput
          label="Select user:"
          placeholder="Select user ..."
          mt="md"
        /> */}
        <MultiSelect
          data={data}
          label="Your favorite frameworks/libraries"
          placeholder="Pick all that you like"
        />
      </Modal>

      <Group position="center">
        <Button onClick={open} maw={300} w={286}>
          Create New Room
        </Button>
      </Group>
    </>
  );
}
