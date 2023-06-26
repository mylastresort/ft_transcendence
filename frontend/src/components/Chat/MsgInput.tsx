import {
  Box,
  Flex,
  Input,
  MantineTheme,
  ThemeIcon,
  createStyles,
} from '@mantine/core';
import Styles from './Chat.module.css';
import { positions } from '@mui/system';
import { theme } from '@nextui-org/react';
import { useState } from 'react';

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

const useInputStyle = createStyles((theme: MantineTheme) => ({
  input: {
    border: '2px solid #F31260',
    background: "#EAEAEA",
    '&:focus': {
      border: '2px solid #F31260',
    }
  },
}));

export default function MsgInput() {
  const inputStyles = useInputStyle();
  let [inputValue, setInputValue] = useState('');
  return (
    <Flex
      w="100%"
      h="77px"
      gap="lg"
      align="center"
      justify="center"
      bg="white"
      bottom={0}
    >
      <Input
        size="lg"
        w="70%"
        h="50px"
        placeholder="Send message here..."
        radius={50}
        classNames={inputStyles.classes}
        onSubmit={(event)=> console.log(event)}
      ></Input>
      <SendButton />
    </Flex>
  );
}
