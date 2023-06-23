import { Box, Flex, Input, ThemeIcon } from '@mantine/core';
import Styles from './Chat.module.css';
import { positions } from '@mui/system';

function SendButton() {
  return (
    <ThemeIcon
      radius="xl"
      h="50px"
      w="50px"
      p={4}
      color="#EAEAEA"
      style={{
        border: '2px solid #F31260',
      }}
    >
      <img src="/images/SendIcon.svg" alt="notfound" />
    </ThemeIcon>
  );
}

export default function MsgInput() {
  return (
    <Flex
      w="100%"
      h="77px"
      gap="lg"
      align="center"
      justify="center"
      bg="white"
    >
      <Input
        className={Styles.InputRaduis}
        size="lg"
        style={{
          
        }}
        w="70%"
        h="50px"
        radius={50}
        color="red"
    
      ></Input>
      <SendButton />
    </Flex>
  );
}
