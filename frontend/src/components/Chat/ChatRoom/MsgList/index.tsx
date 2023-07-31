 import { Button, Container } from '@mantine/core';
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
        console.log(res.body);
        isChannel
          ? setMessages(res.body.messages)
          : setMessages(res.body.Messages);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [chatContext.data.id]);

  
  useEffect(()=>{
    console.log('joining room');
    socket.emit(`${route}/join-room`, isChannel ? chatContext.data.name : chatContext.data.id);
    socket.on('newMsg', (newMessage)=>{
      setMessages((prevMessages) => [...prevMessages, newMessage])
      console.log(messages);
    });
  }, [chatContext.data.id]);
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
    </Container>
  );
}
