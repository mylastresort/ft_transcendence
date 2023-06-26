import { Container, Text } from '@mantine/core';
import MsgInput from './MsgInput';

interface Props {
  width: string | number | undefined;
}

function Message({content, pos}: {content:string, pos:string}){
  return (
    <Container left={pos}>
      <Text>{content}</Text>
    </Container>
  );
}

function ListMessages(){
  return (
    <Container
      style={{
        height:"calc(100% - 77px)"
      }}>
        {/* <Message content='hello world' pos></Message> */}
    </Container>
  )
}

function MainChat({ width }: Props) {
  return (
    <Container
      style={{
        backgroundColor: '#EAEAEA',
        width: width,
        maxWidth: width,
      }}
      p={0}
    >
      <ListMessages />
      <MsgInput />
    </Container>
  );
}

export default MainChat;
