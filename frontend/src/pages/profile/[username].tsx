import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Stack,
  Button,
  Flex,
  Image,
  Group,
  Text,
  Indicator,
  ThemeIcon,
  ActionIcon,
  Menu,
  Avatar,
  Tabs,
  UnstyledButton,
  Anchor,
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
import { AiFillProfile } from 'react-icons/ai';
import { GetMe } from '@/pages/api/auth/auth';
import {
  Get_Not_Friends,
  PostSendFriendRequest,
  PostCancelFriendRequest,
  GetFriendsList,
  PostUnfriend,
  PostBlockFriend,
  PostAcceptFriendRequest,
  GetBLockedFriends,
  PostUnblock,
} from '@/pages/api/friends/friends';
import { UserSocket } from '@/context/WsContext';
import { BlockedPanel, ProfileNotFound } from '@/components/Pageutils/NotFound';

function Pofile() {
  const [userProfile, setUserProfile] = useState<[]>([]);
  const [userMe, setUserMe] = useState<[]>([]);
  const [friends, setFriends] = useState<[]>([]);
  const [PendingFriend, setPendingFriend] = useState<[]>([]);
  const [username, setUsername] = useState<string>('');

  const [isMe, setIsMe] = useState<boolean>(false);
  const [socketEvent, setSocketEvent] = useState(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [isBlockedBy, setIsBlockedBy] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  // const UserSocket = useContext(WsContext);

  const router = useRouter();
  // const { username } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        UserSocket.on('RerenderFriends', (data) => {
          setSocketEvent((prevSocketEvent) => !prevSocketEvent);
        });

        const Username = window.location.pathname.split('/')[2];
        setUsername(Username);
        setIsMe(false);
        // setIsLoaded(true);
        setIsBlocked(false);
        setIsNotFound(false);
        setIsBlockedBy(false);
        setUsername;
        const payload = {
          username: Username,
        };

        const meResponse = await GetMe();
        const me = meResponse.body;
        setUserMe(me);
        if (me.username === Username) {
          setIsMe(true);
        }
        const userProfileResponse = await PostUserProfile(payload);
        const UserProfile = userProfileResponse.body;
        if (!UserProfile) {
          setIsNotFound(true);
          return () => {
            UserSocket.off('RerenderFriends');
            router.events.off('routeChangeComplete', fetchData);
          };
        }
        setUserProfile(UserProfile);

        const blockedFriendsResponse = await GetBLockedFriends();
        const blockedFriends = blockedFriendsResponse.body;
        const BlockedUsers = blockedFriends.find(
          (item: any) => item.username === Username
        );
        if (BlockedUsers) {
          setIsBlocked(true);
        }
        if (BlockedUsers?.blockedBy.length > 0) {
          setIsBlockedBy(true);
          setIsLoaded(false);

          return () => {
            UserSocket.off('RerenderFriends');
            router.events.off('routeChangeComplete', fetchData);
          };
        }

        setIsLoaded(false);

        const friendsPayload = {
          username: UserProfile?.username,
        };
        const friendsListResponse = await GetFriendsList(friendsPayload);
        const friendsList = friendsListResponse.body;
        setFriends(friendsList);

        const notFriendsResponse = await Get_Not_Friends();
        const notFriends = notFriendsResponse.body;
        const PendingFriend = notFriends.find(
          (item: any) => item.username === Username
        );
        setPendingFriend(PendingFriend);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

    router.events.on('routeChangeComplete', fetchData);

    return () => {
      UserSocket.off('RerenderFriends');
      router.events.off('routeChangeComplete', fetchData);
    };
  }, [username, socketEvent]);

  const HandleUnfriend = (data: any) => () => {
    const payload = {
      id: data.id,
    };

    PostUnfriend(payload)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const HandleAddFriend = (data: any) => () => {
    const payload = {
      receiverId: data.id,
    };
    PostSendFriendRequest(payload)
      .then((res) => {
        if (res.status === 200) {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const HandleCancelRequest = (data: any) => () => {
    const payload = {
      receiverId: data.id,
      senderId: data.receivedRequests[0].senderId,
    };
    PostCancelFriendRequest(payload)
      .then((res) => {
        if (res.status === 200) {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const HandleAcceptRequest = (data: any) => () => {
    const payload = {
      id: data.sentRequests[0].senderId,
    };

    PostAcceptFriendRequest(payload)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const HandleBlockFriend = (data: any) => () => {
    const payload = {
      id: data.id,
    };

    PostBlockFriend(payload)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const HandleUnblockFriend = (data: any) => () => {
    const payload = {
      id: data.id,
    };
    PostUnblock(payload)
      .then((res) => {
        // setRefresh(!Refresh);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="dash_container">
      <Container size="xl">
        <ProfileNotFound isNotFound={isNotFound} />
        <Stack style={{ display: isLoaded || isNotFound ? 'none' : '' }}>
          <Flex
            mih={240}
            bg="var(--sidebar-color)"
            gap="lg"
            justify="space-around"
            align="center"
            direction="row"
            wrap="wrap"
            style={{ borderRadius: '5px', display: isBlockedBy ? 'none' : '' }}
          >
            <Group align="start" spacing="30px">
              <Indicator
                inline
                size={20}
                offset={3}
                position="bottom-end"
                color={
                  isBlocked
                    ? 'red'
                    : userProfile?.status === 'online'
                    ? 'green'
                    : userProfile?.status === 'offline'
                    ? 'red'
                    : 'yellow'
                }
                withBorder
              >
                <Image
                  width={180}
                  height={180}
                  src={userProfile?.imgProfile}
                  alt="profile picture"
                  withPlaceholder
                  radius="xs"
                  fit="contain"
                />
              </Indicator>
              <Flex direction="column">
                <Text className={Styles.font_1}>{userProfile?.username}</Text>
                <Text className={Styles.font_2}>
                  {userProfile?.firstName} {userProfile?.lastName}
                </Text>
                <Spacer y={1.3} />
                <Text w={320}>{userProfile?.sammary}.</Text>
              </Flex>
            </Group>
            <Flex
              w={300}
              justify="center"
              align="center"
              wrap="wrap"
              gap="md"
              style={{}}
            >
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
                      (friend: any) => friend.username === userMe?.username
                    ) ? (
                      <Button
                        variant="light"
                        radius="xs"
                        color="cyan"
                        //   onClick={HandleAddFriend(data)}
                      >
                        Message
                      </Button>
                    ) : PendingFriend?.receivedRequests?.length > 0 ? (
                      <Button
                        variant="light"
                        radius="xs"
                        color="red"
                        onClick={HandleCancelRequest(PendingFriend)}
                      >
                        Cancel
                      </Button>
                    ) : PendingFriend?.sentRequests?.length > 0 ? (
                      <Button
                        variant="light"
                        radius="xs"
                        color="cyan"
                        onClick={HandleAcceptRequest(PendingFriend)}
                      >
                        Accept Request
                      </Button>
                    ) : (
                      <Button
                        variant="light"
                        radius="xs"
                        color="cyan"
                        disabled={isBlocked}
                        onClick={HandleAddFriend(userProfile)}
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
                          (friend: any) => friend.username === userMe?.username
                        ) && (
                          <Menu.Item
                            icon={<BiUserX size={14} color="#f57e07" />}
                            onClick={HandleUnfriend(userProfile)}
                          >
                            Unfriend
                          </Menu.Item>
                        )}
                        {isBlocked ? (
                          <Menu.Item
                            icon={
                              <BiBlock
                                size={14}
                                color="var(--secondary-color)"
                              />
                            }
                            onClick={HandleUnblockFriend(userProfile)}
                          >
                            Unblock
                          </Menu.Item>
                        ) : (
                          <Menu.Item
                            icon={
                              <BiBlock
                                size={14}
                                color="var(--secondary-color)"
                              />
                            }
                            onClick={HandleBlockFriend(userProfile)}
                          >
                            Block
                          </Menu.Item>
                        )}
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                )}
              </Group>
            </Flex>
          </Flex>
          <Spacer y={0.5} />
          <BlockedPanel isBlocked={isBlocked} isBlockedBy={isBlockedBy} />
          <Flex
            justify="space-between"
            align="start"
            direction="row"
            wrap="wrap"
            mih="65em"
            style={{
              display: isBlocked || isLoaded ? 'none' : '',
            }}
          >
            <Flex
              mih="65em"
              bg="rgba(0, 0, 0, .3)"
              gap="md"
              justify="space-around"
              align="top"
              direction="row"
              wrap="wrap"
              style={{
                borderRadius: '5px',
                width: '74%',
              }}
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
                            <Avatar
                              radius="md"
                              size={45}
                              color="cyan"
                              key={index}
                            >
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
              {userProfile?.status === 'online' ? (
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
                  {[1, 2, 3, 4].map((item, index) => (
                    <UnstyledButton key={index}>
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
                  onClick={() => {
                    router.push(`/id/${userProfile?.username}/friends`);
                  }}
                >
                  Friends ({friends?.length})
                </Anchor>
                {friends?.slice(0, 5).map((item: any, index: number) => (
                  <UnstyledButton
                    key={index}
                    className={Styles.UnstyledButton}
                    onClick={() => {
                      console.log(`/profile/${item?.username}`);
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
