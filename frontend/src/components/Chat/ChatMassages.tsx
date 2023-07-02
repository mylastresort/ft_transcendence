import { Container } from '@mantine/core';
import MsgInput from './MsgInput';

interface Props {
  width: string | number | undefined;
}

function MainChat({ width }: Props) {
  return (
    <Container
      style={{
        backgroundColor: '#EAEAEA',
        // height: '100%',
        width: width,
        maxWidth: width,
      }}
    >
      <MsgInput />
    </Container>
  );
}

export default MainChat;
