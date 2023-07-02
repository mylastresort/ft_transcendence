import React, { useState, useEffect, useContext } from 'react';

import {
  Container,
  Stack,
  Button,
  Flex,
  Grid,
  Image,
  Group,
  Text,
  Indicator,
  ThemeIcon,
  Center,
  ActionIcon,
  Menu,
  Avatar,
  Tabs,
  UnstyledButton,
  Anchor,
  Divider,
} from '@mantine/core';
import { Spacer } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { PostUserProfile } from '@/pages/api/user';
import Styles from './profile.module.css';
import { FaGamepad, FaSmileWink } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { BiBlock, BiUserX } from 'react-icons/bi';
import { HiEmojiSad } from 'react-icons/hi';
import { StyledTabs } from '@/components/Mantine/StayledTabs';
import { Last_Matches } from '@/components/Pageutils/Last_Matches';
import { AiFillProfile, AiOutlineMessage } from 'react-icons/ai';
import { GetMe } from '@/pages/api/auth/auth';
import {
  Get_Not_Friends,
  PostSendFriendRequest,
  PostCancelFriendRequest,
  PostRemoveFriendFromList,
  GetFriendsList,
  PostUnfriend,
} from '@/pages/api/friends/friends';
import { WsContext } from '@/context/WsContext';

