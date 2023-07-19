import { Container, Text, Box, MediaQuery } from '@mantine/core';
import MsgInput from './MsgInput';
import UserInfo from './UserInfo';
import { useContext } from 'react';
import { ChatContext } from '@/context/chat';
import Message from './Message';

interface Props {
  width: string | number | undefined;
}


function ListMessages() {
  return (
    <Container
      style={{
        height: 'calc(100% - 77px)',
      }}
    >
      <Message content={"hello this is the first message"}/>
    </Container>
  );
}

function ChatRoom( {cardSelected, setCardSelected} : any) {
  console.log("is it:", cardSelected)
  const chatContext = useContext(ChatContext);
  return cardSelected ? (
    <>
      <MediaQuery smallerThan={1000} styles={{ width: 'calc(100% - 60px)' }}>
        <Box bg={'#EAEAEA'} w={'calc(70% - 55px)'}>
          <ListMessages />
          <MsgInput />
        </Box>
      </MediaQuery>
      <MediaQuery smallerThan={1000} styles={{ display: 'none' }}>
        <Box bg={'#EAEAEA'} w={'calc(30% - 33px)'}>
          <UserInfo setCardSelected={setCardSelected} />
        </Box>
      </MediaQuery>
    </>
  ) : (
    <Box bg={'#EAEAEA'} w={'calc(100% - 55px)'}></Box>
  );
}

export default ChatRoom;
