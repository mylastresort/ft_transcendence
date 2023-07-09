import { Action } from '../game.reducer';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { Dispatch, useContext } from 'react';
import { DispatchContext, SocketContext } from '../context';
import { Socket } from 'socket.io-client';
import { UserContext } from '@/context/user';
import styles from './Home.module.css';

export default function Home() {
  const { data } = useContext(UserContext);
  const socket = useContext(SocketContext) as Socket;
  const dispatch = useContext(DispatchContext) as Dispatch<Action>;

  return (
    <Stack justify="center" align="center" className={styles.home}>
      <Title color="cyan" className={styles.headline}>
        Join the game now!
      </Title>
      <Text className={styles.description}>
        Get ready for some exciting gameplay! To join a game, simply select an
        open game lobby or create your own. Ready to play? Let the games begin!
      </Text>
      <Group className={styles.actions} display="flex">
        <Button onClick={() => dispatch({ type: 'CUSTOM' })}>Create</Button>
        <Button
          variant="outline"
          onClick={() =>
            socket.emit('join', { role: 'guest' }, () =>
              dispatch({ type: 'LOBBY', value: { role: 'guest' } })
            )
          }
        >
          Join
        </Button>
      </Group>
    </Stack>
  );
}
