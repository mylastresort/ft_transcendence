import { Avatar, Group, Text } from '@mantine/core';

export default function Message({content}) {
  return (
    <Group pt={15} >
      <Avatar radius={50} size={40} src={'image'} />
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
    </Group>
  );
}
