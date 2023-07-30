import { Button, Container } from '@mantine/core';
import Message from './Message';
import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '@/context/chat';
import request from 'superagent';
import { ChatSocketContext, socket } from '@/context/chatSocketContext';

export default function MsgList({ h, isChannel = false }) {
  const chatSocket = useContext(ChatSocketContext);
  const route = isChannel ? 'channel' : 'private';
  interface MessageI {
    id: number;
    sendAt: string;
    content: string;
    chatId: number;
    sendBy: any;
  }
  const chatContext = useContext(ChatContext);
  const [messages, setMessages]: [
    { id: number; content: string; sender: any }[],
    any
  ] = useState([]);
  const [load, setLoad] = useState(false);
  const jwtToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    request
      .get(`http://localhost:4400/api/chat/${route}/msgs`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .query({ id: chatContext.data.id })
      .then((res) => {
        console.log(res.body);
        isChannel
          ? setMessages(res.body.messages)
          : setMessages(res.body.Messages);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [chatContext.data.id]);

  const socket = useContext(ChatSocketContext);
  useEffect(()=>{
    socket.emit('join-room', chatContext.data.name);
  }, [])
  return (
    <Container
      w={'95%'}
      maw={2000}
      style={{
        height: h,
      }}
    >
      {messages.map((message) => (
        <Message
          key={message.id}
          content={message.content}
          sendBy={isChannel ? message.sender.user : message.sender}
        />
      ))}
      <Button ml={55} onClick={() => setLoad(load ? false : true)}>
        load messages
      </Button>
    </Container>
  );
}
