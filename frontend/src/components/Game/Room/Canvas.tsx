import { ActionIcon, Avatar, Input, Sx } from '@mantine/core';
import { Box, Flex, Text } from '@mantine/core';
import { motion } from 'framer-motion';
import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Player,
  PlayerContext,
  MapsContext,
  GameContext,
} from '@/context/game';
import useBall from './useBall';
import usePlayers from './usePlayers';
import { useRouter } from 'next/router';
import { FaCircle, FaRegCircle } from 'react-icons/fa';
import { ScrollArea } from '@mantine/core';
import { IoSend } from 'react-icons/io5';
import { useDisclosure } from '@mantine/hooks';
import { BsChatLeftText, BsCircleFill } from 'react-icons/bs';
import Lottie from 'lottie-react';
import batAnimation from '@/../public/images/maps/bat-animation.json';
import styles from './Canvas.module.css';

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
  const read = useRef(false);

  const [opened, handlers] = useDisclosure(false, {
    onOpen: () => (read.current = true),
  });
  const [messages, setMessages] = useState<ReactNode[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    let winner = 'opponent';
    game.socket
      ?.on('scored', (role, score) =>
        role === 'host' ? setHostScore(score) : setGuestScore(score)
      )
      .on('gameover', (value) => {
        finished.current = true;
        setHistory((history) => [...history, value]);
        winner = value === game.role ? 'self' : 'opponent';
        router.push('/game/results');
      })
      .on('games:counter', (count, winner) => {
        setGamesCounter(count);
        setHistory((history) => [...history, winner]);
        requestAnimationFrame(() => {
          host.current?.style.setProperty('--ball-y', '0px');
          guest.current?.style.setProperty('--ball-y', '0px');
        });
      })
      .on('left', () => {
        game.winner = 'self';
        winner = game.winner;
        router.push('/game/results');
      })
      .on('chat', (username, message) => {
        setMessages((messages) => [
          ...messages,
          <Box fw="lighter">
            <Text size=".8rem" display="inline" color="gray">
              {Date.now()}
            </Text>
            <Text size=".8rem" display="inline">
              {' - '}
            </Text>
            <Text size=".8rem" display="inline" color="grey">
              {username}
            </Text>
            <Text size=".8rem" display="inline">
              {': '}
            </Text>
            <Text size=".8rem" display="inline">
              {message}
            </Text>
          </Box>,
        ]);
      });
    return () => {
      game.winner = winner;
      game.socket
        ?.off('scored')
        .off('gameover')
        .off('games:counter')
        .off('left')
        .off('chat')
        .emit('leave', () => router.push('/game/results'));
    };
  }, []);

  useEffect(() => {
    if (!opened) read.current = false;
  }, [messages]);

  const msg = useRef<HTMLInputElement>(null);

  const mapobj = maps[maps.findIndex(({ name }) => name === game.conf.map)];

  if (!mapobj) {
    console.log(game);
    return (
      <Flex h="100%" align="center" justify="center">
        <Text>Map not found</Text>
      </Flex>
    );
  }

  const classes: Record<string, Sx> = {
    canvas_container: {
      flexDirection: 'column',
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
      aspectRatio: (width / height).toString(),
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
    chat_input: {
      backgroundColor: '',
      '& input': {
        backgroundColor: 'transparent',
        border: '0',
      },
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      backdropFilter: 'blur(10px)',
      zIndex: 2,
    },
    chat_content: {
      zIndex: 2,
    },
    chat: {
      position: 'absolute',
      bottom: '2%',
      margin: '0 auto',
      marginBottom: '1em',
      marginInline: '4em',
    },
  };

  return (
    <>
      <Box sx={classes.overlay} />
      {game.conf.map === 'WitchCraft' && (
        <div style={{ height: '100%', position: 'absolute', width: '100%' }}>
          <div
            style={{
              maxWidth: '1000px',
              position: 'relative',
              margin: '0 auto',
              height: '100%',
              zIndex: 1,
            }}
          >
            <Lottie
              animationData={batAnimation}
              style={{
                position: 'absolute',
                zIndex: 2,
                margin: '0 auto',
                width: '200px',
                opacity: 0.5,
                right: '10%',
                top: '30%',
              }}
            />
            <Lottie
              animationData={batAnimation}
              style={{
                position: 'absolute',
                zIndex: 2,
                margin: '0 auto',
                width: '200px',
                opacity: 0.5,
                right: '20%',
                left: '30%',
              }}
            />
            <Lottie
              animationData={batAnimation}
              style={{
                position: 'absolute',
                zIndex: 2,
                margin: '0 auto',
                width: '200px',
                opacity: 0.5,
                left: '15%',
                top: '20%',
              }}
            />
          </div>
        </div>
      )}
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
          {gamesCounter === 1
            ? 'st'
            : gamesCounter === 2
            ? 'nd'
            : gamesCounter === 3
            ? 'rd'
            : 'th'}{' '}
          Round
        </Text>
        <Flex w="90%" sx={classes.scoreboard}>
          <Flex
            gap=".7rem"
            sx={{
              order: game.role === 'host' ? 1 : 3,
              direction: game.role === 'host' ? 'ltr' : 'rtl',
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
                {player.username}
                {mapobj.gamesFont === "'Nightcore Demo'" && ')'}
              </Text>
              <Box style={{ position: 'relative' }}>
                {Array.from({ length: game.conf.games }, (_, i) =>
                  history.length > i ? (
                    <FaCircle
                      size="1.1rem"
                      style={{ marginInline: '.1rem' }}
                      fill={history[i] === game.role ? '#1dfc34' : '#ff5151'}
                    />
                  ) : (
                    <FaRegCircle
                      size="1.1rem"
                      style={{ marginInline: '.1rem' }}
                      fill={mapobj.fillColor + '75'}
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
              order: game.role === 'host' ? 3 : 1,
              direction: game.role === 'host' ? 'rtl' : 'ltr',
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
              <Box style={{ position: 'relative' }}>
                {Array.from({ length: game.conf.games }, (_, i) =>
                  history.length > i ? (
                    <FaCircle
                      size="1.1rem"
                      style={{ marginInline: '.1rem' }}
                      fill={history[i] !== game.role ? '#1dfc34' : '#ff5151'}
                    />
                  ) : (
                    <FaRegCircle
                      size="1.1rem"
                      style={{ marginInline: '.1rem' }}
                      fill={mapobj.fillColor + '75'}
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
        <Box sx={classes.chat} w="25rem">
          {opened && (
            <Box style={{ zIndex: 100 }}>
              <ScrollArea h="10rem" sx={classes.chat_content}>
                {messages}
              </ScrollArea>
              <form
                style={{ zIndex: 100 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!msg.current) return;
                  game.socket?.emit('chat', player.username, msg.current.value);
                  setMessages((messages) => [
                    ...messages,
                    <Box fw="lighter">
                      <Text size=".8rem" display="inline" color="gray">
                        {Date.now()}
                      </Text>
                      <Text size=".8rem" display="inline">
                        {' - '}
                      </Text>
                      <Text size=".8rem" display="inline" color="grey">
                        {player.username}
                      </Text>
                      <Text size=".8rem" display="inline">
                        {': '}
                      </Text>
                      <Text size=".8rem" display="inline">
                        {msg.current?.value}
                      </Text>
                    </Box>,
                  ]);
                  msg.current.value = '';
                }}
              >
                <Input
                  name="message"
                  sx={classes.chat_input}
                  rightSection={<IoSend />}
                  ref={msg}
                />
              </form>
            </Box>
          )}
          <ActionIcon
            variant="transparent"
            onClick={() => handlers.toggle()}
            style={{ zIndex: 100 }}
          >
            <BsChatLeftText size="1.5rem" />
            {!read.current && (
              <BsCircleFill
                size=".5rem"
                fill="#ff5151"
                style={{ position: 'absolute', left: '100%', top: '-10%' }}
              />
            )}
          </ActionIcon>
        </Box>
      </Box>
    </>
  );
}
