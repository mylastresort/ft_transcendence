import { Button, Text } from '@mantine/core';
import { Box, Flex } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import styles from '../Lobby/Lobby.module.css';
import '@fontsource/orbitron';
import '@fontsource/creepster';
import '@fontsource/bebas-neue';
import Profile from './Profile';
import { GameContext, PlayerContext } from '@/context/game';
import { useRouter } from 'next/router';
import Canvas from './Canvas';
import request from 'superagent';

export default function Accept() {
  const game = useContext(GameContext);
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const player = useContext(PlayerContext);
  const [status, setStatus] = useState(game.gameStatus);

  useEffect(() => {
    let started = false;
    game.socket
      ?.on('started', (value) => {
        started = true;
        game.config = value;
        game.gameStatus = 'playing';
        setStatus('playing');
      })
      .on('cancelled', () => router.push('/game'))
    return () => {
      if (!started) game.socket?.emit('leave', () => router.push('/game'));
      game.socket?.off('started').off('cancelled');
    };
  }, []);

  useEffect(() => {
    if (game.socket && !game.gameStatus && router.query.id) {
      request
        .get(`http://localhost:4400/api/v1/game/${router.query.id}`)
        .set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`)
        .then((res) => {
          if (res.status !== 200) return router.push('/game');
          game.conf = res.body.conf;
          game.role =
            player?.username === res.body.host.username ? 'host' : 'guest';
          game.opponent = game.role === 'host' ? res.body.guest : res.body.host;
          game.gameStatus = res.body.status;
          game.gameId = router.query.id as string;
          router.push(`/game/${router.query.id}`);
        })
        .catch(console.error);
    }
  }, [router.query.id]);

  return status === 'playing' ? (
    <Canvas />
  ) : (
    <Flex align="center" h="100%">
      {game.conf.isInvite && <Text>Invite rooms are special</Text>}
      <Box className={styles.lobby}>
        <Flex
          gap={0}
          direction={{ base: 'column', sm: 'row' }}
          className={styles.profiles}
        >
          <Profile player={player!} />
          <Profile player={game.opponent} />
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
              game.socket?.emit('leave', () => router.push('/game'))
            }
          >
            Leave
          </Button>
          <Button
            disabled={!game.gameId}
            variant={ready ? 'filled' : 'outline'}
            onClick={() =>
              game.socket?.emit(
                'ready',
                { ready: !ready, gameId: game.gameId },
                () => setReady(!ready)
              )
            }
          >
            Ready
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
