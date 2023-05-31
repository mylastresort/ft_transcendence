import React from 'react';
import { Grid, Table, Spacer, Text, User, Badge } from '@nextui-org/react';
import { Container, Button } from '@mantine/core';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { CgGames } from 'react-icons/cg';
import Styles from './friends.module.css';
import withAuth from '../lib/withAuth';

const DummyData = [
  {
    username: '9azwo9za7',
    status: 'Online',
    signed_up: '2023/12/12',
    games: '23',
  },
  {
    username: '9azwo9za7',
    status: 'Online',
    signed_up: '2023/12/12',
    games: '23',
  },
  {
    username: '9azwo9za7',
    status: 'Online',
    signed_up: '2023/12/12',
    games: '23',
  },
  {
    username: '9azwo9za7',
    status: 'Online',
    signed_up: '2023/12/12',
    games: '23',
  },
  {
    username: '9azwo9za7',
    status: 'Online',
    signed_up: '2023/12/12',
    games: '23',
  },
  {
    username: '9azwo9za7',
    status: 'Online',
    signed_up: '2023/12/12',
    games: '23',
  },
];

function friends() {
  return (
    <Grid className="dash_container">
      <Container size="xl">
        <Spacer y={4} />
        <Grid>
          <Text
            className="text"
            h2
            css={{
              fontSize: '30px',
              fontFamily: 'poppins',
              fontWeight: '500',
              color: '#fff',
            }}
          >
            Friends
          </Text>
          <Spacer y={1} />
          <Table
            aria-label="Example static collection table"
            css={{
              height: 'auto',
              minWidth: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}
            color="secondary"
          >
            <Table.Header>
              <Table.Column>Username</Table.Column>
              <Table.Column>Played Games</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Signed Up</Table.Column>
              <Table.Column>Friend</Table.Column>
            </Table.Header>
            <Table.Body>
              {DummyData.map((data, index) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <User
                        src={
                          'https://9awzo9za7.s3.eu-central-1.amazonaws.com/1685544204163.jpg'
                        }
                        name={data.username}
                        description="Lvl 99"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="secondary">
                        <CgGames size="18px" />
                        <Spacer x={0.3} />
                        {data.games}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="success">{data.status}</Badge>
                    </Table.Cell>
                    <Table.Cell>{data.signed_up}</Table.Cell>
                    <Table.Cell>
                      <Button rightIcon={<AiOutlineUserAdd />} radius="md">
                        Add Friend
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
            <Table.Pagination
              shadow
              noMargin
              align="center"
              rowsPerPage={5}
              onPageChange={(page) => console.log({ page })}
            />
          </Table>
        </Grid>
      </Container>
    </Grid>
  );
}

export default withAuth(friends);
