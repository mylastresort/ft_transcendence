import { useState, useEffect, useContext } from 'react';
import {
  Container,
  SimpleGrid,
  Stack,
  Flex,
  Text,
  Space,
  Group,
  UnstyledButton,
  Image,
  Center,
  Avatar,
} from '@mantine/core';
import { GetPlayerStats, GetAchievements } from '@/pages/api/friends/friends';
import Styles from './achievements.module.css';
import { AiFillCheckCircle } from 'react-icons/ai';

function Achievements() {
  const [PlayerAchievements, setPlayerAchievements] = useState([]);

  useEffect(() => {
    GetAchievements()
      .then((res) => {})
      .catch((err) => {});
    GetPlayerStats({ username: window.location.pathname.split('/')[2] })
      .then((res) => {
        setPlayerAchievements(res.body.userAchievements);
      })
      .catch((err) => {});
  }, []);

  return (
    <div className="dash_container">
      <Container size="xl">
        <SimpleGrid cols={3}>
          {PlayerAchievements?.map((item, index) => {
            return (
              <Stack className={Styles.css_div}>
                <Flex justify="space-between" h="100%">
                  <Stack p="lg">
                    <Text fz="lg" fw={500} c="#fff">
                      {item.name}
                    </Text>
                    <Text fz="sm">{item.description}</Text>
                    <UnstyledButton>
                      <Group spacing="xs">
                        <AiFillCheckCircle
                          size="1.7rem"
                          color="var(--success-color)"
                        />{' '}
                        <Text fw={500}>Achieved</Text>
                      </Group>
                    </UnstyledButton>
                  </Stack>
                  <Center
                    style={{ borderRadius: '0 5px 5px 0' }}
                    bg="var(--primary-color)"
                    w="35%"
                  >
                    <img style={{ padding: '1em' }} src={item.icon}></img>
                  </Center>
                </Flex>
              </Stack>
            );
          })}
        </SimpleGrid>
      </Container>
    </div>
  );
}

export default Achievements;
