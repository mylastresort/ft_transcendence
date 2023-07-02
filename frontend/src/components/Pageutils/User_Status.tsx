import {
  createStyles,
  Text,
  Card,
  RingProgress,
  Group,
  rem,
} from '@mantine/core';
import { Spacer } from '@nextui-org/react';

const useStyles = createStyles((theme) => ({
  card: {
    width: '100%',
    backgroundColor: 'var(--sidebar-color)',
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    lineHeight: 1,
    color: '#FFF',
  },

  lead: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    fontSize: rem(22),
    lineHeight: 1,
  },

  inner: {
    display: 'flex',
    flexDirection: 'column',

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  ring: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',

    [theme.fn.smallerThan('xs')]: {
      justifyContent: 'center',
      marginTop: theme.spacing.md,
    },
  },
}));

interface StatsRingCardProps {
  title: string;
  level: number;
  total: number;
  stats: {
    value: number;
    label: string;
  }[];
}

export function User_Status({
  title,
  level,
  total,
  stats,
}: StatsRingCardProps) {
  const { classes, theme } = useStyles();
  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text className={classes.label}>{stat.value}</Text>
      <Text size="xs" color="dimmed">
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Card withBorder p="xl" radius="md" className={classes.card}>
      <div className={classes.inner}>
        <Text ta="center" fz="lg" className={classes.label}>
          {title}
        </Text>
        <Spacer y={0.5} />
        <div className={classes.ring}>
          <RingProgress
            roundCaps
            thickness={6}
            size={150}
            sections={[
              { value: (level / total) * 100, color: theme.primaryColor },
            ]}
            label={
              <div>
                <Text ta="center" fz="lg" className={classes.label}>
                  {level}
                </Text>
                <Text ta="center" fz="xs" c="dimmed">
                  level
                </Text>
              </div>
            }
          />
        </div>

        <Group mt="lg" position="center">
          {items}
        </Group>
      </div>
    </Card>
  );
}