function Pofile() {
  const [user, setUser] = useState<any>(null);
  const [userMe, setUserMe] = useState<any>(null);
  const [friends, setFriends] = useState<any>(null);
  const [socketEvent, setSocketEvent] = useState(false);

  const [isMe, setIsMe] = useState<boolean>(false);
  const [SelectedUser, setSelectedUser] = useState<any>(null);

  const UserSocket = useContext(WsContext);

  const router = useRouter();
  const { username } = router.query;

  useEffect(() => {
    UserSocket.on('RerenderFriends', (data) => {
      setSocketEvent(!socketEvent);
    });

    setIsMe(false);
    console.log(username);
    const payload = {
      username: username,
    };

    GetMe()
      .then((res) => {
        setUserMe(res.body);
        if (res.body.username === username) {
          setIsMe(true);
        }

        PostUserProfile(payload)
          .then((res) => {
            setUser(res.body);
            const payload = {
              ofuser: res.body.id,
            };
            GetFriendsList(payload)
              .then((res) => {
                console.log('My Friends:', res.body);
                setFriends(res.body);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    Get_Not_Friends()
      .then((res) => {
        console.log(res);
        setSelectedUser(
          res.body.filter((item) => item.username === username)[0]
        );
        console.log(
          'Selected User:',
          res.body.filter((item) => item.username === username)
        );
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      UserSocket.off('RerenderFriends');
    };
  }, [username, socketEvent]);

  const HandleUnfriend = (data) => () => {
    const payload = {
      id: data.id,
    };

    PostUnfriend(payload)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const HandleAddFriend = (data) => () => {
    const payload = {
      receiverId: data.id,
    };
    PostSendFriendRequest(payload)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const HandleCancelRequest = (data) => () => {
    console.log(data);
    const payload = {
      receiverId: data.id,
      senderId: data.receivedRequests[0].senderId,
    };
    console.log(payload);
    PostCancelFriendRequest(payload)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          // setReFetch(!ReFetch);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="dash_container">
      <Container size="xl">
        <Stack>
          <Flex
            mih={240}
            bg="var(--sidebar-color)"
            gap="lg"
            justify="space-around"
            align="center"
            direction="row"
            wrap="wrap"
            style={{ borderRadius: '5px' }}
          >
            <Group align="start" spacing="30px">
              <Indicator
                inline
                size={20}
                offset={3}
                position="bottom-end"
                color={
                  user?.status === 'online'
                    ? 'green'
                    : user?.status === 'offline'
                    ? 'red'
                    : 'yellow'
                }
                withBorder
              >
                <Image
                  width={180}
                  height={180}
                  src={user?.imgProfile}
                  alt="profile picture"
                  withPlaceholder
                  radius="xs"
                  fit="contain"
                />
              </Indicator>
              <Flex direction="column">
                <Text className={Styles.font_1}>{user?.username}</Text>
                <Text className={Styles.font_2}>
                  {user?.firstName} {user?.lastName}
                </Text>
                <Spacer y={1.3} />
                <Text w={320}>{user?.sammary}.</Text>
              </Flex>
            </Group>
            <Flex w={300} justify="center" align="center" wrap="wrap" gap="md">
              <Group spacing="xs">
                <ThemeIcon color="cyan" variant="light" size="xl">
                  <FaGamepad size="1.5rem" />
                </ThemeIcon>
                <Text>134 Games</Text>
              </Group>
              <Group spacing="xs">
                <ThemeIcon color="green" variant="light" size="xl">
                  <FaSmileWink size="1.5rem" />
                </ThemeIcon>
                <Text>85 Wins</Text>
              </Group>
              <Group spacing="xs">
                <ThemeIcon color="red" variant="light" size="xl">
                  <HiEmojiSad size="1.5rem" />
                </ThemeIcon>
                <Text>21 Lost</Text>
              </Group>
            </Flex>
            <Flex
              gap="md"
              justify="flex-start"
              align="start"
              direction="column"
              wrap="wrap"
            >
              <Group spacing="10px">
                <Text size={25}>Level</Text>
                <Avatar color="cyan" radius="xl">
                  7
                </Avatar>
              </Group>
              <Group spacing="10px">
                {isMe ? (
                  <Button
                    variant="light"
                    radius="xs"
                    color="cyan"
                    onClick={() => router.push('/edit/info')}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Group spacing="10px">
                    {friends?.find(
                      (friend) => friend.username === userMe.username
                    ) ? (
                      <Button
                        variant="light"
                        radius="xs"
                        color="cyan"
                        //   onClick={HandleAddFriend(data)}
                      >
                        Message
                      </Button>
                    ) : SelectedUser?.receivedRequests?.length > 0 ? (
                      <Button
                        variant="light"
                        radius="xs"
                        color="red"
                        onClick={HandleCancelRequest(SelectedUser)}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button
                        variant="light"
                        radius="xs"
                        color="cyan"
                        onClick={HandleAddFriend(user)}
                      >
                        Add Friend
                      </Button>
                    )}

                    <Menu shadow="md" width={200} position="bottom-end">
                      <Menu.Target>
                        <ActionIcon size="lg" variant="filled" radius="xs">
                          <BsThreeDots size="1.2rem" />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        {friends?.find(
                          (friend) => friend.username === userMe.username
                        ) && (
                          <Menu.Item
                            icon={<BiUserX size={14} color="#f57e07" />}
                            onClick={HandleUnfriend(user)}
                          >
                            Unfriend
                          </Menu.Item>
                        )}
                        <Menu.Item
                          icon={
                            <BiBlock size={14} color="var(--secondary-color)" />
                          }
                          // onClick={HandleBlockFriend(data)}
                        >
                          Block
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                )}
              </Group>
            </Flex>
          </Flex>
          <Spacer y={0.5} />
          <Flex
            justify="space-between"
            align="start"
            direction="row"
            wrap="wrap"
            mih="65em"
          >
            <Flex
              mih="65em"
              bg="rgba(0, 0, 0, .3)"
              gap="md"
              justify="space-around"
              align="top"
              direction="row"
              wrap="wrap"
              style={{ borderRadius: '5px', width: '74%' }}
            >
              <StyledTabs
                defaultValue="overview"
                style={{
                  position: 'relative',
                  top: '-20px',
                  width: '100%',
                }}
              >
                <Tabs.List style={{ justifyContent: 'center' }} pb="lg">
                  <Tabs.Tab
                    value="overview"
                    icon={<AiFillProfile size="1rem" />}
                  >
                    overview
                  </Tabs.Tab>
                  <Tabs.Tab value="messages" icon={<HiEmojiSad size="1rem" />}>
                    Messages
                  </Tabs.Tab>
                  <Tabs.Tab value="gallery" icon={<HiEmojiSad size="1rem" />}>
                    Gallery
                  </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="overview">
                  <Flex
                    justify="left"
                    align="left"
                    direction="column"
                    wrap="wrap"
                    style={{ borderRadius: '5px', padding: '20px 15px' }}
                  >
                    <Stack>
                      <Flex
                        mih="10vh"
                        bg="var(--sidebar-color)"
                        gap="md"
                        justify="space-around"
                        align="center"
                        direction="row"
                        wrap="wrap"
                        style={{ borderRadius: '5px' }}
                      >
                        <UnstyledButton>
                          <Group>
                            <ThemeIcon color="green" variant="light" size="xl">
                              <FaSmileWink size="1.5rem" />
                            </ThemeIcon>
                            <Text size="1.2rem" weight={600}>
                              85 Wins
                            </Text>
                          </Group>
                        </UnstyledButton>
                        {/* <Divider orientation="vertical" /> */}
                        <UnstyledButton>
                          <Group>
                            <ThemeIcon color="red" variant="light" size="xl">
                              <HiEmojiSad size="1.5rem" />
                            </ThemeIcon>
                            <Text size="1.2rem" weight={600}>
                              21 Lost
                            </Text>
                          </Group>
                        </UnstyledButton>
                        <Group spacing={10}>
                          {[1, 2, 3, 4, 5].map((item, index) => (
                            <Avatar radius="md" size={45} color="cyan">
                              BH
                            </Avatar>
                          ))}
                        </Group>
                      </Flex>
                      <Spacer y={0.5} />
                      <div>
                        <Text size="1.2rem" weight={500}>
                          Completed Games
                        </Text>
                        <Spacer y={1} />
                        <Last_Matches />
                      </div>
                    </Stack>
                  </Flex>
                </Tabs.Panel>
                {/* <Tabs.Panel value="second">Second panel</Tabs.Panel> */}
              </StyledTabs>
            </Flex>
            <Flex
              mih="49em"
              bg="rgba(0, 0, 0, .3)"
              direction="column"
              style={{
                borderRadius: '5px',
                width: '25%',
                padding: '20px 15px',
              }}
            >
              {user?.status === 'online' ? (
                <Text size="1.3rem" weight={300} color="green">
                  Currently Online
                </Text>
              ) : (
                <Text size="1.3rem" weight={300}>
                  Currently Offline
                </Text>
              )}
              <Spacer y={2} />
              <Stack>
                <Anchor
                  size="1.1rem"
                  weight={300}
                  href="https://mantine.dev/"
                  target="_blank"
                >
                  Achievements (6)
                </Anchor>
                <Group spacing="xs">
                  {[1, 2, 3, 4].map((item) => (
                    <UnstyledButton>
                      <Avatar size={60} color="cyan" variant="light">
                        BH
                      </Avatar>
                    </UnstyledButton>
                  ))}
                </Group>
              </Stack>
              <Spacer y={2} />
              <Stack>
                <Anchor
                  size="1.1rem"
                  weight={300}
                  href={`/id/${user?.username}/friends`}
                >
                  Friends ({friends?.length})
                </Anchor>
                {friends?.slice(0, 5).map((item, index) => (
                  <UnstyledButton
                    className={Styles.UnstyledButton}
                    onClick={() => {
                      router.push(`/profile/${item?.username}`);
                    }}
                  >
                    <Group>
                      <Avatar src={item?.imgProfile} />

                      <div style={{ flex: 1 }}>
                        <Text size="md" weight={500}>
                          {item?.username}
                        </Text>
                        <Text size="xs" weight={500}>
                          {item.status}
                        </Text>
                      </div>

                      <Avatar color="cyan" radius="xl" size={30}>
                        12
                      </Avatar>
                    </Group>
                  </UnstyledButton>
                ))}
              </Stack>
            </Flex>
          </Flex>
        </Stack>
        <Spacer y={4} />
      </Container>
    </div>
  );
}

export default Pofile;
