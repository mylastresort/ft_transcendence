import { Box, Flex, Text } from '@mantine/core';
import React from 'react';
import styles from '../Lobby/Lobby.module.css';
import { Player } from '@/context/game';
import { BsCircleFill } from 'react-icons/bs';

export default function Profile({
  player,
  status,
}: {
  player: Player;
  status: string;
}) {
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
          fill={status}
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
    </Flex>
  );
}
