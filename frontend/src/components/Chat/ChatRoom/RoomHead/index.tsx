import { ChatContext } from '@/context/chat';
import { ActionIcon, Box, Button, Flex, Group, Text, useMantineTheme } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { GrContactInfo } from 'react-icons/gr';

export function RoomHead({ children }) {
    const theme = useMantineTheme();
  const chatContext = useContext(ChatContext);
  useEffect(() => setOpen(false), [chatContext.data]);
  const [open, setOpen] = useState(false);
  return (
    <Flex bg={theme.colors.dark[8]} w={'100%'} h={70}>
      <Group
        pl={30}
        p={2}
        w={'100%'}
      >
        <img
          src={chatContext.data.img}
          style={{
            width: '50px',
            borderRadius: 50,
          }}
          alt=""
        />

        <Text size={20}>{chatContext.data.name}</Text>
      </Group>
      <Box
        display={open ? 'block' : 'none'}
        pos={'absolute'}
        maw={'calc(100vw - 143px)'}
        h={'calc(100vh - 78px)'}
        style={{
          zIndex: 1,
        }}
      >
        {children}
      </Box>
      <ActionIcon
        size={'lg'}
        style={{
          zIndex: 1,
          background: 'grey',
          opacity: '.6',
          right: '30px',
          top: '18px',
          position: 'absolute',
        }}
        onClick={() => setOpen(!open)}
      >
        <GrContactInfo />
      </ActionIcon>
    </Flex>
  );
}
