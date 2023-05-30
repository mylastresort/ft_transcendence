import React, { useEffect } from 'react';
import { Container } from '@mantine/core';
import { Text, Grid, Spacer, Loading } from '@nextui-org/react';
import withAuth from '../lib/withAuth';

function dashboard() {
  return (
    <Grid className="dash_container">
      <Container size="xl">
        <Spacer y={4} />
        <Text
          className="text"
          h2
          css={{
            fontSize: '30px',
            fontFamily: 'poppins',
            fontWeight: '500',
            color: '#fff',
          }}
        >
          Explanation
        </Text>
      </Container>
    </Grid>
  );
}

export default withAuth(dashboard);
