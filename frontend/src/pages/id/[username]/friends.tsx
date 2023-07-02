import React, { useEffect, useState, useContext } from 'react';
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
  NavLink,
  Box,
  Input,
  Checkbox,
  Select,
  Textarea,
  FileButton,
} from '@mantine/core';
import { Spacer } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { GetMe } from '@/pages/api/auth/auth';
import { HiEmojiSad } from 'react-icons/hi';
import { GetUserData, PostUpdateProfile } from '@/pages/api/user';
import { PostUserProfile } from '@/pages/api/user';
import {
  GetFriendRequests,
  PostAcceptFriendRequest,
  GetFriendsList,
  PostUnfriend,
  PostBlockFriend,
  GetBLockedFriends,
  PostUnblock,
  Get_Not_Friends,
} from '@/pages/api/friends/friends';
import Styles from './friends.module.css';
import { AiOutlineUser, AiOutlineUserAdd } from 'react-icons/ai';
import { HiMail } from 'react-icons/hi';
import { BiBlock } from 'react-icons/bi';
import { WsContext } from '@/context/WsContext';

function SideLink({ data, active, setActive }) {
  const items = data.map((item, index) => (
    <NavLink
      style={{ borderRadius: '5px' }}
      color="cyan"
      key={item.label}
      icon={item.icon}
      rightSection={item?.rightSection}
      active={index === active}
      label={item.label}
      onClick={() => setActive(index)}
      p={14}
      key={index}
    />
  ));

  return <div>{items}</div>;
}

function AllFriends({ friends }) {
  const router = useRouter();
  return (
    <Flex direction="column" w="100%">
      <Stack justify="flex-start" spacing="sm" mih="52em">
        <Text size="1.7rem" weight={400}>
          ALL FRIENDS
        </Text>
        <Divider />
        <Spacer y={0.5} />
        <Group position="left">
          {friends?.map((item, index) => (
            <UnstyledButton
              key={index}
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
        </Group>
      </Stack>
    </Flex>
  );
}

function RequestFriends({ friendReq }) {
  console.log(friendReq);
  const router = useRouter();
  return (
    <Flex direction="column" w="100%">
      <Stack justify="flex-start" spacing="sm" mih="52em">
        <Text size="1.7rem" weight={400}>
          PENDING INVITES
        </Text>
        <Divider />
        <Spacer y={0.5} />
        <Group position="left">
          {friendReq?.map((item, index) => (
            <UnstyledButton
              key={index}
              className={Styles.UnstyledButton}
              onClick={() => {
                router.push(`/profile/${item?.sender.username}`);
              }}
            >
              <Group>
                <Avatar src={item?.sender.imgProfile} />

                <div style={{ flex: 1 }}>
                  <Text size="md" weight={500}>
                    {item?.sender.username}
                  </Text>
                  <Text size="xs" weight={500}>
                    {item?.sender.status}
                  </Text>
                </div>

                <Avatar color="cyan" radius="xl" size={30}>
                  12
                </Avatar>
              </Group>
            </UnstyledButton>
          ))}
        </Group>
      </Stack>
    </Flex>
  );
}

function BlockedFriends({ blockedFriends }) {
  const router = useRouter();
  return (
    <Flex direction="column" w="100%">
      <Stack justify="flex-start" spacing="sm" mih="52em">
        <Text size="1.7rem" weight={400}>
          BLOCKED FRIENDS
        </Text>
        <Divider />
        <Spacer y={0.5} />
        <Group position="left">
          {blockedFriends?.map((item, index) => (
            <UnstyledButton
              key={index}
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
        </Group>
      </Stack>
    </Flex>
  );
}

function AddFriends({ Addfriends }) {
  const router = useRouter();
  return (
    <Flex direction="column" w="100%">
      <Stack justify="flex-start" spacing="sm" mih="52em">
        <Text size="1.7rem" weight={400}>
          ADD FRIENDS
        </Text>
        <Divider />
        <Spacer y={0.5} />
        <Group position="left">
          {Addfriends?.map((item, index) => (
            <UnstyledButton
              key={index}
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
        </Group>
      </Stack>
    </Flex>
  );
}

function Friends() {
  const UserSocket = useContext(WsContext);

  const [active, setActive] = useState(0);
  const [isMe, setIsMe] = useState<boolean>(false);
  const [friends, setFriends] = useState<any>(null);
  const [friendReq, setFriendReq] = useState<any>(null);
  const [blockedFriends, setBlockedFriends] = useState<any>(null);
  const [Addfriends, setAddfriends] = useState<any>(null);

  const [socketEvent, setSocketEvent] = useState(false);

  const router = useRouter();
  const { username } = router.query;

  const data = [
    {
      label: 'All Friends',
      icon: <AiOutlineUser size={20} />,
      rightSection: friends?.length,
    },
    {
      label: 'Your Friends',
      icon: <AiOutlineUserAdd size={20} />,
      rightSection: friends?.length,
    },
    {
      label: 'Add a Friend',
      icon: <AiOutlineUser size={20} />,
    },
    {
      label: 'Pending Invites',
      icon: <HiMail size={20} />,
      rightSection: friendReq?.length,
    },
    {
      label: 'Blocked',
      icon: <BiBlock size={20} />,
      rightSection: blockedFriends?.length,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        UserSocket.on('RerenderFriends', (data) => {
          setSocketEvent((prevSocketEvent) => !prevSocketEvent);
        });

        const friendRequests = await GetFriendRequests();
        setFriendReq(friendRequests.body);

        const payload = {
          username: username,
        };

        const me = await GetMe();
        if (me.body.username === username) {
          setIsMe(true);
        }

        const userProfile = await PostUserProfile(payload);
        const friendsList = await GetFriendsList({
          username: userProfile.body.username,
        });
        setFriends(friendsList.body);

        const blockedFriends = await GetBLockedFriends();
        setBlockedFriends(blockedFriends.body);

        const notFriends = await Get_Not_Friends();
        setAddfriends(notFriends.body);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

    return () => {
      UserSocket.off('RerenderFriends');
    };
  }, [username, socketEvent]);

  return (
    <div className="dash_container">
      <Container size="xl">
        <Stack>
          <Flex
            mih={240}
            justify="space-between"
            align="start"
            direction="row"
            wrap="wrap"
          >
            <Flex
              //   mih="10em"
              bg="var(--primary-color)"
              direction="column"
              style={{
                borderRadius: '5px',
                width: '25%',
                padding: '20px 15px',
              }}
            >
              <SideLink
                data={isMe ? data.slice(1) : data.slice(0, 1)}
                active={active}
                setActive={setActive}
              />
            </Flex>
            <Flex
              mih="60em"
              bg="rgba(0, 0, 0, .3)"
              justify="start"
              align="start"
              direction="row"
              wrap="wrap"
              style={{
                borderRadius: '5px',
                width: '74%',
                padding: '15px 20px',
              }}
            >
              {active === 0 && <AllFriends friends={friends} />}
              {active === 1 && <AddFriends Addfriends={Addfriends} />}
              {active === 2 && <RequestFriends friendReq={friendReq} />}
              {active === 3 && (
                <BlockedFriends blockedFriends={blockedFriends} />
              )}
            </Flex>
          </Flex>
        </Stack>
      </Container>
    </div>
  );
}

export default Friends;
