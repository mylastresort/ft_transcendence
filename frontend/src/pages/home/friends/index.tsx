import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Container,
  Center,
  Flex,
} from '@mantine/core';
import { Spacer } from '@nextui-org/react';
import { ImNotification } from 'react-icons/im';
import {
  Get_Not_Friends,
  PostSendFriendRequest,
  PostCancelFriendRequest,
} from '@/pages/api/friends/friends';

import Styles from './friends.module.css';
import withAuth from '@/pages/lib/withAuth';
import { UserSocket } from '@/context/WsContext';
import { PostAcceptFriendRequest } from '@/pages/api/friends/friends';
import Router from 'next/router';

function friends() {
  const [Users, setUsers] = useState<any>(null);
  const [ReFetch, setReFetch] = useState(false);

  // const UserSocket = useContext(WsContext);

  useEffect(() => {
    UserSocket?.on('NewRequestNotification', (data) => {
      Get_Not_Friends()
        .then((res) => {
          setUsers(res.body);
        })
        .catch((err) => {});
    });
    UserSocket?.on('CandelFriendReq', (data) => {
      Get_Not_Friends()
        .then((res) => {
          setUsers(res.body);
        })
        .catch((err) => {});
    });

    UserSocket?.on('AcceptFriendReq', (data) => {
      Get_Not_Friends()
        .then((res) => {
          setUsers(res.body);
        })
        .catch((err) => {});
    });

    return () => {
      UserSocket?.off('NewRequestNotification');
      UserSocket?.off('CandelFriendReq');
      UserSocket?.off('AcceptFriendReq');
    };
  }, []);

  useEffect(() => {
    Get_Not_Friends()
      .then((res) => {
        setUsers(res.body);
      })
      .catch((err) => {});
  }, [ReFetch]);

  const HandleAddFriend = (data: any) => () => {
    const payload = {
      receiverId: data.id,
    };
    PostSendFriendRequest(payload)
      .then((res) => {
        if (res.status === 200) {
          setReFetch(!ReFetch);
        }
      })
      .catch((err) => {});
  };

  const HandleCancelRequest = (data: any) => () => {
    const payload = {
      receiverId: data.id,
      senderId: data.receivedRequests[0].senderId,
    };
    PostCancelFriendRequest(payload)
      .then((res) => {
        if (res.status === 200) {
          setReFetch(!ReFetch);
        }
      })
      .catch((err) => {});
  };

  const HandleCancelRequestReceiver = (data: any) => () => {
    const payload = {
      senderId: data.sentRequests[0].senderId,
      receiverId: data.sentRequests[0].receiverId,
    };

    PostCancelFriendRequest(payload)
      .then((res) => {
        if (res.status === 200) {
          setReFetch(!ReFetch);
        }
      })
      .catch((err) => {});
  };

  const HandleAcceptRequest = (data: any) => () => {
    const payload = {
      id: data.sentRequests[0].senderId,
    };

    PostAcceptFriendRequest(payload)
      .then((res) => {
        setReFetch(!ReFetch);
      })
      .catch((err) => {});
  };

  return (
    <div className="dash_container">
      <Container size="xl">
        <Text className="Text_W500" style={{ fontSize: '1.2rem' }}>
          People You May Know
        </Text>
        <Spacer y={1} />
        <Group position="left">
          {Users?.length === 0 ? (
            <Center
              style={{
                width: '100%',
                height: '60vh',
                backgroundColor: 'var(--sidebar-color)',
                borderRadius: '5px',
                flexDirection: 'column',
                border: '1px solid #9DA4AE',
              }}
            >
              <ImNotification size={60} />
              <Spacer y={1} />
              <Text className="Text_W500" style={{ fontSize: '1.2rem' }}>
                No Users Found
              </Text>
            </Center>
          ) : (
            Users?.map((data: any, index: number) => (
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className={Styles.Card_friend}
                key={index}
              >
                <Card.Section component="a">
                  <Image
                    src={data.imgProfile}
                    // width={200}
                    alt="Norway"
                    fit="cover"
                    onClick={() => {
                      Router.push(`/profile/${data.username}`);
                    }}
                  />
                </Card.Section>

                <Flex justify="space-between" w="100%" py="sm">
                  <Text className="Text_W500" lineClamp={1}>
                    {data.firstName} {data.lastName}
                  </Text>
                  <Badge color="gray" variant="filled">
                    {data.username}
                  </Badge>
                </Flex>

                {data.receivedRequests.length > 0 ? (
                  <div>
                    <Spacer y={0.9} />
                    <Text className="Text_W500" style={{ fontSize: '0.9rem' }}>
                      Request Sent
                    </Text>
                    <Spacer y={0.5} />
                    <Button
                      color="red"
                      fullWidth
                      mt="md"
                      radius="md"
                      onClick={HandleCancelRequest(data)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : data.sentRequests.length > 0 ? (
                  <div>
                    <Button
                      variant="light"
                      fullWidth
                      mt="md"
                      radius="md"
                      color="green"
                      onClick={HandleAcceptRequest(data)}
                    >
                      Accept Request
                    </Button>
                    <Button
                      color="red"
                      fullWidth
                      mt="md"
                      radius="md"
                      onClick={HandleCancelRequestReceiver(data)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      variant="light"
                      fullWidth
                      mt="md"
                      radius="md"
                      color="gray"
                      onClick={HandleAddFriend(data)}
                    >
                      Add Friend
                    </Button>
                  </div>
                )}
              </Card>
            ))
          )}
        </Group>
      </Container>
    </div>
  );
}

export default withAuth(friends);
