import { Action } from '../game.reducer';
import {
  Button,
  Stack,
  Flex,
  TextInput,
  Slider,
  Text,
  NumberInput,
  Box,
  Input,
} from '@mantine/core';
import { DispatchContext, MapsContext, SocketContext } from '../context';
import { motion } from 'framer-motion';
import { Socket } from 'socket.io-client';
import { useForm } from '@mantine/form';
import { useSwipeable } from 'react-swipeable';
import React, { Dispatch, useContext, useState } from 'react';
import styles from './Customizer.module.css';

export default function Customizer({ map }: { map: number }) {
  const socket = useContext(SocketContext) as Socket;
  const dispatch = useContext(DispatchContext) as Dispatch<Action>;
  const maps = useContext(MapsContext);
  const form = useForm({
    initialValues: { speed: 5, games: 3, name: '' },
    validate: {
      name: (value) => {
        if (!value) return 'Room name is required';
        if (value.length > 20) return 'Room name is too long';
        return null;
      },
      speed: (value) => (value < 5 || value > 7 ? 'Invalid speed' : null),
      games: (value) =>
        value < 3 || value > 10 ? 'Invalid number of games' : null,
    },
  });
  const [selected, setSelected] = useState(map);
  const handlers = useSwipeable({
    onSwipedLeft: () => setSelected(Math.min(maps.length - 1, selected + 1)),
    onSwipedRight: () => setSelected(Math.max(0, selected - 1)),
    trackMouse: true,
  });

  return (
    <Flex align="center" h="100%" maw="1500px" m="0 auto">
      <Box
        component="form"
        onSubmit={form.onSubmit(() =>
          socket.emit(
            'join',
            {
              role: 'host',
              map: maps[selected].name,
              ...form.values,
            },
            () => dispatch({ type: 'LOBBY', value: { role: 'host' } })
          )
        )}
        className={styles.customizer}
      >
        <Flex
          justify="space-evenly"
          align="center"
          direction={{ base: 'column', sm: 'row' }}
        >
          <Flex align="center" gap="3rem">
            <Button
              bg="cyan"
              className={styles.prev_btn}
              disabled={selected === 0}
              display={{ base: 'none', sm: 'block' }}
              onClick={() => setSelected(Math.max(0, selected - 1))}
              variant="filled"
            />
            <Flex direction="column" gap="1em" align="center">
              <Box className={styles.map_container} {...handlers}>
                {maps.map((item, idx) => (
                  <Box
                    key={item.name + idx}
                    component={motion.div}
                    className={styles.map}
                    bg={`url(${item.url})`}
                    animate={{
                      opacity: 1 - 0.1 * Math.abs(selected - idx),
                      rotateY: 30 * Math.sign(idx - selected),
                      scale: 1 - 0.1 * Math.abs(selected - idx),
                      x: (idx - selected) * 25,
                      zIndex: 100 - 10 * Math.abs(selected - idx),
                      content: idx === selected ? item.name : undefined,
                    }}
                    transition={{ type: 'just' }}
                  />
                ))}
              </Box>
              <Text>{maps[selected].name}</Text>
            </Flex>
            <Button
              bg="cyan"
              className={styles.next_btn}
              disabled={!maps.length || selected === maps.length - 1}
              display={{ base: 'none', sm: 'block' }}
              onClick={() =>
                setSelected(Math.min(maps.length - 1, selected + 1))
              }
              variant="filled"
            />
          </Flex>
          <Stack spacing="2rem">
            <Input.Wrapper label="Speed">
              <Slider
                {...form.getInputProps('speed')}
                label={null}
                marks={[
                  { value: 5, label: 'normal' },
                  { value: 6, label: 'fast' },
                  { value: 7, label: 'super fast' },
                ]}
                max={7}
                min={5}
                step={0.01}
              />
            </Input.Wrapper>
            <NumberInput
              {...form.getInputProps('games')}
              label="How much do you wish to play?"
              max={10}
              min={3}
              placeholder="Number of games"
              sx={{ '& label': { color: 'white' } }}
            />
            <TextInput
              {...form.getInputProps('name')}
              label="Room name"
              sx={{ '& label': { color: 'white' } }}
              withAsterisk
            />
            <Button m="0 auto" w="12rem" h="2.7em" type="submit">
              Create
            </Button>
            <Button
              m="0 auto"
              w="12rem"
              h="2.7em"
              variant="outline"
              onClick={() => dispatch({ type: 'LEAVE' })}
            >
              Leave
            </Button>
          </Stack>
        </Flex>
      </Box>
    </Flex>
  );
}
