import React, { use, useEffect, useState, useContext } from 'react';
import {
  UnstyledButton,
  UnstyledButtonProps,
  Group,
  Avatar,
  Text,
  createStyles,
  ActionIcon,
  Menu,
  Tabs,
  Badge,
  Button,
  Center,
} from '@mantine/core';
import { Grid, Spacer, Image, Table } from '@nextui-org/react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { BiBlock } from 'react-icons/bi';
import { AiOutlineMessage } from 'react-icons/ai';
import { BiUserX } from 'react-icons/bi';
import {
  GetFriendRequests,
  PostAcceptFriendRequest,
  GetFriendsList,
  PostUnfriend,
  PostBlockFriend,
} from '@/pages/api/friends/friends';
import { ImNotification } from 'react-icons/im';
import { WsContext } from '@/context/WsContext';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '18em',
    padding: theme.spacing.md,
    backgroundColor: 'var(--button-color)',
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor: 'var(--button-hover-color)',
    },
  },
}));

export function Friends_List() {
  const { classes } = useStyles();
  const [ReceivedReq, setReceivedReq] = useState<any>(null);
  const [Friends, setFriends] = useState<any>(null);
  const [Refetch, setRefetch] = useState<boolean>(false);

  const UserSocket = useContext(WsContext);

  useEffect(() => {
    UserSocket.on('RerenderFriends', (data) => {
      GetFriendRequests()
        .then((res) => {
          setReceivedReq(res.body);
        })
        .catch((err) => {
          console.log(err);
        });

      GetFriendsList()
        .then((res) => {
          setFriends(res.body);
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
    GetFriendRequests()
      .then((res) => {
        setReceivedReq(res.body);
      })
      .catch((err) => {
        console.log(err);
      });

    GetFriendsList()
      .then((res) => {
        setFriends(res.body);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [Refetch]);

  const HandleAcceptRequest = (data) => () => {
    const payload = {
      id: data.sender.id,
    };

    PostAcceptFriendRequest(payload)
      .then((res) => {
        setRefetch(!Refetch);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const HandleUnfriend = (data) => () => {
    const payload = {
      id: data.id,
    };

    PostUnfriend(payload)
      .then((res) => {
        setRefetch(!Refetch);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const HandleBlockFriend = (data) => () => {
    const payload = {
      id: data.id,
    };

    PostBlockFriend(payload)
      .then((res) => {
        setRefetch(!Refetch);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '20em' }}>
      <Tabs
        defaultValue="2"
        orientation="vertical"
        variant="outline"
        radius="md"
        style={{ width: '100%' }}
      >
        <Tabs.List>
          <Tabs.Tab
            value="1"
            rightSection={
              ReceivedReq?.length > 0 ? (
                <Badge
                  w={16}
                  h={16}
                  sx={{ pointerEvents: 'none' }}
                  variant="filled"
                  size="xs"
                  p={0}
                >
                  {ReceivedReq?.length}
                </Badge>
              ) : (
                ''
              )
            }
          >
            Friend Requests
          </Tabs.Tab>
          <Tabs.Tab value="2">Friends</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="1" pl="xl">
          {ReceivedReq?.length > 0 ? (
            <Group position="left" spacing="lg">
              {ReceivedReq?.map((data) => (
                <UnstyledButton className={classes.user}>
                  <Group>
                    <Avatar src={data.sender.imgProfile} radius="xl" />

                    <div style={{ flex: 1 }}>
                      <Text size="sm" weight={500}>
                        {data.sender.username}
                      </Text>

                      <Text color="dimmed" size="xs">
                        Level 12
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
                          icon={<AiOutlineMessage size={14} color="#228BE6" />}
                          onClick={HandleAcceptRequest(data)}
                        >
                          Accept
                        </Menu.Item>
                        <Menu.Item icon={<BiUserX size={14} color="#f57e07" />}>
                          Cancel
                        </Menu.Item>
                        <Menu.Item
                          icon={
                            <BiBlock size={14} color="var(--secondary-color)" />
                          }
                        >
                          Block
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </UnstyledButton>
              ))}
            </Group>
          ) : (
            <Center
              style={{
                display: 'flex',
                width: '100%',
                height: '100%',
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
                No Request Found
              </Text>
            </Center>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="2" pl="xl">
          {Friends?.length > 0 ? (
            <Group position="left" spacing="lg">
              {Friends?.map((data) => (
                <UnstyledButton className={classes.user}>
                  <Group>
                    <Avatar src={data.imgProfile} radius="xl" />

                    <div style={{ flex: 1 }}>
                      <Text size="sm" weight={500}>
                        {data.username}
                      </Text>

                      <Text color="dimmed" size="xs">
                        <Badge
                          size="xs"
                          radius="md"
                          color={data.status === 'online' ? 'green' : 'red'}
                        >
                          {data.status}
                        </Badge>
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
                          icon={<AiOutlineMessage size={14} color="#228BE6" />}
                        >
                          Messages
                        </Menu.Item>
                        <Menu.Item
                          icon={<BiUserX size={14} color="#f57e07" />}
                          onClick={HandleUnfriend(data)}
                        >
                          Unfriend
                        </Menu.Item>
                        <Menu.Item
                          icon={
                            <BiBlock size={14} color="var(--secondary-color)" />
                          }
                          onClick={HandleBlockFriend(data)}
                        >
                          Block
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </UnstyledButton>
              ))}
            </Group>
          ) : (
            <Center
              style={{
                display: 'flex',
                width: '100%',
                height: '100%',
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
                No Friend Found
              </Text>
            </Center>
          )}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
