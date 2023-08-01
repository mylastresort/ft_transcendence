import { UserContext } from '@/context/user';
import { Avatar, Group, Text } from '@mantine/core';
import { useContext } from 'react';

export default function Message({content, sendBy}) {
  const userContext = useContext(UserContext);
  if (!userContext.data){return (<></>)}
  return (
     sendBy.username != userContext.data.username ?
    <Group pb={15} >
      <Avatar radius={50} size={40} src={sendBy.imgProfile} />
      <Text
        size="sm"
        color="black"
        p={10}
        maw={400}
        style={{
          border: '2px solid var(--secondary-color)',
          borderRadius: 20,
        }}
      >
        {content}
      </Text>
    </Group> :
        <Group pb={15}w={'100%'}
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
            borderRadius: 20,
          }}
        >
          {content}
        </Text>
          <Avatar radius={50} size={40} src={userContext.data.imgProfile} />
      </Group> 
  );
}
