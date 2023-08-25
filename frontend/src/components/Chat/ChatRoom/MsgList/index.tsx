import { Button, Container, Flex, ScrollArea } from '@mantine/core';
import Message from './Message';
import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '@/context/chat';
import request from 'superagent';
import { ChatSocketContext } from '@/context/chatSocketContext';
import { UserSocket } from '@/context/WsContext';

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
  const [blocked, setBlocked] = useState([] as number[]);
  const [updateBlocked, setUpdateBlocked] = useState(false);

  useEffect(() => {
    request
    .get(process.env.BACKEND_DOMAIN + '/api/chat/users/blocked')
    .set('Authorization', `Bearer ${jwtToken}`)
    .then((res) => {
      console.log("blocked users: ", res.body);
      setBlocked(res.body);
    })
    .catch((err) => {
      console.log(err);
    });
  }, [updateBlocked]);

  useEffect(() => {
    request
      .get(`${process.env.BACKEND_DOMAIN}/api/chat/${route}/msgs`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .query({ id: chatContext.data.id })
      .then((res) => {
        const msgs = res.body.filter((msg)=>
          !blocked.includes(msg.sender.userId))
        setMessages(msgs);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [chatContext.data.id, blocked]);

  useEffect(() => {
    socket.on(`${route}/newMsg`, (newMessage) => {
      const senderId : number = isChannel ? newMessage.sender.userId : newMessage.senderId;
      if (!blocked.includes(senderId)){
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });
    UserSocket.on('BlockedEvent', (data) => {
      setUpdateBlocked((state)=>!state);
    });
    UserSocket.on('UnBlockedEvent', (data) => {
      setUpdateBlocked((state)=>!state);
    });
    return ()=>{
      socket.off(`${route}/newMsg`);
      socket.off('BlockedEvent');
      socket.off('UnBlockedEvent');
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
