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

export default function LandingPage() {
  return (
    <React.Fragment>
      <Particles_background />
    <Grid>
      <Container lg >
        <Grid className={Styles.Landing_layout}>
          <Spacer y={10} />
          <Grid
            css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
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
          <Grid>
          <button className={Styles.btn_css}>Click me</button>
          </Grid>
        </Grid>
      </Container>
    </Grid>
            </React.Fragment>
  );
}
