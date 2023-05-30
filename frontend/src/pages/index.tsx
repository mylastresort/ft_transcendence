import {
  Button,
  Text,
  Image,
  Grid,
  Container,
  Spacer,
  Dropdown,
} from '@nextui-org/react';
import Styles from './style.module.css';
import Particles_background from '@/components/Animated_bg/Particles_background';
import '@fontsource/poppins';
import 'typeface-baumans';
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { FeaturesAsymmetrical } from '@/components/Mantine/FeaturesAsymmetrical';
import { UserCardImage } from '@/components/Mantine/UserCardImage';
import { AboutBanner } from '@/components/Mantine/AboutBanner';
import { Footer } from '../components/Footer/Footer';

const user_data = {
  image:
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
  avatar:
    'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
  name: 'Bill Headbanger',
  job: 'Fullstack engineer',
  stats: [
    {
      value: '34K',
      label: 'Followers',
    },
    {
      value: '187',
      label: 'Follows',
    },
    {
      value: '1.6K',
      label: 'Posts',
    },
  ],
};

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: '#141414' }}>
      <React.Fragment>
        <Particles_background />
        <Grid>
          <Container lg>
            <Grid className={Styles.Landing_layout}>
              <Spacer y={10} />
              <Grid
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  zIndex: 1,
                }}
              >
                <Text
                  h1
                  css={{
                    color: '#fff',
                    fontFamily: 'Baumans',
                    fontSize: '7rem',
                    lineHeight: '1.1em',
                    textAlign: 'center',
                    letterSpacing: '0.8px',
                  }}
                >
                  PING <br /> PONG
                </Text>
              </Grid>
              <Spacer y={0.9} />
              <Grid css={{ zIndex: '1' }}>
                <button
                  className={Styles.btn_css}
                  style={{ fontFamily: 'Baumans', fontSize: '2.5rem' }}
                >
                  Play
                </button>
              </Grid>
              <Spacer y={10} />
              <Card
                variant="outlined"
                style={{
                  borderRadius: '25px',
                  boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 12px',
                  borderWidth: '0px',
                  width: '100%',
                  padding: '40px 0',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Baumans',
                    fontSize: '3rem',
                    textAlign: 'center',
                    fontWeight: '500',
                  }}
                >
                  Features
                </Text>
                <FeaturesAsymmetrical />
              </Card>
              <Spacer y={5} />
              <Grid className={Styles.team_card}>
                <Text
                  style={{
                    fontFamily: 'Baumans',
                    fontSize: '3rem',
                    textAlign: 'center',
                    fontWeight: '500',
                    color: '#fff',
                  }}
                >
                  Project contributors
                </Text>
                <Grid.Container
                  gap={2.5}
                  justify="center"
                  css={{ padding: '40px 30px 40px 30px' }}
                >
                  <Grid sm={3}>
                    <UserCardImage
                      image={user_data.image}
                      avatar={user_data.avatar}
                      name={user_data.name}
                      job={user_data.job}
                      stats={user_data.stats}
                    />
                  </Grid>
                  <Grid sm={3}>
                    <UserCardImage
                      image={user_data.image}
                      avatar={user_data.avatar}
                      name={user_data.name}
                      job={user_data.job}
                      stats={user_data.stats}
                    />
                  </Grid>
                  <Grid sm={3}>
                    <UserCardImage
                      image={user_data.image}
                      avatar={user_data.avatar}
                      name={user_data.name}
                      job={user_data.job}
                      stats={user_data.stats}
                    />
                  </Grid>
                </Grid.Container>
              </Grid>
              <Spacer y={5} />
              <Grid>
                <AboutBanner />
              </Grid>
            </Grid>
          </Container>
          <Spacer y={2} />
        </Grid>
      </React.Fragment>
    </div>
  );
}
