import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Grid, Image, Button } from '@nextui-org/react';
import '@fontsource/poppins';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

function MainNavbar({ Show }) {
  if (!Show) {
    return;
  } else {
    const router = useRouter();
    const handleLogin = () => {
      router.push('http://localhost:4400/api/v1/auth/42');
    };

    return (
      <Grid css={{ background: '#141414' }}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="sticky" style={{ backgroundColor: '#141414' }}>
            <Toolbar>
              <a href="/">
                <Image src="/images/LOGO.png" />
              </a>
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
                onClick={handleLogin}
              >
                Login
              </Button>
            </Toolbar>
          </AppBar>
        </Box>
      </Grid>
    );
  }
}

export default MainNavbar;
