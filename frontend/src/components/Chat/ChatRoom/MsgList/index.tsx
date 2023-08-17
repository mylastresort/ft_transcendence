import { Button, Container, Flex, ScrollArea } from '@mantine/core';
import Message from './Message';
import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '@/context/chat';
import request from 'superagent';
import { ChatSocketContext, socket } from '@/context/chatSocketContext';

interface MessageI {
  id: number;
  sendAt: string;
  content: string;
  chatId: number;
  sendBy: any;
}

export default function MsgList({ h, isChannel = false }) {
  const jwtToken = localStorage.getItem('jwtToken');
  const socket = useContext(ChatSocketContext);
  const chatContext = useContext(ChatContext);

  const route = isChannel ? 'channel' : 'private';
  const [messages, setMessages]: [
    { id: number; content: string; sender: any }[],
    any
  ] = useState([]);

  useEffect(() => {
    request
      .get(`http://localhost:4400/api/chat/${route}/msgs`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .query({ id: chatContext.data.id })
      .then((res) => {
        setMessages(res.body);
        console.log(messages);
      })
      .catch((err) => {
        console.log(err);
      });

  }, [chatContext.data.id]);

  useEffect(() => {
    socket.on(`${route}/newMsg`, (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    return ()=>{
      socket.off(`${route}/newMsg`);
    }
  }, [route]);

  return (
    <Container
      style={{
        height: h,
      }}
      maw={'100%'}
    >
      <ScrollArea
        h={'100%'}
        p={'0px 30px'}
        styles={{
          viewport: {
            display: 'flex',
            flexDirection: 'column-reverse',
          },
        }}
      >
        {messages.map((message) => (
          <Message
            key={message.id}
            content={message.content}
            sendBy={isChannel ? message.sender.user : message.sender}
          />
        ))}
      </ScrollArea>
    </Container>
  );
}
