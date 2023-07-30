import { ActionIcon, Avatar, Input, MediaQuery, Sx } from '@mantine/core';
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
import { WsContext } from '@/context/WsContext';

export default function Canvas({ mode = 'human' }) {
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
  const playersCurrent = useRef({ host: 0, guest: 0 });
  const [opponent, setOpponent] = useState('offline');
  const { handleMouseMove } = usePlayers(
    host,
    guest,
    game.config.paddle,
    game.role,
    canvas,
    height,
    finished,
    playersCurrent,
    mode === 'ai',
    cord
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
    height,
    game.config.radius
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
  const socket = useContext(WsContext);

  useEffect(() => {
    let winner = 'opponent';
    socket.emit('ClearNotification', {
      gameid: game.gameId,
      user1: player.userId,
      user2: game.opponent.userId,
    });
    socket.emit('InGame', {
      user1Id: player?.userId,
      user2Id: game.opponent.userId,
    });
    function leave() {
      socket.emit('GameEnded', {
        user1Id: player.userId,
        user2Id: game.opponent.userId,
      });
      router.push('/game/results');
    }
    game.socket
      ?.on('scored', (role, score) =>
        role === 'host' ? setHostScore(score) : setGuestScore(score)
      )
      .on('gameover', (value) => {
        finished.current = true;
        setHistory((history) => [...history, value]);
        winner = value === game.role ? 'self' : 'opponent';
        leave();
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
        leave();
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
        .emit('leave', leave);
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

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#141b26',
          height: '100%',
          left: '0',
          opacity: '0.55',
          position: 'absolute',
          right: '0',
          width: '100%',
          zIndex: 1,
        }}
      />
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
        sx={{
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
        }}
      >
        <Text
          w="90%"
          ta="center"
          m="0 auto"
          my="min(1vw, 1vh)"
          maw="min(90vh, 90%)"
          color={mapobj.color}
          sx={{
            background: mapobj.color,
            backgroundClip: 'text',
            fontFamily: mapobj.font,
            fontSize: 'min(3vh, 3vw)',
            order: 2,
            WebkitTextFillColor: 'transparent',
            position: 'relative',
            zIndex: 2,
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            paddingBlock: '.5rem',
          }}
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
        <Flex
          sx={{
            maxWidth: 'min(90vh, 90%)',
            justifyContent: 'space-between',
            margin: '0 auto',
            marginBlock: 'min(1vh, 1vw)',
            paddingBlock: '.7rem',
            paddingInline: '1rem',
            zIndex: 2,
            position: 'relative',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            ['@media (min-aspect-ratio: 5/4)']: {
              display: 'none',
            },
          }}
        >
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
              <Text
                sx={{
                  background: mapobj.color,
                  backgroundClip: 'text',
                  fontSize: 'min(2vh, 2vw)',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: mapobj.gamesFont,
                }}
                size="1rem"
                color={mapobj.color}
              >
                {mapobj.gamesFont === "'Nightcore Demo'" && '('}
                {player.username}
                {mapobj.gamesFont === "'Nightcore Demo'" && ')'}
              </Text>
              <Box style={{ position: 'relative' }}>
                {Array.from({ length: game.conf.games }, (_, i) =>
                  history.length > i ? (
                    <FaCircle
                      size="min(1vh, 1vw)"
                      style={{ marginInline: '.1rem' }}
                      fill={history[i] === game.role ? '#1dfc34' : '#ff5151'}
                    />
                  ) : (
                    <FaRegCircle
                      size="min(1vh, 1vw)"
                      style={{ marginInline: '.1rem' }}
                      fill={
                        mapobj.fillColor + (history.length === i ? '' : '80')
                      }
                    />
                  )
                )}
              </Box>
            </Flex>
            <Box
              w="min(5vh, 5vw)"
              bg="blue"
              h="min(5vh, 5vw)"
              style={{ position: 'relative' }}
            >
              <Avatar size="min(5vh, 5vw)" src={player.userImgProfile} />
              <BsCircleFill
                fill={'green'}
                size=".9rem"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  transform: 'translate(25%, 25%)',
                  borderRadius: '50%',
                  border: '2px solid var(--sidebar-color)',
                }}
              />
            </Box>
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
              <Text
                sx={{
                  background: mapobj.color,
                  backgroundClip: 'text',
                  fontSize: 'min(2vh, 2vw)',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: mapobj.gamesFont,
                }}
                size="1rem"
                color={mapobj.color}
              >
                {mapobj.gamesFont === "'Nightcore Demo'" && '('}
                {game.opponent.username}
                {mapobj.gamesFont === "'Nightcore Demo'" && ')'}
              </Text>
              <Box style={{ position: 'relative' }}>
                {Array.from({ length: game.conf.games }, (_, i) =>
                  history.length > i ? (
                    <FaCircle
                      size="min(1vh, 1vw)"
                      style={{ marginInline: '.1rem' }}
                      fill={history[i] !== game.role ? '#1dfc34' : '#ff5151'}
                    />
                  ) : (
                    <FaRegCircle
                      size="min(1vh, 1vw)"
                      style={{ marginInline: '.1rem' }}
                      fill={
                        mapobj.fillColor + (history.length === i ? '' : '80')
                      }
                    />
                  )
                )}
              </Box>
            </Flex>
            <Box
              w="min(5vh, 5vw)"
              bg="blue"
              h="min(5vh, 5vw)"
              style={{ position: 'relative' }}
            >
              <Avatar size="min(5vh, 5vw)" src={game.opponent.userImgProfile} />
              <BsCircleFill
                fill={'green'}
                size=".9rem"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  transform: 'translate(25%, 25%)',
                  borderRadius: '50%',
                  border: '2px solid var(--sidebar-color)',
                }}
              />
            </Box>
          </Flex>
        </Flex>
        <Box
          sx={{
            ['@media (min-aspect-ratio: 5/4)']: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'start',
              gap: '1em',
              paddingInline: '1em',
            },
          }}
        >
          <Box
            display="none"
            sx={{
              ['@media (min-aspect-ratio: 5/4)']: {
                display: 'block',
                flexGrow: 1,
                margin: '0 auto',
                zIndex: 3,
                paddingInline: '2rem',
                paddingBlock: '1rem',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                borderRadius: '1rem',
              },
            }}
          >
            <Box style={{ position: 'relative' }} w="10vh" h="10vh">
              <Avatar m="0 auto" size="10vh" src={player.userImgProfile} />
              <BsCircleFill
                fill={'green'}
                size="1rem"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  transform: 'translate(25%, 25%)',
                  borderRadius: '50%',
                  border: '2px solid var(--sidebar-color)',
                }}
              />
            </Box>
            <Flex
              direction="column"
              sx={{
                justifyContent: 'space-between',
                order: 1,
                paddingBlock: '.5rem',
                margin: '0 auto',
              }}
            >
              <Text
                sx={{
                  background: mapobj.color,
                  backgroundClip: 'text',
                  fontSize: 'min(2vh, 2vw)',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: mapobj.gamesFont,
                }}
                size="1rem"
                color={mapobj.color}
                m="0 auto"
              >
                {mapobj.gamesFont === "'Nightcore Demo'" && '('}
                {player.username}
                {mapobj.gamesFont === "'Nightcore Demo'" && ')'}
              </Text>
              <Box style={{ position: 'relative' }} m="0 auto">
                {Array.from({ length: game.conf.games }, (_, i) =>
                  history.length > i ? (
                    <FaCircle
                      size="min(1vh, 1vw)"
                      style={{ marginInline: '.1rem' }}
                      fill={history[i] === game.role ? '#1dfc34' : '#ff5151'}
                    />
                  ) : (
                    <FaRegCircle
                      size="min(1vh, 1vw)"
                      style={{ marginInline: '.1rem' }}
                      fill={
                        mapobj.fillColor + (history.length === i ? '' : '80')
                      }
                    />
                  )
                )}
              </Box>
            </Flex>
          </Box>
          <Flex
            align="center"
            sx={{
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
              position: 'relative',
              zIndex: 2,
              flexBasis: '100%',
            }}
            miw={width + 2 * game.config.radius}
            onMouseMove={handleMouseMove}
            ref={canvas}
            m="0 auto"
            maw="min(90vh, 80vw)"
          >
            <Box
              sx={{
                '--player-y': '0px',
                backgroundImage: mapobj.hostColor,
                borderRadius: mapobj.playerRadius,
                transform: 'translateY(calc(var(--player-y)))',
                width: '0.5%',
                translate: '-100%',
              }}
              ref={host}
              style={{ height: (game.config.paddle * 100) / height + '%' }}
            />
            <Text
              sx={{
                background: mapobj.color,
                backgroundClip: 'text',
                fontFamily: mapobj.font,
                fontSize: '2.5rem',
                left: '15%',
                position: 'absolute',
                textAlign: 'left',
                top: '1em',
                WebkitTextFillColor: 'transparent',
              }}
              size="2rem"
            >
              {hostScore}
            </Text>
            <Box>
              <Box
                sx={{
                  borderImage: mapobj.color + ' 1',
                  borderLeft: '1px solid',
                  borderRight: '1px solid',
                  height: '100%',
                  position: 'absolute',
                  top: '0',
                }}
              />
              <Box
                ref={ball}
                mih={(game.config.radius * 2 * 100) / height + '%'}
                miw={(game.config.radius * 2 * 100) / width + '%'}
                sx={{
                  '--ball-x': '0px',
                  '--ball-y': '0px',
                  backgroundImage: mapobj.ballColor,
                  borderRadius: mapobj.ballRadius,
                  position: 'absolute',
                  transform:
                    'translate(var(--ball-x), var(--ball-y)) translate(-50%, -50%)',
                }}
              />
            </Box>
            <Text
              sx={{
                background: mapobj.color,
                backgroundClip: 'text',
                fontFamily: mapobj.font,
                fontSize: '2.5rem',
                position: 'absolute',
                right: '15%',
                textAlign: 'left',
                top: '1em',
                WebkitTextFillColor: 'transparent',
              }}
              size="2rem"
            >
              {guestScore}
            </Text>
            <Box
              sx={{
                '--player-y': '0px',
                backgroundImage: mapobj.guestColor,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: mapobj.playerRadius,
                transform: 'translateY(calc(var(--player-y)))',
                width: '0.5%',
                translate: '100%',
              }}
              ref={guest}
              style={{ height: (game.config.paddle * 100) / height + '%' }}
            />
          </Flex>
          <Box
            display="none"
            sx={{
              ['@media (min-aspect-ratio: 5/4)']: {
                display: 'block',
                flexGrow: 1,
                margin: '0 auto',
                zIndex: 3,
                paddingInline: '2rem',
                paddingBlock: '1rem',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                borderRadius: '1rem',
              },
            }}
          >
            <Box style={{ position: 'relative' }} w="10vh" h="10vh">
              <Avatar
                m="0 auto"
                size="10vh"
                src={game.opponent.userImgProfile}
              />
              <BsCircleFill
                fill={'green'}
                size="1rem"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  transform: 'translate(25%, 25%)',
                  borderRadius: '50%',
                  border: '2px solid var(--sidebar-color)',
                }}
              />
            </Box>
            <Flex
              direction="column"
              sx={{
                justifyContent: 'space-between',
                order: 1,
                paddingBlock: '.5rem',
              }}
            >
              <Text
                sx={{
                  background: mapobj.color,
                  backgroundClip: 'text',
                  fontSize: 'min(2vh, 2vw)',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: mapobj.gamesFont,
                }}
                size="1rem"
                color={mapobj.color}
                m="0 auto"
              >
                {mapobj.gamesFont === "'Nightcore Demo'" && '('}
                {game.opponent.username}
                {mapobj.gamesFont === "'Nightcore Demo'" && ')'}
              </Text>
              <Box
                style={{ position: 'relative', direction: 'rtl' }}
                m="0 auto"
              >
                {Array.from({ length: game.conf.games }, (_, i) =>
                  history.length > i ? (
                    <FaCircle
                      size="min(1vh, 1vw)"
                      style={{ marginInline: '.1rem' }}
                      fill={history[i] !== game.role ? '#1dfc34' : '#ff5151'}
                    />
                  ) : (
                    <FaRegCircle
                      size="min(1vh, 1vw)"
                      style={{ marginInline: '.1rem' }}
                      fill={
                        mapobj.fillColor + (history.length === i ? '' : '80')
                      }
                    />
                  )
                )}
              </Box>
            </Flex>
          </Box>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: '2%',
            margin: '0 auto',
            marginBottom: '1em',
            marginInline: '4em',
          }}
          w="25rem"
        >
          {opened && (
            <Box style={{ zIndex: 100 }}>
              <ScrollArea
                h="10rem"
                sx={{
                  zIndex: 2,
                }}
              >
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
                  sx={{
                    backgroundColor: '',
                    '& input': {
                      backgroundColor: 'transparent',
                      border: '0',
                    },
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 2,
                  }}
                  rightSection={<IoSend />}
                  ref={msg}
                />
              </form>
            </Box>
          )}
          <ActionIcon
            variant="transparent"
            onClick={() => handlers.toggle()}
            style={{
              zIndex: 2,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              borderRadius: '1rem',
              width: '3rem',
              height: '3rem',
              color: mapobj.color,
            }}
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
