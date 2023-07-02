import { Container, MantineNumberSize } from '@mantine/core';
import { Interface } from 'readline';

interface Props {
  width: string | number | undefined;
}

function UserInfo({ width }: Props) {
  return (
    <Container
      style={{
        backgroundColor: '#C1C1C1',
        // height: '100%',
        width: width,
        maxWidth: width,
      }}
    ></Container>
  );
}

export default UserInfo;