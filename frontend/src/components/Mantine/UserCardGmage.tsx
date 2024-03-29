import {
  createStyles,
  Card,
  Avatar,
  Text,
  Group,
  Button,
  rem,
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  avatar: {
    border: `${rem(2)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
    }`,
  },
}));

interface UserCardImageProps {
  image: string;
  avatar: string;
  name: string;
  job: string;
  stats: { label: string; value: string }[];
}

const GetColor = (label: string) => {
  switch (label) {
    case 'Wins':
      return 'green';
    case 'Losses':
      return 'red';
    default:
      return 'blue';
  }
};

export function UserCardGmage({
  image,
  avatar,
  name,
  stats,
}: UserCardImageProps) {
  const { classes, theme } = useStyles();

  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text ta="center" fz="lg" color={GetColor(stat.label)} fw={500}>
        {stat.value}
      </Text>
      <Text ta="center" fz="sm" color={GetColor(stat.label)}>
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Card withBorder padding="xl" radius="md" className={classes.card}>
      <Card.Section sx={{ backgroundImage: `url(${image})`, height: 140 }} />
      <Avatar
        src={avatar}
        size={80}
        radius={80}
        mx="auto"
        mt={-30}
        className={classes.avatar}
      />
      <Text ta="center" fz="lg" fw={500} mt="sm">
        {name}
      </Text>
      <Group mt="md" position="center" spacing={30}>
        {items}
      </Group>
      {/* <Button
        fullWidth
        radius="md"
        mt="xl"
        size="md"
        color={theme.colorScheme === 'dark' ? undefined : 'dark'}
      >
        Follow
      </Button> */}
    </Card>
  );
}
