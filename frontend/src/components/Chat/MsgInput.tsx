import {
  Box,
  Button,
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

function sendMessage(content: String){
  console.log(content)
}


const useInputStyle = createStyles((theme: MantineTheme) => ({
  input: {
    border: '2px solid #87d1db',
    background: "#EAEAEA",
  },
  box:{
    display: "flex",
    width: "100%",
    height: "77px",
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    gap: theme.spacing.md,
  }
}));


export default function MsgInput() {
  const inputStyles = useInputStyle();
  let [inputValue, setInputValue] = useState('');
  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault()
        sendMessage(inputValue);
        setInputValue('');
      }}
      className={inputStyles.classes.box}
      >
      <Input
        size="lg"
        w="70%"
        h="50px"
        placeholder="Send message here..."
        radius={50}
        classNames={inputStyles.classes}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        ></Input>
      <ThemeIcon
      radius="xl"
      h="50px"
      w="50px"
      p={4}
      color="#EAEAEA"
      style={{
        border: '2px solid #87d1db',
      }}
      onClick={(event) => {
        event.preventDefault()
        sendMessage(inputValue);
        setInputValue('');
      }}>
      <img src="/images/SendIcon.svg" alt="notfound" />
    </ThemeIcon>
    </Box>
);
}