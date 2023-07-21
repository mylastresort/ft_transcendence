import {
  Box,
  Button,
  Flex,
  Group,
  Input,
  MantineTheme,
  TextInput,
  ThemeIcon,
  createStyles,
} from '@mantine/core';
import Styles from './Chat.module.css';
import { positions } from '@mui/system';
import { theme } from '@nextui-org/react';
import { useContext, useState } from 'react';
import request from 'superagent';
import { ChatContext } from '@/context/chat';
import { UserContext } from '@/context/user';
import { useForm } from '@mantine/form';

const useInputStyle = createStyles((theme: MantineTheme) => ({
  input: {
    border: '2px solid #87d1db',
    background: '#EAEAEA',
    color: 'grey',
    ":focus":{
    }
  },
  box: {
    display: 'flex',
    width: '100%',
    height: '77px',
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
}));


export default function ChatInput() {
  const chatContext = useContext(ChatContext);
  const userContext = useContext(UserContext);
  function sendMessage(value: String) {
    const req = {
      id: chatContext.data.id,
      msg: {
        content: value,
        sendBy: userContext.data.username,
      },
    };
    request
      .post('http://localhost:4400/api/chat/private/msgs')
      .send(req)
      .then((res) => {
        console.log('messages: ', res.body);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const form = useForm({
    initialValues: {
      message: '',
    },
  });

  const inputStyles = useInputStyle();
  return (
    <Box
      w={'100%'}
      mx="auto"
      bg={'white'}
      h={77}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <form
        onSubmit={form.onSubmit((value) => {
          value.message && sendMessage(value.message);
          value.message = '';
        })}
        style={{
          width: '70%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TextInput
        h={50}
        radius={50}
        size={'lg'}
        classNames={inputStyles.classes}
        w={'calc(90% - 20px)'}
          withAsterisk
          placeholder="Send Message ..."
          {...form.getInputProps('message')}
        />
          <Button type="submit" radius={50} h={50} w={50} p={4}>
              <img src="/images/SendIcon.svg"  />
          </Button>
      </form>
    </Box>
  );
}
