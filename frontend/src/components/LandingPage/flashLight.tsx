import { Box, Button } from '@mantine/core';
import React, { MouseEvent, useState } from 'react';
import { SunHigh } from 'tabler-icons-react';

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
        background:
          'radial-gradient(circle at var(--x) var(--y), transparent 10%, rgba(0, 0, 0, 0.95) 20%)',
        zIndex: 100,
      }}
    >
        <Box sx={{
            position: 'absolute',
            right: '20px',
            top: '88px',
            zIndex: 101,
        }}
        onClick={(e)=>{console.log("nsldfj")}}
        >
            <SunHigh size={48} strokeWidth={2} color={'#a3a3a3'} />
        </Box>
    </Box>
  );
}
