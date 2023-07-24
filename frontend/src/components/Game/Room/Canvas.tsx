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
import '@fontsource/audiowide';
import { useRouter } from 'next/router';
import { BiCircle } from 'react-icons/bi';
import { BsCircle, BsCircleFill, BsCircleHalf } from 'react-icons/bs';
import { FaCircle, FaRegCircle } from 'react-icons/fa';

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
  const finished = useRef(false);
  const { handleMouseMove } = usePlayers(
    host,
    guest,
    game.config.paddle,
    game.role,
    canvas,
    height,
    finished
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
  const [gamesCounter, setGamesCounter] = useState(1);
  const router = useRouter();
  useEffect(() => {
    let winner = 'opponent';
    game.socket
      ?.on('scored', (role, score) =>
        role === 'host' ? setHostScore(score) : setGuestScore(score)
      )
      .on('gameover', (value) => {
        finished.current = true;
        winner = value === game.role ? 'self' : 'opponent';
        // router.push('/game/results');
      })
      .on('games:counter', (count) => {
        // setGamesCounter(count);
        // requestAnimationFrame(() => {
        //   host.current?.style.setProperty('--ball-y', '0px');
        //   guest.current?.style.setProperty('--ball-y', '0px');
        // });
      })
      .on('left', () => {
        game.winner = 'self';
        winner = game.winner;
        // router.push('/game/results');
      });
    return () => {
      game.winner = winner;
      game.socket
        ?.off('scored')
        .off('gameover')
        .off('games:counter')
        .off('left');
      // .emit('leave', () => router.push('/game/results'));
    };
  }, []);

  const mapobj = maps[maps.findIndex(({ name }) => name === game.conf.map)];

  const classes: Record<string, Sx> = {
    canvas_container: {
      flexDirection: 'column',
      fontSize: '1.5em',
      fontWeight: 'bold',
      gap: '1em',
      height: '100%',
      margin: '0 auto',
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
      '&:before': {
        backgroundImage: `url(${mapobj.url})`,
        backgroundPosition: mapobj.backgroundPosition,
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover',
        content: "' '",
        height: '100%',
        position: 'absolute',
        width: '100%',
      },
    },
    canvas: {
      aspectRatio: (
        (width + 2 * game.config.radius) /
        (height + 2 * game.config.radius)
      ).toString(),
      backdropFilter: 'blur(10px)',
      borderBottom: '.1em solid',
      color: mapobj.color,
      borderImage: mapobj.color + ' 1',
      borderTop: '.1em solid',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      boxSizing: 'content-box',
      justifyContent: 'space-between',
      marginBlock: '0',
      maxWidth: '1000px',
      position: 'relative',
      zIndex: 2,
    },
    divider: {
      borderImage: mapobj.color + ' 1',
      borderLeft: '1px solid',
      borderRight: '1px solid',
      height: '100%',
      position: 'absolute',
      top: '0',
    },
    ball: {
      '--ball-x': '0px',
      '--ball-y': '0px',
      backgroundImage: mapobj.ballColor,
      borderRadius: mapobj.ballRadius,
      position: 'absolute',
      transform: 'translate(var(--ball-x), var(--ball-y))',
    },
    guest: {
      '--player-y': '0px',
      backgroundImage: mapobj.guestColor,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      borderRadius: mapobj.playerRadius,
      transform: 'translateY(calc(var(--player-y)))',
      width: '0.5%',
      translate: '100%',
    },
    host: {
      '--player-y': '0px',
      backgroundImage: mapobj.hostColor,
      borderRadius: mapobj.playerRadius,
      transform: 'translateY(calc(var(--player-y)))',
      width: '0.5%',
      translate: '-100%',
    },
    hostScore: {
      background: mapobj.color,
      backgroundClip: 'text',
      fontFamily: mapobj.font,
      fontSize: '2.5rem',
      left: '15%',
      position: 'absolute',
      textAlign: 'left',
      top: '1em',
      WebkitTextFillColor: 'transparent',
    },
    guestScore: {
      background: mapobj.color,
      backgroundClip: 'text',
      fontFamily: mapobj.font,
      fontSize: '2.5rem',
      position: 'absolute',
      right: '15%',
      textAlign: 'left',
      top: '1em',
      WebkitTextFillColor: 'transparent',
    },
    username: {
      background: mapobj.color,
      backgroundClip: 'text',
      fontSize: '1.6rem',
      WebkitTextFillColor: 'transparent',
      fontFamily: mapobj.gamesFont,
    },
    games: {
      background: mapobj.color,
      backgroundClip: 'text',
      fontFamily: mapobj.font,
      fontSize: '2.5rem',
      order: 2,
      WebkitTextFillColor: 'transparent',
      position: 'relative',
      zIndex: 2,
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1rem',
    },
    overlay: {
      backgroundColor: '#141b26',
      height: '100%',
      left: '0',
      opacity: '0.55',
      position: 'absolute',
      right: '0',
      width: '100%',
      zIndex: 1,
    },
    scoreboard: {
      maxWidth: '1000px',
      justifyContent: 'space-between',
      margin: '0 auto',
      marginBlock: '2rem',
      paddingBlock: '.7rem',
      paddingInline: '1rem',
      zIndex: 2,
      position: 'relative',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1rem',
    },
  };

  return (
    <>
      <Box sx={classes.overlay}></Box>
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        sx={classes.canvas_container}
      >
        <Text
          w="90%"
          ta="center"
          m="0 auto"
          my="1rem"
          maw="1000px"
          color={mapobj.color}
          sx={classes.games}
        >
          {gamesCounter}
          {gamesCounter === 1 ? 'st' : gamesCounter === 2 ? 'nd' : 'nth'} Round
        </Text>
        <Flex w="90%" sx={classes.scoreboard}>
          <Flex
            gap=".7rem"
            sx={{ order: game.role === 'host' ? 1 : 3, position: 'relative' }}
          >
            <Flex
              direction="column"
              sx={{
                justifyContent: 'space-between',
                order: 1,
                paddingBlock: '.5rem',
              }}
            >
              <Text sx={classes.username} size="1rem" color={mapobj.color}>
                {mapobj.gamesFont === "'Nightcore Demo'" && '('}
                {player.username}
                {mapobj.gamesFont === "'Nightcore Demo'" && ')'}
              </Text>
              <Box style={{ position: 'relative' }}>
                {Array.from({ length: game.conf.games + 2 }, (_, i) =>
                  i === 0 ? (
                    <FaCircle
                      size="1.5rem"
                      style={{ marginInline: '.1rem' }}
                      fill={mapobj.color}
                    />
                  ) : (
                    <FaRegCircle
                      size="1.5rem"
                      style={{ marginInline: '.1rem' }}
                      fill={i === 1 ? mapobj.color : mapobj.color + '75'}
                    />
                  )
                )}
              </Box>
            </Flex>
            <Avatar size="9rem" src={player.userImgProfile} />
          </Flex>
          <Flex
            gap=".7rem"
            sx={{
              order: game.role === 'host' ? 1 : 3,
              direction: 'rtl',
              position: 'relative',
            }}
          >
            <Flex
              direction="column"
              sx={{
                justifyContent: 'space-between',
                order: 1,
                paddingBlock: '.5rem',
              }}
            >
              <Text sx={classes.username} size="1rem" color={mapobj.color}>
                {mapobj.gamesFont === "'Nightcore Demo'" && '('}
                {game.opponent.username}
                {mapobj.gamesFont === "'Nightcore Demo'" && ')'}
              </Text>
              <Box style={{ position: 'relative', direction: 'rtl' }}>
                {Array.from({ length: game.conf.games + 2 }, (_, i) =>
                  i === 0 ? (
                    <FaCircle
                      size="1.5rem"
                      style={{ marginInline: '.1rem' }}
                      fill={mapobj.color}
                    />
                  ) : (
                    <FaRegCircle
                      size="1.5rem"
                      style={{ marginInline: '.1rem' }}
                      fill={i === 1 ? mapobj.color : mapobj.color + '75'}
                    />
                  )
                )}
              </Box>
            </Flex>
            <Avatar size="9rem" src={game.opponent.userImgProfile} />
          </Flex>
        </Flex>
        <Flex
          align="center"
          sx={classes.canvas}
          miw={width + 2 * game.config.radius}
          onMouseMove={handleMouseMove}
          ref={canvas}
          m="0 auto"
          w="90%"
        >
          <Box
            sx={classes.host}
            ref={host}
            style={{ height: (game.config.paddle * 100) / height + '%' }}
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
            style={{ height: (game.config.paddle * 100) / height + '%' }}
          />
        </Flex>
      </Box>
    </>
  );
}
