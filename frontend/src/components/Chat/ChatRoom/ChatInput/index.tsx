import {
  Box,
  Button,
  MantineTheme,
  TextInput,
  createStyles,
} from '@mantine/core';
import { useContext, useState } from 'react';
import request from 'superagent';
import { ChatContext } from '@/context/chat';
import { UserContext } from '@/context/user';
import { useForm } from '@mantine/form';
import { ChatSocketContext } from '@/context/chatSocketContext';

const useInputStyle = createStyles((theme: MantineTheme) => ({
  input: {
    border: '2px solid #87d1db',
    background: '#EAEAEA',
    color: 'grey',
    ':focus': {},
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

export default function ChatInput({ isChannel = false }) {
  const route = isChannel ? 'channel' : 'private';
  const chatContext = useContext(ChatContext);
  const socketContext = useContext(ChatSocketContext);
  function sendMessage(value: String) {
    const req = {
      id: chatContext.data.id,
      name: chatContext.data.name,
      message: {
        content: value,
      },
    };
    try{
      socketContext.emit(`${route}/sendMsg`, req);
    } catch (err) {}
  }
  const form = useForm({
    initialValues: {
      message: '',
    },
    validate: {
      message: (msg) => msg.trim() == '',
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
          value.message.trim() && sendMessage(value.message.trim());
          form.reset();
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
          disabled={chatContext.data.me?.isMuted}
        />
        <Button type="submit" radius={50} h={50} w={50} p={4}>
          <img src="/images/SendIcon.svg" />
        </Button>
      </form>
    </Box>
  );
}
