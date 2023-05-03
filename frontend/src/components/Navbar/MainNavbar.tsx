import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Grid, Image, Button } from '@nextui-org/react';
import '@fontsource/poppins';
import {login} from '@/pages/api/auth';

function MainNavbar() {

  const HandleLogin = () => {
    login().then((res) => {
      console.log(res);
    }
    ).catch((err) => {
      console.log(err);
    }
    );
  };
  return (
    <Grid css={{ background: '#141414' }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky" style={{ backgroundColor: '#141414' }}>
          <Toolbar>
            <Image src="/images/LOGO.png" />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
            <Button
              auto
              color="error"
              css={{
                fontFamily: 'poppins',
                fontSize: '1.1rem',
                fontWeight: '600',
                padding: '0 1.8em 0 1.8em',
              }}
              onClick={HandleLogin}
            >
              Login
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </Grid>
  );
}

export default MainNavbar;
