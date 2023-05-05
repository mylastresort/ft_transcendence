import { Container } from '@mantine/core';

interface Props {
  width: string | number | undefined;
}

function MainChat({ width }: Props) {
  return (
    <Container
      style={{
        backgroundColor: '#EAEAEA',
        height: '100%',
        width: width,
      }}
    ></Container>
  );
}

export default MainChat;
