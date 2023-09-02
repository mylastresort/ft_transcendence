import { Box, Button } from '@mantine/core';
import React, { MouseEvent, useState } from 'react';
import { Moon, SunHigh } from 'tabler-icons-react';

export function FlashLight() {
  const [theme, setTheme] = useState(true);
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        pointerEvents: 'none',
        background: theme
          ? 'transparent'
          : 'radial-gradient(circle at var(--x) var(--y), transparent 10%, rgba(0, 0, 0, 0.94) 20%)',
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          right: '20px',
          top: '94px',
          zIndex: 101,
          pointerEvents: 'visible',
          '&:hover':{
            cursor: 'pointer',
          }
        }}
        onClick={(e) => {
          setTheme((state) => !state);
        }}
      >
        {theme ?<Moon size={40} strokeWidth={2} color={'#595858'} />
        :<SunHigh size={40} strokeWidth={2} color={'#a3a3a3'} />}
      </Box>
    </Box>
  );
}
