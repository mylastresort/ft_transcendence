import { Stack, Flex, Text, ThemeIcon } from '@mantine/core';
import { BiBlock } from 'react-icons/bi';
import { Spacer } from '@nextui-org/react';
import { HiEmojiSad } from 'react-icons/hi';

export function BlockedPanel({ isBlocked, isBlockedBy }: any) {
  return (
    <Flex
      mih="55em"
      direction="column"
      align="center"
      justify="center"
      bg="rgba(0, 0, 0, .3)"
      style={{
        display: isBlocked ? '' : 'none',
      }}
    >
      <Stack justify="center" align="center">
        <ThemeIcon color="red" variant="light" size="6rem" radius="md">
          <BiBlock size="4rem" />
        </ThemeIcon>
        <Spacer y={0.5} />
        {isBlockedBy ? (
          <Text size="1.8rem" weight={500}>
            You have been blocked by this user
          </Text>
        ) : (
          <Text size="1.8rem" weight={500}>
            You have blocked this user
          </Text>
        )}
      </Stack>
    </Flex>
  );
}

export function ProfileNotFound({ isNotFound }: any) {
  return (
    <Flex
      mih="55em"
      direction="column"
      align="center"
      justify="center"
      bg="rgba(0, 0, 0, .3)"
      style={{
        display: isNotFound ? '' : 'none',
      }}
    >
      <Stack justify="center" align="center">
        <ThemeIcon color="red" variant="light" size="6rem" radius="md">
          <HiEmojiSad size="4rem" />
        </ThemeIcon>
        <Spacer y={0.5} />
        <Text size="1.8rem" weight={500}>
          Profile not found
        </Text>
      </Stack>
    </Flex>
  );
}
