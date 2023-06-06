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
import withAuth from '../lib/withAuth';
import { ImageSlider } from '@/components/Mantine/ImageSlider';
import Styles from './dashboard.module.css';

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
        className="text"
        h2
        css={{
          fontSize: '1.8rem',
          fontFamily: 'poppins',
          fontWeight: '500',
          color: '#000',
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
              color: '#000',
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
        <Button radius="sm" color="red">
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
        className="text"
        h2
        css={{
          fontSize: '1.8rem',
          fontFamily: 'poppins',
          fontWeight: '500',
          color: '#000',
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

function dashboard() {
  const [SelectedGame, setSelectedGame] = useState(0);
  return (
    <Grid className="dash_container">
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
            {SelectedGame === 2 && <div>wdwdwdwdw</div>}
          </Card>
        </Grid>
      </Container>
    </Grid>
  );
}

export default withAuth(dashboard);
