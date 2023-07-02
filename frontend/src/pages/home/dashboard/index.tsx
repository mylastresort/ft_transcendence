import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  Input,
  Checkbox,
  Button,
  Group,
  Image,
} from '@mantine/core';
import { Text, Grid, Spacer, Loading } from '@nextui-org/react';
import withAuth from '@/pages/lib/withAuth';
import { ImageSlider } from '@/components/Mantine/ImageSlider';
import Styles from './dashboard.module.css';
import { UserCardGmage } from '@/components/Mantine/UserCardGmage';

const SliderData = [
  {
    image: '/images/map.png',
    title: '#1 Game Map',
  },
  {
    image: '/images/map.png',
    title: '#1 Game Map',
  },
  {
    image: '/images/map.png',
    title: '#1 Game Map',
  },
];

function SelectGame({ setSelectedGame }) {
  return (
    <Grid className={Styles.Center_LayoutW}>
      <Text
        className="Text_W500"
        h2
        css={{
          fontSize: '1.8rem',
        }}
      >
        Join the Game Now!
      </Text>
      <Spacer y={2} />
      <Grid
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Grid css={{ width: '45%' }}>
          <Text
            className="text"
            h2
            css={{
              fontSize: '1rem',
              fontFamily: 'poppins',
              fontWeight: '400',
              color: '#fff',
            }}
          >
            Get ready for some exciting gameplay! To join a game, simply select
            an open game lobby or create your own. Ready to play? Let the games
            begin!
          </Text>
        </Grid>
        <Grid css={{ width: '50%' }}>
          <Image src="/images/pingpong_prev.gif" />
        </Grid>
      </Grid>
      <Spacer y={3} />
      <Group>
        <Button
          radius="sm"
          color="indigo"
          onClick={() => {
            setSelectedGame(1);
          }}
        >
          Create Game
        </Button>
        <Button
          radius="sm"
          onClick={() => {
            setSelectedGame(2);
          }}
        >
          Join Game
        </Button>
      </Group>
    </Grid>
  );
}

function CreateGame({ setSelectedGame }) {
  return (
    <Grid className={Styles.Center_LayoutW}>
      <Text
        className="Text_W500"
        h2
        css={{
          fontSize: '1.8rem',
          fontFamily: 'poppins',
          fontWeight: '500',
        }}
      >
        Select a Game Map
      </Text>
      <Spacer y={2} />
      <ImageSlider slides={SliderData} />
      <Spacer y={2} />
      <Group>
        <Button radius="sm" color="indigo">
          Start Game
        </Button>
        <Button
          radius="sm"
          color="red"
          onClick={() => {
            setSelectedGame(0);
          }}
        >
          Cancel
        </Button>
      </Group>
    </Grid>
  );
}

function JoinGame({ setSelectedGame }) {
  const data = {
    image:
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    avatar:
      'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    name: 'Bill Headbanger',
    job: 'Fullstack engineer',
    stats: [
      {
        value: '3',
        label: 'Level',
      },
      {
        value: '12',
        label: 'Wins',
      },
      {
        value: '4',
        label: 'Losses',
      },
    ],
  };

  return (
    <Grid className={Styles.Center_LayoutW}>
      <Text
        className="Text_W500"
        h2
        css={{
          fontSize: '1.8rem',
          fontFamily: 'poppins',
          fontWeight: '500',
        }}
      >
        Looking for a Game
      </Text>
      <Spacer y={2} />
      <Grid className={Styles.Center_LayoutH}>
        <Grid css={{ width: '35%' }}>
          <UserCardGmage
            image={data.image}
            avatar={data.avatar}
            name="mza7a"
            stats={data.stats}
          />
        </Grid>
        <Grid css={{ width: '17%' }}>
          <Image src="/images/versus.png" />
        </Grid>
        <Grid css={{ width: '35%' }}>
          <UserCardGmage
            image={data.image}
            avatar={data.avatar}
            name="mza7a"
            stats={data.stats}
          />
        </Grid>
      </Grid>
      <Spacer y={2} />
      <Button
        w={200}
        radius="sm"
        color="red"
        size="md"
        onClick={() => {
          setSelectedGame(0);
        }}
      >
        Leave
      </Button>
    </Grid>
  );
}

function dashboard() {
  const [SelectedGame, setSelectedGame] = useState(0);
  return (
    <div className="dash_container">
      <Container size="xl">
        <Spacer y={4} />
        <Grid className={Styles.Center_Layout}>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className={Styles.Card_css}
          >
            {SelectedGame === 0 && (
              <SelectGame setSelectedGame={setSelectedGame} />
            )}
            {SelectedGame === 1 && (
              <CreateGame setSelectedGame={setSelectedGame} />
            )}
            {SelectedGame === 2 && (
              <JoinGame setSelectedGame={setSelectedGame} />
            )}
          </Card>
        </Grid>
      </Container>
    </div>
  );
}

export default withAuth(dashboard);
