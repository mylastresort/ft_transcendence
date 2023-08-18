import { Button, Group, Space, Stack, Text, Title } from '@mantine/core';
import { useContext } from 'react';
import styles from './Home.module.css';
import Link from 'next/link';
import { GameContext } from '@/context/game';
import { useRouter } from 'next/router';

export default function Home() {
  const game = useContext(GameContext);
  const router = useRouter();

  return (
    <Stack justify="center" align="center" className={styles.home}>
      <Title color="cyan" className={styles.headline}>
        Join the game now!
      </Title>
      <Text
        opacity="0.9"
        size="107%"
        color="white"
        className={styles.description}
      >
        <b>Get ready for some exciting gameplay!</b>
        <br />
        <Space h="1rem" />
        To <b>Join</b> a game, simply join an open game lobby or create your
        own, then run through a matchmaking system based on your current level.
        <br />
        <Space h=".5rem" />
        Ready to <b>Play</b>? Let the games begin!
      </Text>
      <Group w="100%" className={styles.actions} display="flex">
        <Button
          w="11rem"
          h="2.5rem"
          size="1rem"
          component={Link}
          href="/game/create"
        >
          New Game
        </Button>
        <Button
          w="11rem"
          h="2.5rem"
          variant="outline"
          style={{ borderWidth: '.12rem' }}
          size="1rem"
          onClick={() =>
            game.socket?.emit('join', { role: 'guest' }, () => {
              game.role = 'guest';
              router.push('/game/lobby');
            })
          }
        >
          Match Me!
        </Button>
      </Group>
    </Stack>
  );
}
