import React, { useState } from 'react';
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
} from '@mantine/core';
import { Grid, Spacer, Image } from '@nextui-org/react';
import Styles from './account.module.css';
import { HiUsers } from 'react-icons/hi';
import { FaLevelUpAlt } from 'react-icons/fa';
import { MdAccessTimeFilled, MdOutput } from 'react-icons/md';
import { BsFillCalendar2DateFill } from 'react-icons/bs';

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
  const itemsPerPage = 6;

  const data = [1, 2, 3, 4, 5, 6, 7, 8];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Stack justify="center" align="center">
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
            {currentData.map((item, index) => (
              <tr key={index}>
                <td>
                  <Stack>
                    <UnstyledButton>
                      <Group>
                        <Avatar size={40} color="cyan" variant="light">
                          BH
                        </Avatar>
                        <div style={{ flex: 1 }}>
                          <Text size="sm" weight={500}>
                            player1
                          </Text>
                        </div>
                      </Group>
                    </UnstyledButton>
                    <UnstyledButton>
                      <Group>
                        <Avatar size={40} color="cyan" variant="light">
                          BH
                        </Avatar>
                        <div style={{ flex: 1 }}>
                          <Text size="sm" weight={500}>
                            player2
                          </Text>
                        </div>
                      </Group>
                    </UnstyledButton>
                  </Stack>
                </td>
                <td>
                  <Badge color="green" size="lg" radius="sm">
                    winner
                  </Badge>
                </td>
                <td>
                  <Avatar color="cyan" radius="xl">
                    7
                  </Avatar>
                </td>
                <td>2021-10-10</td>
                <td>10min:00sec</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Stack>
      <Pagination
        color="cyan"
        total={Math.ceil(data.length / itemsPerPage)}
        value={currentPage}
        onChange={handlePageChange}
      />
    </Stack>
  );
}
