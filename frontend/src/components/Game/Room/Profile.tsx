import { Box, Flex, Text } from '@mantine/core';
import { BiMedal } from 'react-icons/bi';
import { GoFlame } from 'react-icons/go';
import React from 'react';
import styles from '../Lobby/Lobby.module.css';
import { Player } from '@/context/game';

export default function Profile({ player }: { player: Player }) {
  return (
    <Flex
      className={styles.profile}
      align="center"
      justify="space-between"
      direction="column"
    >
      <Box
        className={styles.img_profile}
        bg={`url(${player.userImgProfile || 'https://picsum.photos/300'})`}
      />
      <Text className={styles.text_profile}>{player.username || 'N/A'}</Text>
    </Flex>
  );
}
