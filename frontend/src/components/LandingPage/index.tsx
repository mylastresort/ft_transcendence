import React from 'react';
import withAuth from '@/pages/lib/withAuth';
import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  List,
  ScrollArea,
  Text,
  createStyles,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { LoginButton } from './LoginButton';
import { useMediaQuery } from '@mui/material';
import { FlashLight } from './flashLight';

const useStyles = createStyles((theme) => ({
  button: {
    width: '110px',
    color: 'black',
    backgroundColor: 'transparent',
    padding: '4px',
    margin: '10px',
    '&:hover': {
      cursor: 'pointer',
      borderColor: '#F31260',
      color: '#F31260',
      boxShadow: '0px 0px 10px #F31260',
      textShadow: '0px 0px 3px #F31260',
    },
  },
}));

function LandingPage() {
  var doc = document.documentElement;
  const handleEvent = (ev: any) => {
    doc.style.setProperty('--x', ev.clientX + 'px');
    doc.style.setProperty('--y', ev.clientY + 'px');
  };
  const matches = useMediaQuery('(min-width: 1000px)');
  const { classes } = useStyles();
  return (
    <Flex
      w={'100vw'}
      h={'100vh'}
      align={'center'}
      justify={'space-between'}
      style={{
        flexDirection: 'column',
      }}
      onMouseMove={handleEvent}
    >
      <Box w={'100vw'} h={'100vh'} pos={'fixed'} bg={'#D9DBD4'} />
      <FlashLight />
      <Flex
        h={'100%'}
        w={'100%'}
        maw={'2600px'}
        mt={'100px'}
        align={'center'}
        justify={'space-evenly'}
        style={{
          flexDirection: matches ? 'row' : 'column',
        }}
      >
        <Box
          w={matches ? '50%' : '100%'}
          maw={'900px'}
          h={'50%'}
          pl={'10%'}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <img
            src="/logo.svg"
            style={{
              width: '70%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
          <Text mt={'20px'} size={'xl'} color="dimmed">
            This is a simple PingPong game writen in Typescript using NextJs and
            NestJs Frameworks
          </Text>
          <Box mt={'40px'}>
            <LoginButton s={'lg'} />
          </Box>
        </Box>
        <Box
          w={matches ? '50%' : '100%'}
          maw={'900px'}
          h={'50%'}
          mt={10}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src="/images/PingPongBg2.gif"
            style={{
              zIndex: 0,
            }}
          />
        </Box>
      </Flex>
      <Box
        w={'100%'}
        h={'120px'}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 100,
        }}
      >
        <Text color="black">Made By:</Text>
        <List>
          <a href="https://github.com/1337Impact">
            <button className={classes.button}>Mohammed Benkhattab</button>
          </a>
          <a href="https://github.com/1337Impact">
            <button className={classes.button}>Zakaria Kasmi</button>
          </a>
          <a href="https://github.com/1337Impact">
            <button className={classes.button}>Sammy tamim</button>
          </a>
        </List>
      </Box>
    </Flex>
  );
}

export default withAuth(LandingPage);
