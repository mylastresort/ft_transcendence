import React, { useState, useEffect, use } from 'react';
import {
  Avatar,
  Badge,
  Group,
  Text,
  Select,
  ScrollArea,
  Table,
  UnstyledButton,
  Pagination,
  Stack,
  Center,
} from '@mantine/core';
import { Grid, Spacer, Image } from '@nextui-org/react';
import Styles from './account.module.css';
import { HiUsers } from 'react-icons/hi';
import { FaLevelUpAlt } from 'react-icons/fa';
import { MdAccessTimeFilled, MdOutput } from 'react-icons/md';
import { BsFillCalendar2DateFill } from 'react-icons/bs';
import { GetGameMatches } from '@/pages/api/friends/friends';
import { ImNotification } from 'react-icons/im';

interface UsersTableProps {
  data: {
    avatar: string;
    name: string;
    job: string;
    email: string;
    role: string;
  }[];
}

export function Last_Matches() {
  const [currentPage, setCurrentPage] = useState(1);
  const [GameMatches, setGameMatches] = useState<[]>([]);
  const [username, setUsername] = useState<string>('');

  const itemsPerPage = 6;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = GameMatches?.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const usernameUrl = window.location.pathname.split('/')[2];
    setUsername(usernameUrl);

    GetGameMatches()
      .then((res) => {
        console.log(res.body);
        setGameMatches(res.body.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Stack justify="center" align="center">
      {currentData?.length > 0 ? (
        <>
          <Stack style={{ minHeight: '48em', width: '100%' }}>
            <Table verticalSpacing="xs" fontSize="md" highlightOnHover>
              <thead>
                <tr>
                  <th>
                    <Group spacing={10}>
                      <HiUsers />
                      Players
                    </Group>
                  </th>
                  <th>
                    <Group spacing={10}>
                      <MdOutput />
                      Result
                    </Group>
                  </th>
                  <th>
                    <Group spacing={10}>
                      <FaLevelUpAlt />
                      Level
                    </Group>
                  </th>
                  <th>
                    <Group spacing={10}>
                      <BsFillCalendar2DateFill />
                      Date
                    </Group>
                  </th>
                  <th>
                    <Group spacing={10}>
                      <MdAccessTimeFilled />
                      Duration
                    </Group>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData?.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Stack>
                        <UnstyledButton>
                          <Group>
                            <Avatar
                              src={item?.winner?.user?.imgProfile}
                              size={40}
                              color="cyan"
                              variant="light"
                              radius="xl"
                            />
                            <div style={{ flex: 1 }}>
                              <Text size="sm" weight={500}>
                                {item?.winner?.user?.username}
                              </Text>
                            </div>
                          </Group>
                        </UnstyledButton>
                        <UnstyledButton>
                          <Group>
                            <Avatar
                              src={item?.loser?.user?.imgProfile}
                              size={40}
                              color="cyan"
                              variant="light"
                              radius="xl"
                            />
                            <div style={{ flex: 1 }}>
                              <Text size="sm" weight={500}>
                                {item?.loser?.user?.username}
                              </Text>
                            </div>
                          </Group>
                        </UnstyledButton>
                      </Stack>
                    </td>
                    <td>
                      <Badge
                        color={item?.status === username ? 'green' : 'red'}
                        size="lg"
                        radius="sm"
                      >
                        {item?.status === username ? 'WINNER' : 'LOSER'}
                      </Badge>
                    </td>
                    <td>
                      <Avatar color="cyan" radius="xl">
                        {item?.status === username
                          ? item?.winnerPostLevel?.toFixed(1)
                          : '-'}
                      </Avatar>
                    </td>
                    <td>
                      {item && new Date(item.startedat).toLocaleDateString()}
                    </td>
                    <td>
                      {item?.duration?.hours}h:{item?.duration?.minutes}m:
                      {item?.duration?.seconds}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Stack>
          <Pagination
            color="cyan"
            total={Math.ceil(GameMatches?.length / itemsPerPage)}
            value={currentPage}
            onChange={handlePageChange}
          />
        </>
      ) : (
        <Center
          style={{
            width: '100%',
            height: '79vh',
            backgroundColor: 'var(--sidebar-color)',
            borderRadius: '5px',
            flexDirection: 'column',
            border: '1px solid #9DA4AE',
          }}
        >
          <ImNotification size={60} />
          <Spacer y={1} />
          <Text className="Text_W500" style={{ fontSize: '1.2rem' }}>
            No Matches Found
          </Text>
        </Center>
      )}
    </Stack>
  );
}
