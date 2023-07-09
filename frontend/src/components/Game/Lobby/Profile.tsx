import { Box, Flex, Text } from '@mantine/core';
import styles from './Lobby.module.css';

export default function Profile({ user }) {
  return (
    <Flex
      className={styles.profile}
      align="center"
      justify="space-between"
      direction="column"
    >
      <Box
        className={styles.img_profile}
        bg={`url(${user.imgProfile || 'https://picsum.photos/300'})`}
      />
      <Text className={styles.text_profile}>{user.username || 'N/A'}</Text>
      <Text className={styles.text_profile}>{user.level ?? 'N/A'}</Text>
      <Text className={styles.text_profile}>{user.wins ?? 'N/A'} wins</Text>
      <Text className={styles.text_profile}>
        {user.currentStreak ?? 'N/A'} streak
      </Text>
      <Text className={styles.text_profile}>
        {user.longestStreak ?? 'N/A'} longest streak
      </Text>
    </Flex>
  );
}
