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
      <Text className={styles.text_profile}>
        level {(player.userLevel as number)?.toFixed(2) ?? 'N/A'}
      </Text>
      <Text className={styles.text_profile}>
        {player.userWins ?? 'N/A'} <BiMedal /> wins
      </Text>
      <Text className={styles.text_profile}>
        {player.userCurrentStreak ?? 'N/A'}
        <GoFlame size="1.2rem" style={{ marginInline: '3px' }} />
        current streak
      </Text>
      <Text className={styles.text_profile}>
        {player.userLongestStreak ?? 'N/A'}
        <GoFlame size="1.2rem" style={{ marginInline: '3px' }} />
        longest streak
      </Text>
    </Flex>
  );
}
