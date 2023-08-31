import { UserContext } from '@/context/user';
import { Avatar, Group, Text } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';


export default function Message({content, sendBy}) {
  const userContext = useContext(UserContext);
   return (
    userContext.data && sendBy.username === userContext.data.username ?
        <Group pb={15} w={'100%'}
        style={{
          display: 'flex',
          justifyContent: 'end'
        }} >
        <Text
          size="sm"
          color="black"
          p={10}
          maw={400}
          style={{
            border: '2px solid var(--secondary-color)',
            borderRadius: "20px 20px 0px 20px",
          }}
        >
          {content}
        </Text>
          <Avatar radius={50} size={40} src={sendBy.imgProfile} />
      </Group> :
          <Group pb={15} >
            <Avatar radius={50} size={40} src={sendBy.imgProfile} />
            <Text
              size="sm"
              color="black"
              p={10}
              maw={400}
              style={{
                border: '2px solid var(--chat-red-color)',
                borderRadius: "20px 20px 20px 0px",
              }}
            >
              {content}
            </Text>
          </Group>
  );
}
