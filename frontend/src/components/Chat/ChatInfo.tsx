import { Container, MantineNumberSize } from '@mantine/core';
import { Interface } from 'readline';

interface Props {
  width: string | number | undefined;
}

function UserInfo({ width }: Props) {
  return (
    <Container
      bg={'#C1C1C1'}
      w={350}
    ></Container>
  );
}

export default UserInfo;