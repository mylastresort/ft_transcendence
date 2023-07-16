import {
  Container,
  Grid,
  Center,
  Title,
  Avatar,
  Box,
  Text,
} from '@mantine/core';
import { User } from '@nextui-org/react';
import { useHover } from '@mantine/hooks';
import { useContext, useEffect, useState } from 'react';
import request from 'superagent';
import { UserContext } from '@/context/user';

interface Props {
  width: string | number | undefined;
}

interface SwitchButtonProps {
  selectedState: [number, React.Dispatch<React.SetStateAction<number>>];
}

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
  const [friends, setFriends] = useState([]);
  const user = useContext(UserContext);

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    request
      .post('http://localhost:4400/api/v1/friends/GetFriends')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({username: 'mbenkhat'})
      .then((res) => setFriends(res.body))
      .catch((err) => {
        return err;
      });
  }, []);

  return (
    <UserContext.Provider value={user}>
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
        friends.map((user: User) => <UserCard user={friends[0]} />)
      ) : (
        <></>
      )}
    </Container>
    </UserContext.Provider>
  );
}

export default ChatList;
