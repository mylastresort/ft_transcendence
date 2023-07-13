import { init, reducer } from './game.reducer';
import { Socket, io } from 'socket.io-client';
import { motion } from 'framer-motion';
import {
  Button,
  Flex,
  MantineProvider,
  Text,
  useMantineTheme,
} from '@mantine/core';
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
  const [state, dispatch] = useReducer(
    reducer,
    { map: Math.floor(maps.length / 2) },
    init
  );
  const socket = useContext(SocketContext) as Socket;
  const user = useContext(UserContext);

  useEffect(() => {
    socket
      .on('joined', (gameId, member, conf) =>
        dispatch({ type: 'MATCH', value: [gameId, member, conf] })
      )
      .on('started', (value) => dispatch({ type: 'STARTED', value }))
      .on('left', () => dispatch({ type: 'LEAVE' }));
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
            {state.page === 'home' && <Home />}
            {state.page === 'custom' && <Customizer map={state.conf.map} />}
            {state.page === 'lobby' &&
              (state.opponent ? (
                <Lobby
                  gameId={state.gameId}
                  ready={state.ready}
                  user={user.data}
                  opponent={{ ...state.opponent, ...state.opponent.user }}
                />
              ) : (
                <Flex justify="space-around" align="center" h="100%">
                  <Text>Waiting for players to join...</Text>
                  <Button
                    variant="outline"
                    onClick={() =>
                      socket.emit('leave', () => dispatch({ type: 'LEAVE' }))
                    }
                  >
                    Cancel
                  </Button>
                </Flex>
              ))}
            {state.page === 'game' && state.config && (
              <Canvas
                name={state.conf.name}
                speed={state.conf.speed}
                height={state.config.limit[1] * 2}
                map={state.conf.map}
                paddle={state.config.paddle}
                radius={state.config.radius}
                role={state.role}
                width={state.config.limit[0] * 2}
                games={state.conf.games}
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
        auth: {
          token: localStorage.getItem('jwtToken'),
        },
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
        throw new Error(err.message);
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
