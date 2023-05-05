import { Container, Grid } from '@mantine/core';

interface Props {
  width: string | number | undefined;
}

const dummyUsers = [
  {
    name: 'John Doe',
    status: 'online',
  },
  {
    name: 'John Doe',
    status: 'online',
  },
  {
    name: 'John Doe',
    status: 'online',
  },
  {
    name: 'John Doe',
    status: 'online',
  },
];

function 

function SideBar({ width }: Props) {
  return (
    <Container
      style={{
        backgroundColor: '#C1C1C1',
        height: '100vh',
        width: width,
      }}
    >
      <Grid>
        <Grid.Col
        style={{
          backgroundColor: 'red',
          height: '60px',
          width: '100%',
        }}
        >

        </Grid.Col>
      </Grid>

    </Container>
  );
}

export default SideBar;
