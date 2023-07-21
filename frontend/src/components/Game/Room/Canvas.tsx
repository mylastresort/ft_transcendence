import { Avatar, Sx } from '@mantine/core';
import { Box, Flex, Text } from '@mantine/core';
import { motion } from 'framer-motion';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Player,
  PlayerContext,
  MapsContext,
  GameContext,
} from '@/context/game';
import useBall from './useBall';
import usePlayers from './usePlayers';
import '@fontsource/orbitron';
import '@fontsource/creepster';
import '@fontsource/bebas-neue';
import { useRouter } from 'next/router';

export default function Canvas() {
  const rAFball = useRef(0);
  const ball = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const guest = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const cord = useRef({ '--ball-x': [0, 0], '--ball-y': [0, 0] });
  const allow = useRef(true);
  const player = useContext(PlayerContext) as Player;
  const game = useContext(GameContext);
  const height = game.config.limit[1] * 2;
  const width = game.config.limit[0] * 2;
  const { handleMouseMove } = usePlayers(
    host,
    guest,
    game.config.paddle,
    game.role,
    canvas,
    height
  );
  useBall(
    ball,
    host,
    guest,
    game.config.paddle,
    game.conf.speed,
    rAFball,
    cord,
    allow,
    canvas,
    width,
    height
  );
  const [hostScore, setHostScore] = useState(0);
  const [guestScore, setGuestScore] = useState(0);
  const maps = useContext(MapsContext);
  const [gamesCounter, setGamesCounter] = useState(0);
  const router = useRouter();
  useEffect(() => {
    let winner = 'opponent';
    game.socket
      ?.on('scored', (role, score) =>
        role === 'host' ? setHostScore(score) : setGuestScore(score)
      )
      .on('gameover', (value) => {
        game.winner = value === game.role ? 'self' : 'opponent';
        router.push('/game/results');
      })
      .on('games:counter', (count) => {
        setGamesCounter(count);
        requestAnimationFrame(() => {
          host.current?.style.setProperty('--ball-y', '0px');
          guest.current?.style.setProperty('--ball-y', '0px');
        });
      })
      .on('left', () => {
        game.winner = 'self';
        winner = game.winner;
        router.push('/game/results');
      });
    return () => {
      game.winner = winner;
      game.socket
        ?.off('scored')
        .off('gameover')
        .off('games:counter')
        .off('left')
        .emit('leave', () => router.push('/game/results'));
    };
  }, []);

  const mapobj = maps[maps.findIndex(({ name }) => name === game.conf.map)];

  const classes: Record<string, Sx> = {
    canvas_container: {
      alignItems: 'center',
      flexDirection: 'column',
      fontSize: '1.5em',
      fontWeight: 'bold',
      gap: '1em',
      height: '100%',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
      '&:before': {
        backgroundImage: `url(${mapobj.url})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        content: "' '",
        height: '100%',
        opacity: mapobj.backgroundOpacity,
        position: 'absolute',
        width: '100%',
      },
    },
    canvas: {
      aspectRatio: (
        (width + 2 * game.config.radius) /
        (height + 2 * game.config.radius)
      ).toString(),
      borderBottom: '1px solid',
      borderImage: mapobj.color + ' 1',
      borderTop: '1px solid',
      boxSizing: 'content-box',
      position: 'relative',
    },
    divider: {
      borderImage: mapobj.color + ' 1',
      borderLeft: '2.5px dashed',
      height: '100%',
      position: 'absolute',
      top: '0',
    },
    ball: {
      '--ball-x': '0px',
      '--ball-y': '0px',
      backgroundImage: mapobj.color,
      borderRadius: mapobj.ballRadius,
      position: 'absolute',
      transform: 'translate(var(--ball-x), var(--ball-y))',
    },
    guest: {
      '--player-y': '0px',
      borderRadius: mapobj.playerRadius,
      transform: 'translateY(calc(var(--player-y)))',
      width: '0.5%',
      backgroundImage: mapobj.guestColor,
    },
    host: {
      '--player-y': '0px',
      borderRadius: mapobj.playerRadius,
      transform: 'translateY(calc(var(--player-y)))',
      width: '0.5%',
      backgroundImage: mapobj.hostColor,
    },
    hostScore: {
      background: mapobj.color,
      backgroundClip: 'text',
      fontFamily: mapobj.font,
      fontSize: mapobj.fontSize,
      left: '15%',
      position: 'absolute',
      textAlign: 'left',
      textShadow: '0 0 3px' + ' ' + mapobj.color,
      top: '10px',
      WebkitTextFillColor: 'transparent',
    },
    guestScore: {
      background: mapobj.color,
      backgroundClip: 'text',
      fontFamily: mapobj.font,
      fontSize: mapobj.fontSize,
      position: 'absolute',
      right: '15%',
      textAlign: 'left',
      textShadow: '0 0 3px' + ' ' + mapobj.color,
      top: '10px',
      WebkitTextFillColor: 'transparent',
    },
    username: {
      background: mapobj.color,
      backgroundClip: 'text',
      fontSize: mapobj.fontSize,
      WebkitTextFillColor: 'transparent',
    },
    games: {
      background: mapobj.color,
      backgroundClip: 'text',
      fontFamily: mapobj.font,
      fontSize: mapobj.fontSize,
      order: 2,
      WebkitTextFillColor: 'transparent',
      zIndex: 1,
    },
  };

  return (
    <>
      <Box
        display="flex"
        component={motion.div}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        sx={classes.canvas_container}
      >
        <Flex
          maw="1000px"
          justify="space-between"
          align="center"
          w="70%"
          h="2%"
        >
          <Box sx={{ zIndex: 1, order: game.role === 'host' ? 1 : 3 }}>
            <Avatar
              sx={{ float: game.role === 'host' ? 'left' : 'right' }}
              src={player.userImgProfile}
            />
            <Text
              sx={classes.username}
              size="1rem"
              color={mapobj.color}
              ff={mapobj.font}
            >
              {player.username}
            </Text>
          </Box>
          <Text color={mapobj.color} size="1.5rem" sx={classes.games}>
            {gamesCounter} / {game.conf.games} round
          </Text>
          <Box sx={{ zIndex: 1, order: game.role === 'host' ? 3 : 1 }}>
            <Avatar
              sx={{ float: game.role === 'host' ? 'right' : 'left' }}
              src={game.opponent.userImgProfile}
            />
            <Text
              sx={classes.username}
              size="1rem"
              color={mapobj.color}
              ff={mapobj.font}
            >
              {game.opponent.username}
            </Text>
          </Box>
        </Flex>
        <Flex
          align="center"
          sx={classes.canvas}
          justify="space-between"
          maw="1000px"
          miw={width + 2 * game.config.radius}
          onMouseMove={handleMouseMove}
          ref={canvas}
          w="70%"
        >
          <Box
            sx={classes.host}
            ref={host}
            style={{
              height: (game.config.paddle * 100) / height + '%',
              translate: '-100%',
            }}
          />
          <Text sx={classes.hostScore} size="2rem">
            {hostScore}
          </Text>
          <Box>
            <Box sx={classes.divider} />
            <Box
              ref={ball}
              mih={(game.config.radius * 2 * 100) / height + '%'}
              miw={(game.config.radius * 2 * 100) / width + '%'}
              sx={classes.ball}
            />
          </Box>
          <Text sx={classes.guestScore} size="2rem">
            {guestScore}
          </Text>
          <Box
            sx={classes.guest}
            ref={guest}
            style={{
              height: (game.config.paddle * 100) / height + '%',
              translate: '100%',
            }}
          />
        </Flex>
      </Box>
    </>
  );
}
