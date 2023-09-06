import { Button, Space, Text, Title } from '@mantine/core';
import { Box, Flex } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import styles from '../Lobby/Lobby.module.css';
import Profile from './Profile';
import { GameContext, Player, PlayerContext } from '@/context/game';
import { useRouter } from 'next/router';
import Canvas from './Canvas';
import request from 'superagent';
import { WsContext } from '@/context/WsContext';

export default function Accept() {
  const game = useContext(GameContext);
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const player = useContext(PlayerContext);
  const [status, setStatus] = useState<{ gameStatus: string; error?: Error }>({
    gameStatus: game.gameStatus,
  });
  const [self, setSelf] = useState('online');
  const [opponent, setOpponent] = useState('offline');
  const ws = useContext(WsContext);

  useEffect(() => {
    function setOffline() {
      setSelf('offline');
    }
    let started = false;
    if (game.gameStatus === 'playing')
      setStatus({ gameStatus: 'in-game' });
    else {
      if (game.opponent.username)
        game.socket?.emit('watch-user-status', game.opponent.userId);
      request
        .get('/api/v1/game/player/me/currentGame')
        .set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`)
        .then((res) => {
          if (res.status !== 200) return router.push('/game');
          if (res.body) setStatus({ gameStatus: 'in-game' });
        });
      game.socket
        ?.on('started', (value) => {
          started = true;
          game.config = value;
          game.gameStatus = 'playing';
          setStatus({ gameStatus: 'playing' });
        })
        .on('cancelled', () => {
          setStatus({ gameStatus: 'cancelled' });
          router.push('/game');
        })
        .on('user-status', (_, status) => setOpponent(status))
        .on('disconnect', setOffline);
    }
    return () => {
      if (!started) {
        if (!game.conf.isInvite)
          game.socket?.emit('leave');
        else {
          request
            .post(
              `${process.env.BACKEND_DOMAIN}/api/v1/game/invite/cancel/${game.gameId}`
            )
            .set(
              'Authorization',
              `Bearer ${localStorage.getItem('jwtToken')}`
            )
            .catch(() => { });
          ws.emit('ClearNotification', {
            gameid: game.gameId,
            receiverId: player?.userId,
            senderId: game.opponent.userId,
          });
        }
        game.gameId = '';
        game.ready = false;
        game.winner = '';
        game.role = '';
        game.gameStatus = '';
        game.conf = {
          isInvite: false,
          map: 0,
          games: 3,
          speed: 5,
          name: '',
        }
        game.opponent = {
          username: '',
          userImgProfile: '',
        } as Player;
      }
      game.socket
        ?.emit('unwatch-user-status', game.opponent.userId)
        .off('started')
        .off('cancelled')
        .off('user-status')
        .off('disconnect', setOffline);
    };
  }, []);

  useEffect(() => {
    if (game.socket && !game.gameStatus && router.query.id) {
      request
        .get(`/api/v1/game/${router.query.id}`)
        .set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`)
        .then((res) => {
          if (res.status !== 200) return router.push('/game');
          game.conf = res.body.conf;
          game.role =
            player?.username === res.body.host.username ? 'host' : 'guest';
          game.opponent = game.role === 'host' ? res.body.guest : res.body.host;
          game.socket?.emit('watch-user-status', game.opponent.userId);
          game.gameStatus = res.body.status;
          ws.emit('UserStatus', {
            user1: game.opponent.userId,
            user2: player?.userId,
          });
          game.gameId = router.query.id as string;
          setStatus({ gameStatus: res.body.status });
        })
        .catch((err) => setStatus({ gameStatus: 'invalid', error: err }));
    }
    return () => {
      game.socket
        ?.emit('unwatch-user-status', game.opponent.userId)
        .off('user-status');
    };
  }, [router.query.id]);

  useEffect(() => {
    if (game.gameStatus === 'playing')
      window.localStorage.setItem('playing', 'true');
    return () => {
      window.localStorage.removeItem('playing');
    }
  }, [game.gameStatus]);

  return status.gameStatus === 'invalid' ? (
    <Flex justify="center" align="center" h="100%">
      <Text>
        Invalid room {!!status.error && `because: ${status.error.message}`}
      </Text>
    </Flex>
  ) : !game.opponent.username ? (
    <Flex align="center" justify="center" h="100%">
      <Text>Loading game...</Text>
    </Flex>
  ) : status.gameStatus === 'cancelled' ? (
    <Flex align="center" justify="center" h="100%">
      <Text>The game is cancelled</Text>
    </Flex>
  ) : status.gameStatus === 'playing' ? (
    <Canvas />
  ) : status.gameStatus === 'in-game' ? (
    <Flex align="center" justify="center" h="100%">
      <Text>Already in game</Text>
    </Flex>
  ) : (
    <Flex
      h="100%"
      justify="center"
      gap="3rem"
      wrap="wrap-reverse"
      style={{ alignContent: 'center' }}
    >
      <Box style={{ flexBasis: '500px' }} p="1rem">
        <Title my="1rem" color="cyan">
          Customization Included
        </Title>
        <Box>
          <b>
            Ball Speed:{' '}
            {game.conf.speed >= 5
              ? 'Very fast'
              : game.conf.speed >= 4
                ? 'Fast'
                : game.conf.speed >= 3
                  ? 'Normal'
                  : game.conf.speed >= 2
                    ? 'Slow'
                    : 'Very slow'}
          </b>
          <Space h="1em" />
          <b>No Rounds: {game.conf.games}</b>
        </Box>
        <Space h="2em" />
        <Title my="1rem" color="cyan">
          Gameplay Instructions
        </Title>
        <Box>
          <b>Press Ready</b> to start the game. Wait for the opponent to be
          ready to launch the game. You both will receive the ball at 1 second
          delay.
          <Space h="1em" />
          You can <b>leave</b> at anytime, only then the game will be canceled.
          Leaving the current page also cancels the game. You will be count as
          loser and the opponent wins.
          <Space h="1em" />
          Score <b>11 points</b> to win a round. The winner dominates the total
          playable rounds. (win 2/3 rounds to win the whole game with 3 rounds)
          <Space h="1em" />
          Stay Sharp!
        </Box>
      </Box>
      <Box className={styles.lobby} style={{ flexBasis: '800px' }}>
        <Flex
          gap={0}
          direction={{ base: 'column', sm: 'row' }}
          className={styles.profiles}
        >
          <Profile player={player!} status={self} ready={ready} />
          <Profile
            player={game.opponent}
            status={opponent === 'ready' ? 'online' : opponent}
            ready={opponent === 'ready'}
          />
        </Flex>
        <Flex
          gap="1rem"
          direction="column"
          align="center"
          className={styles.actions}
        >
          <Button
            h="2.7em"
            w="12rem"
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
          {game.conf.isInvite && (
            <Button
              h="2.7em"
              w="12rem"
              onClick={() => {
                game.socket?.emit('leave')
                router.push('/game')
                ws.emit('ClearNotification', {
                  gameid: game.gameId,
                  receiverId: player?.userId,
                  senderId: game.opponent.userId,
                });
              }}
            >
              Cancel Invite
            </Button>
          )}
          {
            !game.conf.isInvite &&
            <Button
              h="2.7em"
              w="12rem"
              variant="subtle"
              onClick={() => {
                game.socket?.emit('leave')
                router.push('/game')
              }
              }
            >
              Leave
            </Button>
          }
        </Flex>
      </Box>
    </Flex>
  );
}
