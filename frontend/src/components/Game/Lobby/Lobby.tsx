import { Flex, Button, Box } from '@mantine/core';
import React, { Dispatch, useContext, useEffect } from 'react';
import { Action } from '../game.reducer';
import styles from './Lobby.module.css';
import Profile from './Profile';
import {
  DispatchContext,
  Player,
  PlayerContext,
  SocketContext,
} from '../context';
import { Socket } from 'socket.io-client';

export default function Lobby({ gameId, ready, user, opponent }) {
  const dispatch = useContext(DispatchContext) as Dispatch<Action>;
  const socket = useContext(SocketContext) as Socket;
  const player = useContext(PlayerContext) as Player;

  useEffect(() => {
    if (gameId)
      socket.emit('ready', ready, () =>
        dispatch({ type: 'READY', value: ready })
      );
  }, [gameId, ready]);

  return (
    <Box className={styles.lobby}>
      <Flex gap={0} className={styles.profiles}>
        <Profile user={{ ...user, ...player.user, ...player }} />
        <Profile user={opponent} />
      </Flex>
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        justify="space-evenly"
        align="center"
        className={styles.actions}
      >
        <Button
          variant="outline"
          onClick={() =>
            gameId
              ? socket.emit('leave', () => dispatch({ type: 'LEAVE' }))
              : dispatch({ type: 'LEAVE' })
          }
        >
          Leave
        </Button>
        <Button
          disabled={!gameId}
          variant={ready ? 'filled' : 'outline'}
          onClick={() =>
            socket.emit('ready', !ready, () =>
              dispatch({ type: 'READY', value: !ready })
            )
          }
        >
          Ready
        </Button>
      </Flex>
    </Box>
  );
}
