import { init, reducer } from './game.reducer';
import { Socket, io } from 'socket.io-client';
import { motion } from 'framer-motion';
import { Center, MantineProvider, Text, useMantineTheme } from '@mantine/core';
import { UserContext } from '@/context/user';
import Canvas from './Canvas/Canvas';
import Customizer from './Customizer/Customizer';
import Home from './Home/Home';
import Lobby from './Lobby/Lobby';
import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import styles from './Game.module.css';
import withAuth from '@/pages/lib/withAuth';
import {
  DispatchContext,
  MapsContext,
  SocketContext,
  PlayerContext,
} from './context';
import request from 'superagent';

export function Game() {
  const maps = useContext(MapsContext);
  const [{ page, gameId, opponent, ready, role, config, conf }, dispatch] =
    useReducer(reducer, { map: Math.floor(maps.length / 2) }, init);
  const socket = useContext(SocketContext) as Socket;
  const user = useContext(UserContext);

  useEffect(() => {
    socket
      .on('joined', (gameId, member, conf) =>
        dispatch({ type: 'MATCH', value: [gameId, member, conf] })
      )
      .on('started', (value) => dispatch({ type: 'STARTED', value }));
    return () => {
      socket.off('joined').off('started');
    };
  }, [socket]);

  const theme = useMantineTheme();

  return (
    <UserContext.Provider value={user}>
      <DispatchContext.Provider value={dispatch}>
        <MantineProvider theme={{ ...theme, primaryColor: 'cyan' }}>
          <motion.div
            className={styles.game}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {page === 'home' && <Home />}
            {page === 'custom' && <Customizer map={conf.map} />}
            {page === 'lobby' &&
              (opponent ? (
                <Lobby
                  gameId={gameId}
                  ready={ready}
                  user={user.data}
                  opponent={{ ...opponent, ...opponent.user }}
                />
              ) : (
                <Center display="flex">Waiting for players to join...</Center>
              ))}
            {page === 'game' && config && (
              <Canvas
                name={conf.name}
                speed={conf.speed}
                height={config.limit[1] * 2}
                map={conf.map}
                paddle={config.paddle}
                radius={config.radius}
                role={role}
                width={config.limit[0] * 2}
                games={conf.games}
              />
            )}
          </motion.div>
        </MantineProvider>
      </DispatchContext.Provider>
    </UserContext.Provider>
  );
}

function GameWrapper() {
  const socket = useMemo(
    () =>
      io(`localhost:4400/game`, {
        autoConnect: false,
        extraHeaders: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        withCredentials: true,
      }),
    []
  );
  const [connected, setConnected] = useState(socket.connected);

  const [player, setPlayer] = useState(null);

  useEffect(() => {
    socket
      .on('connect', () => setConnected(true))
      .on('disconnect', () => setConnected(false))
      .on('exception', (err: Error) => {
        throw Error(err.message);
      })
      .connect();
    request
      .get('http://localhost:4400/api/v1/game/me')
      .set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`)
      .then((res) => res.status === 200 && setPlayer(res.body))
      .catch(console.error);
    return () => {
      socket.off().disconnect();
    };
  }, [socket]);

  if (!connected)
    return (
      <Text className={styles.game} ta="center" fw="500">
        Connecting to server...
      </Text>
    );

  return !player ? (
    <Text className={styles.game} ta="center" fw="500">
      Loading...
    </Text>
  ) : (
    <SocketContext.Provider value={socket}>
      <PlayerContext.Provider value={player}>
        <Game />
      </PlayerContext.Provider>
    </SocketContext.Provider>
  );
}

export default withAuth(GameWrapper);
