import { Button, Container } from '@mantine/core';
import Message from './Message';
import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '@/context/chat';
import request from 'superagent';

export default function MsgList() {
  interface MessageI {
    id: number;
    sendAt: string;
    content: string;
    chatId: number;
    sendBy: any[];
  }
  const chatContext = useContext(ChatContext);
  const [messages, setMessages]: [MessageI[], any] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    request
      .get('http://localhost:4400/api/chat/private/msgs')
      .send({ id: chatContext.data.id })
      .then((res) => {
        setMessages(res.body);
        console.log('messages: ', res.body);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [load]);
  return (
    <Container
    w={'95%'}
    maw={2000}
      style={{
        height: 'calc(100% - 77px)',
      }}
    >
      {messages.map((message) => (
        <Message
          content={message.content}
          sendBy={message.sendBy[0]}
        />
      ))}
      <Button ml={55} onClick={() => setLoad(load ? false : true)}>load messages</Button>
    </Container>
  );
}
