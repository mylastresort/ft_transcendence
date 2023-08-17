import { motion } from 'framer-motion';
import { MantineProvider, Text, useMantineTheme } from '@mantine/core';
import { UserContext } from '@/context/user';
import React, { useContext, useEffect, useState } from 'react';
import styles from './Game.module.css';
import { PlayerContext } from '../../context/game';
import request from 'superagent';
import { GameContext } from '@/context/game';
import { io } from 'socket.io-client';

function GameWrapper(Component) {
  return () => {
    const game = useContext(GameContext);
    const [connected, setConnected] = useState(game.socket?.connected);
    const [player, setPlayer] = useState(null);

    useEffect(() => {
      if (!game.socket)
        game.socket = io('localhost:4400/game', {
          autoConnect: false,
          forceNew: true,
          auth: { token: localStorage.getItem('jwtToken') },
        });
      request
        .get('http://localhost:4400/api/v1/game/player/me')
        .set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`)
        .then((res) => {
          if (res.status === 200) setPlayer(res.body);
          game.socket
            ?.on('connect', () => setConnected(true))
            .on('disconnect', () => setConnected(false))
            .connect();
        })
        .catch(() => {});
      return () => {
        game.socket?.off();
      };
    }, []);

    const user = useContext(UserContext);
    const theme = useMantineTheme();

    if (!connected)
      return <Text className={styles.game} ta="center" fw="500"></Text>;

    return !player ? (
      <Text className={styles.game} ta="center" fw="500"></Text>
    ) : (
      <PlayerContext.Provider value={player}>
        <UserContext.Provider value={user}>
          <MantineProvider theme={{ ...theme, primaryColor: 'cyan' }}>
            <motion.div
              className={styles.game}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Component />
            </motion.div>
          </MantineProvider>
        </UserContext.Provider>
      </PlayerContext.Provider>
    );
  };
}

export default GameWrapper;
