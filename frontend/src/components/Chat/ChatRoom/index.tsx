import { Container, Text, Box } from '@mantine/core';
import MsgInput from './MsgInput';

interface Props {
  width: string | number | undefined;
}

function Message({ content, pos }: { content: string; pos: string }) {
  return (
    <Container left={pos}>
      <Text>{content}</Text>
    </Container>
  );
}

function ListMessages() {
  return (
    <Container
      style={{
        height: 'calc(100% - 77px)',
      }}
    >
      {/* <Message content='hello world' pos></Message> */}
    </Container>
  );
}

function ChatRoom() {
  return (
    <Box bg={'#EAEAEA'} w={'calc(100%)'} p={0}>
      <ListMessages />
      <MsgInput />
    </Box>
  );
}

export default ChatRoom;
