import { Flex, Button, Text } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '@/context/game';
import { useRouter } from 'next/router';

export default function Lobby() {
  const game = useContext(GameContext);
  const router = useRouter();
  const [timer, setTimer] = useState([0, 0]);

  useEffect(() => {
    let waiting = true;
    game.socket?.on('joined', (gameId, member, conf) => {
      waiting = false;
      game.gameId = gameId;
      game.conf.games = conf.hostSettableGames;
      game.conf.map = conf.hostWishedGameMap;
      game.conf.name = conf.hostWishedGameName;
      game.conf.speed = conf.hostWishedGameSpeed;
      game.opponent = member;
      game.ready = false;
      game.gameStatus = 'waiting';
      router.push(`/game/${gameId}`);
    });
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      setTimer([elapsed % 60, Math.floor(elapsed / 60)]);
    }, 1000);
    return () => {
      clearInterval(interval);
      if (waiting) game.socket?.emit('leave', () => router.push('/game'));
      game.socket?.off('joined');
    };
  }, []);

  return (
    <Flex justify="space-around" align="center" h="100%">
      {game.role ? (
        <>
          <div>
            <Text>Waiting for players to join...</Text>
            <Text>
              {!!timer[1] && `${timer[1]}m`} {timer[0]}s
            </Text>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              game.socket?.emit('leave', () => router.push('/game'))
            }
          >
            Cancel
          </Button>
        </>
      ) : (
        <Text>You must create or join a game first :(</Text>
      )}
    </Flex>
  );
}
