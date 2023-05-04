import { useState } from 'react';
import { Button, Container, Flex, Grid } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import SideBar from './_sideBar';
import MainChat from './_main';
import UserInfo from './_info';

function MyForm() {
    
    const {width, height } = useElementSize();
    return (
        <Grid gutter="0" style={{ width: '100%', height: '100vh', position: 'fixed', overflow: 'hidden'}}>
          <Grid.Col span={3}><SideBar /></Grid.Col>
          <Grid.Col span={6}><MainChat /></Grid.Col>
          <Grid.Col span={3}><UserInfo /></Grid.Col>
        </Grid>
    );
}

export default MyForm;