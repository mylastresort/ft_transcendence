import { Box, Button, Center, Flex, Space, Text } from '@mantine/core';
import { motion } from 'framer-motion';
import conffetti from '@/../public/images/conffetti_animation.json';
import goldencup from '@/../public/images/winner_animation.json';
import Lottie from 'lottie-react';
import styles from './Results.module.css';
import { GameContext, PlayerContext } from '@/context/game';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Results() {
  const game = useContext(GameContext);
  const player = useContext(PlayerContext);
  const router = useRouter();

  const winner = game.winner === 'self' ? player : game.opponent;
  const loser = game.winner === 'self' ? game.opponent : player;
  const isWinner = game.winner === 'self';

  useEffect(() => {
    return () => {
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
    }
  }, []);

  return (
    <Flex justify="center" align="center" h="100%">
      {isWinner && (
        <Lottie
          loop={false}
          autoPlay={false}
          animationData={conffetti}
          className={styles.conffetti}
        />
      )}
      <Box>
        <Flex>
          <div className={styles.goldcup_winner}>
            <motion.img
              className={styles.goldcup_winner_profile}
              src={winner?.userImgProfile}
              alt="profile"
              initial={{ y: -100, scale: 1.1 }}
              animate={{ y: 0, scale: 1 }}
            />
            <Lottie autoplay={true} loop={false} animationData={goldencup} />
          </div>
          <div className={styles.goldcup_loser}>
            <motion.img
              className={styles.goldcup_loser_profile}
              src={loser?.userImgProfile}
              alt="profile"
              initial={{ y: -100, scale: 1.1 }}
              animate={{ y: 0, scale: 1 }}
            />
            <Lottie autoplay={true} loop={false} animationData={goldencup} />
          </div>
        </Flex>
        <Space h="1rem" />
        <Text
          color={isWinner ? 'yellow' : 'red'}
          fw="bold"
          ta="center"
          size="4rem"
        >
          {(isWinner ? 'winner' : 'you lose').split('').map((letter, index) => (
            <Box
              component={motion.span}
              tt="capitalize"
              px="0.15rem"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              {letter}
            </Box>
          ))}
        </Text>
        <Space h="2rem" />
        <Center>
          <Button onClick={() => router.push('/game')}>
            Play Again!
          </Button>
        </Center>
      </Box>
    </Flex>
  );
}
