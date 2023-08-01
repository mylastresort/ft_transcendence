import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { use, useContext } from 'react';
import styles from './Home.module.css';
import Link from 'next/link';
import { GameContext, PlayerContext } from '@/context/game';
import { useRouter } from 'next/router';

export default function Home() {
  const game = useContext(GameContext);
  const router = useRouter();

  return (
    <Stack justify="center" align="center" className={styles.home}>
      <Title color="cyan" className={styles.headline}>
        Join the game now!
      </Title>
      <Text color="white" className={styles.description}>
        Get ready for some exciting gameplay! To join a game, simply select an
        open game lobby or create your own. Ready to play? Let the games begin!
      </Text>
      <Group w="100%" className={styles.actions} display="flex">
        <Button w="11rem" component={Link} href="/game/create">
          Create
        </Button>
        <Button
          w="11rem"
          variant="outline"
          onClick={() =>
            game.socket?.emit('join', { role: 'guest' }, () => {
              game.role = 'guest';
              router.push('/game/lobby');
            })
          }
        >
          Join
        </Button>
      </Group>
    </Stack>
  );
}
