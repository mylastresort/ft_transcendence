import { Action } from '../game.reducer';
import { Box, Flex, Group, Text } from '@mantine/core';
import { motion } from 'framer-motion';
import Player from './Player';
import React, {
  Dispatch,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DispatchContext, MapsContext, SocketContext } from '../context';
import { Socket } from 'socket.io-client';
import styles from './Canvas.module.css';
import useBall from './useBall';
import usePlayers from './usePlayers';

export default function Canvas({
  radius,
  role,
  width,
  height,
  paddle,
  map,
  speed,
  name,
  games,
}) {
  const rAFball = useRef(0);
  const Ball = useRef<HTMLDivElement>(null);
  const Host = useRef<HTMLDivElement>(null);
  const Guest = useRef<HTMLDivElement>(null);
  const cord = useRef({ '--ball-x': [0, 0], '--ball-y': [0, 0] });
  const allow = useRef(true);
  const { handleMouseMove } = usePlayers(
    Host as MutableRefObject<HTMLDivElement>,
    Guest as MutableRefObject<HTMLDivElement>,
    paddle,
    height,
    role
  );
  useBall(
    Ball as MutableRefObject<HTMLDivElement>,
    Host as MutableRefObject<HTMLDivElement>,
    Guest as MutableRefObject<HTMLDivElement>,
    width,
    paddle,
    speed,
    rAFball,
    cord,
    allow
  );
  const [hostScore, setHostScore] = useState(0);
  const [guestScore, setGuestScore] = useState(0);
  const socket = useContext(SocketContext) as Socket;
  const dispatch = useContext(DispatchContext) as Dispatch<Action>;
  const maps = useContext(MapsContext);
  const [gamesCounter, setGamesCounter] = useState(0);
  useEffect(() => {
    socket
      .on('scored', (role, score) =>
        role === 'host' ? setHostScore(score) : setGuestScore(score)
      )
      .on('gameover', (role) => {
        dispatch({ type: 'LEAVE' });
      })
      .on('games:counter', setGamesCounter);
    return () => {
      socket.off('scored').off('gameover').off('games:counter');
    };
  }, []);

  return (
    <Box
      display="flex"
      component={motion.div}
      className={styles.canvas_container}
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      sx={{
        '&:before': {
          backgroundImage: `url(${
            maps[maps.findIndex(({ name }) => name === map)].url
          })`,
        },
      }}
    >
      <Text className={styles.name}>Room's name: {name}</Text>
      <Flex
        align="center"
        justify="space-between"
        onMouseMove={handleMouseMove}
        mih={height + 2 * radius}
        miw={width + 2 * radius}
        className={styles.canvas}
      >
        <Player isLeft ref={Host} paddle={paddle} />
        <Text className={styles.hostScore} size="2rem">
          {hostScore}
        </Text>
        <Box>
          <Box className={styles.divider} />
          <Box
            ref={Ball}
            h={radius * 2}
            w={radius * 2}
            className={styles.ball}
          />
        </Box>
        <Text className={styles.guestScore} size="2rem">
          {guestScore}
        </Text>
        <Player ref={Guest} paddle={paddle} />
      </Flex>
      <Text>
        {gamesCounter} / {games} round
      </Text>
    </Box>
  );
}
