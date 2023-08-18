import { Box, Flex, Text } from '@mantine/core';
import React, { use, useEffect } from 'react';
import styles from '../Lobby/Lobby.module.css';
import { BsCircleFill } from 'react-icons/bs';

export default function Profile({ player, status, ready }) {
  return (
    <Flex
      className={styles.profile}
      align="center"
      justify="space-between"
      direction="column"
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          className={styles.img_profile}
          bg={`url(${player.userImgProfile || 'https://picsum.photos/300'})`}
          sx={{ position: 'relative' }}
        />
        <BsCircleFill
          fill={
            status === 'online'
              ? 'green'
              : status === ' offline'
              ? 'red'
              : 'gray'
          }
          size="1.3rem"
          style={{
            position: 'absolute',
            bottom: '11%',
            right: '-4%',
            borderRadius: '50%',
            border: '2px solid var(--sidebar-color)',
          }}
        />
      </Box>
      <Text className={styles.text_profile}>{player.username || 'N/A'}</Text>
      <Text color="whitesmoke" ff="" size="1rem" fw="lighter">
        Level:
        <Text pl=".4em" display="inline" color="white" size="1.2rem">
          {player.userLevel ?? 'N/A'}
        </Text>
      </Text>
      <Text fw="lighter" opacity={ready ? '1' : '0.7'}>
        {ready ? 'ready' : 'waiting to accept...'}
      </Text>
    </Flex>
  );
}
