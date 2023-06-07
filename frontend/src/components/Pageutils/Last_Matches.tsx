import React, { use, useEffect, useState } from 'react';
import { Avatar, Badge, Group, Text, Select, ScrollArea } from '@mantine/core';
import { Grid, Spacer, Image, Table } from '@nextui-org/react';

interface UsersTableProps {
  data: {
    avatar: string;
    name: string;
    job: string;
    email: string;
    role: string;
  }[];
}

const dummyData = {
  data: [
    {
      player1: 'player1',
      player2: 'player2',
      result: 'winer',
      level: '2',
      date: '2021-10-10',
      duration: '10min:00sec',
    },
    {
      player1: 'player1',
      player2: 'player2',
      result: 'winer',
      level: '2',

      date: '2021-10-10',
      duration: '10min:00sec',
    },
    {
      player1: 'player1',
      player2: 'player2',
      result: 'winer',
      level: '2',

      date: '2021-10-10',
      duration: '10min:00sec',
    },
    {
      player1: 'player1',
      player2: 'player2',
      result: 'winer',
      level: '2',

      date: '2021-10-10',
      duration: '10min:00sec',
    },
    {
      player1: 'player1',
      player2: 'player2',
      result: 'winer',
      level: '2',

      date: '2021-10-10',
      duration: '10min:00sec',
    },
  ],
};

export function Last_Matches({ data }: UsersTableProps) {
  return (
    <Table
      lined
      headerLined
      shadow={false}
      aria-label="Example table with static content"
      css={{
        height: 'auto',
        minWidth: '100%',
      }}
    >
      <Table.Header>
        <Table.Column>Players</Table.Column>
        <Table.Column>Result</Table.Column>
        <Table.Column>Level</Table.Column>
        <Table.Column>Date</Table.Column>
        <Table.Column>Duration</Table.Column>
      </Table.Header>
      <Table.Body>
        {dummyData.data.map((item, index) => (
          <Table.Row key="1">
            <Table.Cell>
              <Text
                style={{
                  fontSize: '0.9rem',
                  fontFamily: 'poppins',
                  fontWeight: '400',
                }}
              >
                {item.player1}
              </Text>
              <Text
                style={{
                  fontSize: '0.9rem',
                  fontFamily: 'poppins',
                  fontWeight: '400',
                }}
              >
                {item.player2}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Badge color="green">{item.result}</Badge>
            </Table.Cell>
            <Table.Cell>
              <Text
                style={{
                  fontSize: '0.9rem',
                  fontFamily: 'poppins',
                  fontWeight: '400',
                }}
              >
                {item.level}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text
                style={{
                  fontSize: '0.9rem',
                  fontFamily: 'poppins',
                  fontWeight: '400',
                }}
              >
                {item.date}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text
                style={{
                  fontSize: '0.9rem',
                  fontFamily: 'poppins',
                  fontWeight: '400',
                }}
              >
                {item.duration}
              </Text>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
