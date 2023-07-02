import { Container, Grid, Center, Title, Avatar, Box } from '@mantine/core';
import { User } from '@nextui-org/react';
import { useHover } from '@mantine/hooks';
import { useState } from 'react';

interface Props {
  width: string | number | undefined;
}

interface SwitchButtonProps {
  selectedState: [number, React.Dispatch<React.SetStateAction<number>>];
}

const dummyUsers = [
  {
    name: 'Mohammed Benkhattab',
    img: 'https://cdn.intra.42.fr/users/85a6f5f2cca2789dcbc6e4884ac3f176/mbenkhat.jpg',
    lastmsg: 'Hello, this is first message',
  },
  {
    name: 'John Doe',
    img: 'https://cdn.intra.42.fr/users/85a6f5f2cca2789dcbc6e4884ac3f176/mbenkhat.jpg',
    lastmsg: 'Hello, this is first message',
  },
  {
    name: 'John Doe',
    img: 'https://cdn.intra.42.fr/users/85a6f5f2cca2789dcbc6e4884ac3f176/mbenkhat.jpg',
    lastmsg: 'Hello, this is first message',
  },
];
interface User {
  name: string;
  img: string;
  lastmsg: string;
}

function SwitchButton({ selectedState }: SwitchButtonProps) {
  const [selected, setSelected] = selectedState;
  return (
    <Center>
      <Grid
        style={{
          width: '286px',
          margin: '32px 0px',
          border: '1px solid #000000',
        }}
      >
        <Grid.Col
          span={6}
          style={{
            border: '1px solid #000000',
            backgroundColor:
              selected === 1 ? 'var(--secondary-color)' : 'var(--white-color)',
            cursor: 'pointer',
          }}
          onClick={() => setSelected(1)}
        >
          <Center>
            <Title order={3}>Friends</Title>
          </Center>
        </Grid.Col>
        <Grid.Col
          span={6}
          style={{
            border: '1px solid #000000',
            backgroundColor:
              selected === 2 ? 'var(--secondary-color)' : 'var(--white-color)',
            cursor: 'pointer',
          }}
          onClick={() => setSelected(2)}
        >
          <Center>
            <Title order={3}>Channels</Title>
          </Center>
        </Grid.Col>
      </Grid>
    </Center>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <Box
      maw={300}
      mx="auto"
      style={{
        backgroundColor: 'var(--white-color)',
        borderRadius: '10px',
        border: '2px solid var(--secondary-color)',
        padding: '10px',
        margin: '15px auto',
      }}  
    >
      <User
        src={user.img}
        name={user.name}
        description={user.lastmsg}
        size="xl"
      />
    </Box>
  );
}

function ChannelsList({ users }: { users: User[] }) {
  return <></>;
}

function ChatList({ width }: Props) {
  let selectedState = useState(1);
  const [selected, setSelected] = selectedState;
  return (
    <Container
      style={{
        backgroundColor: '#C1C1C1',
        // height: '100%',
        width: width,
        maxWidth: width,
      }}
    >
      <SwitchButton selectedState={selectedState} />
      {selected === 1 ? (
        dummyUsers.map((user: User) => <UserCard user={dummyUsers[0]} />)
      ) : (
        <></>
      )}
    </Container>
  );
}

export default ChatList;
