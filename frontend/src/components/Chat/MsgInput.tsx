import { Box, Flex, Input, ThemeIcon, } from '@mantine/core';
import Styles from './Chat.module.css';

function SendButton(){
    return (
        <ThemeIcon radius="xl" size="xl" >
            <img src="/images/SendIcon.svg" alt="notfound" />
        </ThemeIcon>
    )
}

export default function MsgInput() {
  return (
    <Flex style={{ width: '100%' }} gap="md" align="center" justify="center" >
      <Input className={Styles.InputRaduis} ></Input>
      <SendButton />
    </Flex>
  );
}
