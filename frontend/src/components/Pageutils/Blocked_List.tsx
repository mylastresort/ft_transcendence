import React, { use, useEffect, useState } from 'react';
import {
  UnstyledButton,
  UnstyledButtonProps,
  Group,
  Avatar,
  Text,
  createStyles,
  ActionIcon,
  Menu,
} from '@mantine/core';
import { Grid, Spacer, Image, Table } from '@nextui-org/react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { BiBlock } from 'react-icons/bi';
import { AiOutlineMessage } from 'react-icons/ai';

const dummyData = [
  {
    image: '/images/LOGO.png',
    Username: '9awzo9za7',
    Level: 'lvl 2',
  },
];

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '31%',
    padding: theme.spacing.md,
    backgroundColor: '#fff',
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
}));

interface UserButtonProps extends UnstyledButtonProps {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

export function Blocked_List({ UserData }) {
  const { classes } = useStyles();

  return (
    <Group position="left" spacing="lg">
      {dummyData.map((data) => (
        <UnstyledButton className={classes.user}>
          <Group>
            <Avatar src={data.image} radius="xl" />

            <div style={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                {data.Username}
              </Text>

              <Text color="dimmed" size="xs">
                {data.Level}
              </Text>
            </div>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon color="blue" size="md" variant="light">
                  <HiOutlineDotsVertical size="1.2rem" />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item icon={<BiBlock size={14} color="#F31260" />}>
                  Unblock
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </UnstyledButton>
      ))}
    </Group>
  );
}
