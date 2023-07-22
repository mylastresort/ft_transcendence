import { Box } from '@mantine/core';
import React, { forwardRef } from 'react';
import styles from './Canvas.module.css';

export default forwardRef<HTMLDivElement, { paddle: number; isLeft?: boolean }>(
  function Player({ paddle, isLeft }, ref) {
    return (
      <Box
        className={styles.player}
        ref={ref}
        style={{ height: paddle, translate: isLeft ? '-100%' : '100%' }}
      />
    );
  }
);
