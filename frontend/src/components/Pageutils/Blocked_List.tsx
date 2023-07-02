import React, { useEffect, useState, useContext } from 'react';
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
import { Center } from '@mantine/core';
import { GetBLockedFriends, PostUnblock } from '@/pages/api/friends/friends';
import { WsContext } from '@/context/WsContext';
import { ImNotification } from 'react-icons/im';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '31%',
    padding: theme.spacing.md,
    backgroundColor: 'var(--button-color)',
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor: 'var(--button-hover-color)',
    },
  },
}));

export function Blocked_List() {
  const { classes } = useStyles();
  const [BlockedUsers, setBlockedUsers] = useState([]);
  const [Refresh, setRefresh] = useState(false);

  const UserSocket = useContext(WsContext);

  useEffect(() => {
    UserSocket.on('RerenderFriends', (data) => {
      GetBLockedFriends()
        .then((res) => {
          setBlockedUsers(res.body);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    return () => {
      UserSocket.off('RerenderFriends');
    };
  }, []);

  useEffect(() => {
    GetBLockedFriends()
      .then((res) => {
        setBlockedUsers(res.body);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [Refresh]);

  const HandleUnblockFriend = (data) => () => {
    const payload = {
      id: data.id,
    };
    PostUnblock(payload)
      .then((res) => {
        setRefresh(!Refresh);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Group position="left" spacing="lg">
      {BlockedUsers.length > 0 ? (
        BlockedUsers?.map((data) => (
          <UnstyledButton className={classes.user}>
            <Group>
              <Avatar src={data.imgProfile} radius="xl" />

              <div style={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  {data.username}
                </Text>

                <Text color="dimmed" size="xs">
                  {/* {data.Level} */}
                  Lvl 2.3
                </Text>
              </div>

              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon size="md">
                    <HiOutlineDotsVertical size="1.2rem" />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    icon={<BiBlock size={14} color="var(--secondary-color)" />}
                    onClick={HandleUnblockFriend(data)}
                  >
                    Unblock
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </UnstyledButton>
        ))
      ) : (
        <Center
          style={{
            display: 'flex',
            width: '100%',
            height: '20em',
            backgroundColor: 'var(--button-hover-color)',
            borderRadius: '5px',
            flexDirection: 'column',
          }}
        >
          <ImNotification size={60} color="#9DA4AE" />
          <Spacer y={1} />
          <Text
            className="Text_W500"
            style={{ fontSize: '1.2rem', color: '#9DA4AE' }}
          >
            No Blocked Users
          </Text>
        </Center>
      )}
    </Group>
  );
}
