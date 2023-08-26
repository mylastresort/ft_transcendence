import React from 'react';
import withAuth from '@/pages/lib/withAuth';
import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  List,
  Text,
  createStyles,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { LoginButton } from './LoginButton';
import { useMediaQuery } from '@mui/material';

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
    }
  },
}));

function LandingPage() {
const matches = useMediaQuery('(min-width: 1000px)');
  const { classes } = useStyles();
  return (
    <Flex
      pos={'fixed'}
      align="center"
      justify={'center'}
      style={{ width: '100vw', height: '100vh', flexDirection: 'column' }}
      bg={'#D9DBD4'}
    >
      <Flex
      style={{
        flexDirection: matches ? 'row' : 'column'
      }}>
        <Box
          w={matches ? '50%' : '100%'}
          h={'50%'}
          pl={'10%'}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <img
            src="/logo.svg"
            style={{
              width: '70%',
              left: '0px',
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
          h={'50%'}
          mt={10}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src="https://cdn.dribbble.com/users/1449753/screenshots/4579883/media/6a81f249bd433ea0bd4ea80e17e127fc.gif"
            style={{
              width: '100%',
              zIndex: 0,
            }}
          />
        </Box>
      </Flex>
      <Box
        w={'100%'}
        h={'190px'}
        sx={{
          position: 'absolute',
          bottom: '0px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '&a': {
            color: 'red',
          },
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
