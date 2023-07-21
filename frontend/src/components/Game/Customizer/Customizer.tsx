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
import { MapsContext } from '../../../context/game';
import { motion } from 'framer-motion';
import { useForm } from '@mantine/form';
import { useSwipeable } from 'react-swipeable';
import React, { useContext, useState } from 'react';
import styles from './Customizer.module.css';
import Link from 'next/link';
import { GameContext } from '@/context/game';
import { useRouter } from 'next/router';

export default function Customizer({ type = 'create', userId }) {
  const game = useContext(GameContext);
  const maps = useContext(MapsContext);
  const form = useForm({
    initialValues: { speed: 3, games: 3, name: '' },
    validate: {
      name: (value) => {
        if (!value) return 'Room name is required';
        if (value.length > 20) return 'Room name is too long';
        return null;
      },
      speed: (value) => (value < 2 || value > 5 ? 'Invalid speed' : null),
      games: (value) =>
        value < 3 || value > 10 ? 'Invalid number of games' : null,
    },
  });
  const [selected, setSelected] = useState(0);
  const handlers = useSwipeable({
    onSwipedLeft: () => setSelected(Math.min(maps.length - 1, selected + 1)),
    onSwipedRight: () => setSelected(Math.max(0, selected - 1)),
    trackMouse: true,
  });
  const router = useRouter();

  return (
    <Flex align="center" h="100%" maw="1500px" m="0 auto">
      <Box
        component="form"
        onSubmit={form.onSubmit(() =>
          type === 'create'
            ? game.socket?.emit(
                'join',
                {
                  ...form.values,
                  map: maps[selected].name,
                  role: 'host',
                },
                () => {
                  game.role = 'host';
                  game.conf = {
                    ...form.values,
                    map: maps[selected].name,
                    isInvite: false,
                  };
                  router.push('/game/lobby');
                }
              )
            : game.socket?.emit(
                'invite',
                {
                  ...form.values,
                  map: maps[selected].name,
                  userId,
                },
                (gameId) => {
                  game.role = 'guest';
                  router.push(`/game/${gameId}`);
                }
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
                    bg={`url(${item.preview})`}
                    animate={{
                      opacity: 1 - 0.1 * Math.abs(selected - idx),
                      rotateY: 30 * Math.sign(idx - selected),
                      scale: 1 - 0.1 * Math.abs(selected - idx),
                      x: (idx - selected) * 40,
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
                  { value: 2, label: 'Slow' },
                  { value: 3, label: 'Normal' },
                  { value: 4, label: 'Fast' },
                  { value: 5, label: 'Very fast' },
                ]}
                max={5}
                min={2}
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
              {type === 'create' ? 'Create' : 'Invite'}
            </Button>
            <Button
              component={Link}
              href="/game"
              m="0 auto"
              w="12rem"
              h="2.7em"
              variant="outline"
            >
              Leave
            </Button>
          </Stack>
        </Flex>
      </Box>
    </Flex>
  );
}
